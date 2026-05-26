import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Itinerary } from '@travel-planner/shared';
import { createApp } from '../src/app.js';
import { resetItineraries } from '../src/models/itinerary.repository.js';

beforeEach(() => {
  resetItineraries();
});

async function withServer<T>(fn: (baseUrl: string) => Promise<T>): Promise<T> {
  const app = createApp();
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const { port } = server.address() as AddressInfo;
  try {
    return await fn(`http://localhost:${port}`);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

test('POST /api/itineraries creates an itinerary with the given title', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/itineraries`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Viagem ao Japão' }),
    });
    assert.equal(res.status, 201);
    const body = (await res.json()) as Itinerary;
    assert.equal(body.title, 'Viagem ao Japão');
    assert.ok(body.id);
    assert.ok(body.createdAt);
  });
});

test('POST /api/itineraries trims the title before persisting', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/itineraries`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: '  Lisboa  ' }),
    });
    assert.equal(res.status, 201);
    const body = (await res.json()) as Itinerary;
    assert.equal(body.title, 'Lisboa');
  });
});

test('POST /api/itineraries rejects an empty title', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/itineraries`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: '   ' }),
    });
    assert.equal(res.status, 400);
  });
});

test('POST /api/itineraries rejects a missing title', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/itineraries`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
  });
});

test('GET /api/itineraries returns the created itineraries', async () => {
  await withServer(async (baseUrl) => {
    await fetch(`${baseUrl}/api/itineraries`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Paris' }),
    });
    await fetch(`${baseUrl}/api/itineraries`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Roma' }),
    });

    const res = await fetch(`${baseUrl}/api/itineraries`);
    assert.equal(res.status, 200);
    const body = (await res.json()) as Itinerary[];
    assert.equal(body.length, 2);
    assert.deepEqual(
      body.map((it) => it.title),
      ['Paris', 'Roma'],
    );
  });
});

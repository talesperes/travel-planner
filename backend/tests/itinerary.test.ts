import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import type { Itinerary } from '@travel-planner/shared';
import { createApp, type AppDeps } from '../src/app.js';
import { resetItineraries } from '../src/models/itinerary.repository.js';
import type { TokenVerifier } from '../src/middlewares/auth.js';

beforeEach(() => {
  resetItineraries();
});

function stubVerifier(map: Record<string, string>): TokenVerifier {
  return async (token) => (map[token] ? { userId: map[token] } : null);
}

const defaultTokens = { 'token-alice': 'user-alice', 'token-bob': 'user-bob' };

async function withServer<T>(
  fn: (baseUrl: string) => Promise<T>,
  deps: AppDeps = { verifyToken: stubVerifier(defaultTokens) },
): Promise<T> {
  const app = createApp(deps);
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const { port } = server.address() as AddressInfo;
  try {
    return await fn(`http://localhost:${port}`);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
}

function authHeaders(token: string): Record<string, string> {
  return {
    'content-type': 'application/json',
    authorization: `Bearer ${token}`,
  };
}

test('POST /api/itineraries creates an itinerary with the given title', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/itineraries`, {
      method: 'POST',
      headers: authHeaders('token-alice'),
      body: JSON.stringify({ title: 'Viagem ao Japão' }),
    });
    assert.equal(res.status, 201);
    const body = (await res.json()) as Itinerary;
    assert.equal(body.title, 'Viagem ao Japão');
    assert.equal(body.userId, 'user-alice');
    assert.ok(body.id);
    assert.ok(body.createdAt);
  });
});

test('POST /api/itineraries trims the title before persisting', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/itineraries`, {
      method: 'POST',
      headers: authHeaders('token-alice'),
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
      headers: authHeaders('token-alice'),
      body: JSON.stringify({ title: '   ' }),
    });
    assert.equal(res.status, 400);
  });
});

test('POST /api/itineraries rejects a missing title', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/itineraries`, {
      method: 'POST',
      headers: authHeaders('token-alice'),
      body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
  });
});

test('GET /api/itineraries returns only the caller\'s itineraries', async () => {
  await withServer(async (baseUrl) => {
    await fetch(`${baseUrl}/api/itineraries`, {
      method: 'POST',
      headers: authHeaders('token-alice'),
      body: JSON.stringify({ title: 'Paris' }),
    });
    await fetch(`${baseUrl}/api/itineraries`, {
      method: 'POST',
      headers: authHeaders('token-alice'),
      body: JSON.stringify({ title: 'Roma' }),
    });
    await fetch(`${baseUrl}/api/itineraries`, {
      method: 'POST',
      headers: authHeaders('token-bob'),
      body: JSON.stringify({ title: 'Tokyo' }),
    });

    const aliceRes = await fetch(`${baseUrl}/api/itineraries`, {
      headers: authHeaders('token-alice'),
    });
    assert.equal(aliceRes.status, 200);
    const aliceBody = (await aliceRes.json()) as Itinerary[];
    assert.deepEqual(
      aliceBody.map((it) => it.title),
      ['Paris', 'Roma'],
    );

    const bobRes = await fetch(`${baseUrl}/api/itineraries`, {
      headers: authHeaders('token-bob'),
    });
    const bobBody = (await bobRes.json()) as Itinerary[];
    assert.deepEqual(
      bobBody.map((it) => it.title),
      ['Tokyo'],
    );
  });
});

test('GET /api/itineraries without Authorization returns 401', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/itineraries`);
    assert.equal(res.status, 401);
  });
});

test('POST /api/itineraries without Authorization returns 401 and does not persist', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/itineraries`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Viagem alheia' }),
    });
    assert.equal(res.status, 401);

    const listRes = await fetch(`${baseUrl}/api/itineraries`, {
      headers: authHeaders('token-alice'),
    });
    const body = (await listRes.json()) as Itinerary[];
    assert.equal(body.length, 0);
  });
});

test('GET /api/itineraries with an invalid token returns 401', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/itineraries`, {
      headers: { authorization: 'Bearer not-a-real-token' },
    });
    assert.equal(res.status, 401);
  });
});

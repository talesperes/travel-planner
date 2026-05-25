import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import type { AddressInfo } from 'node:net';
import type { HealthResponse } from '@travel-planner/shared';

test('GET /api/health returns ok status', async () => {
  const app = createApp();
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const { port } = server.address() as AddressInfo;

  try {
    const res = await fetch(`http://localhost:${port}/api/health`);
    assert.equal(res.status, 200);
    const body = (await res.json()) as HealthResponse;
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'travel-planner-backend');
    assert.ok(body.timestamp);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

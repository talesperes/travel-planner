import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { createApp, type AppDeps } from '../src/app.js';
import type { TokenVerifier } from '../src/middlewares/auth.js';

const allowedOrigin = 'http://localhost:5173';
const attackerOrigin = 'https://attacker.example';

const stubVerifier: TokenVerifier = async () => null;

async function withServer<T>(
  fn: (baseUrl: string) => Promise<T>,
  deps: AppDeps = { verifyToken: stubVerifier, allowedOrigins: [allowedOrigin] },
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

test('CORS: request from allowed origin is reflected', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/health`, {
      headers: { origin: allowedOrigin },
    });
    assert.equal(res.headers.get('access-control-allow-origin'), allowedOrigin);
  });
});

test('CORS: request from disallowed origin is not reflected', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/health`, {
      headers: { origin: attackerOrigin },
    });
    const acao = res.headers.get('access-control-allow-origin');
    assert.notEqual(acao, attackerOrigin);
    assert.notEqual(acao, '*');
  });
});

test('CORS: preflight from disallowed origin is not approved', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/itineraries`, {
      method: 'OPTIONS',
      headers: {
        origin: attackerOrigin,
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'content-type,authorization',
      },
    });
    const acao = res.headers.get('access-control-allow-origin');
    assert.notEqual(acao, attackerOrigin);
    assert.notEqual(acao, '*');
  });
});

test('CORS: preflight from allowed origin is approved', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/itineraries`, {
      method: 'OPTIONS',
      headers: {
        origin: allowedOrigin,
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'content-type,authorization',
      },
    });
    assert.equal(res.headers.get('access-control-allow-origin'), allowedOrigin);
  });
});

test('CORS: credentials are not enabled', async () => {
  await withServer(async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/health`, {
      headers: { origin: allowedOrigin },
    });
    assert.equal(res.headers.get('access-control-allow-credentials'), null);
  });
});

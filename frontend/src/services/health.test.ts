import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchHealth } from './health.js';
import type { HealthResponse } from '@travel-planner/shared';

describe('fetchHealth', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the parsed health response on success', async () => {
    const payload: HealthResponse = {
      status: 'ok',
      service: 'travel-planner-backend',
      timestamp: '2026-05-25T00:00:00.000Z',
    };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => payload }),
    );

    const result = await fetchHealth();
    expect(result).toEqual(payload);
  });

  it('throws when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }),
    );

    await expect(fetchHealth()).rejects.toThrow('Health check failed: 500');
  });
});

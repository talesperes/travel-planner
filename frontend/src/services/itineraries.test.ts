import { describe, it, expect, vi, afterEach } from 'vitest';
import { createItinerary, fetchItineraries } from './itineraries.js';
import type { Itinerary } from '@travel-planner/shared';

describe('itineraries service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchItineraries returns the parsed list', async () => {
    const payload: Itinerary[] = [
      { id: '1', title: 'Paris', createdAt: '2026-05-25T00:00:00.000Z' },
    ];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => payload }),
    );

    const result = await fetchItineraries();
    expect(result).toEqual(payload);
  });

  it('fetchItineraries throws when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }),
    );

    await expect(fetchItineraries()).rejects.toThrow('Failed to fetch itineraries: 500');
  });

  it('createItinerary posts the title and returns the created itinerary', async () => {
    const created: Itinerary = {
      id: 'abc',
      title: 'Lisboa',
      createdAt: '2026-05-25T00:00:00.000Z',
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 201, json: async () => created });
    vi.stubGlobal('fetch', fetchMock);

    const result = await createItinerary({ title: 'Lisboa' });
    expect(result).toEqual(created);
    expect(fetchMock).toHaveBeenCalledWith('/api/itineraries', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Lisboa' }),
    });
  });

  it('createItinerary throws when the response is not ok', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({}) }),
    );

    await expect(createItinerary({ title: '' })).rejects.toThrow(
      'Failed to create itinerary: 400',
    );
  });
});

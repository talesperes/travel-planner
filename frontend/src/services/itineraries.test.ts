import { describe, it, expect, vi, afterEach } from 'vitest';
import type { Itinerary } from '@travel-planner/shared';

const getSession = vi.fn();

vi.mock('../lib/supabase.js', () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => getSession(...args),
    },
  },
}));

const { createItinerary, fetchItineraries } = await import('./itineraries.js');

function sessionWithToken(token: string | null) {
  return {
    data: { session: token ? { access_token: token } : null },
    error: null,
  };
}

describe('itineraries service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    getSession.mockReset();
  });

  it('fetchItineraries sends the Supabase access token as Bearer', async () => {
    getSession.mockResolvedValue(sessionWithToken('jwt-123'));
    const payload: Itinerary[] = [
      { id: '1', userId: 'u-1', title: 'Paris', createdAt: '2026-05-25T00:00:00.000Z' },
    ];
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: async () => payload });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchItineraries();
    expect(result).toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith('/api/itineraries', {
      headers: { authorization: 'Bearer jwt-123' },
    });
  });

  it('fetchItineraries throws when there is no active session', async () => {
    getSession.mockResolvedValue(sessionWithToken(null));
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchItineraries()).rejects.toThrow('Not authenticated');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fetchItineraries throws when the response is not ok', async () => {
    getSession.mockResolvedValue(sessionWithToken('jwt-123'));
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }),
    );

    await expect(fetchItineraries()).rejects.toThrow('Failed to fetch itineraries: 500');
  });

  it('createItinerary posts the title with the Bearer token and returns the created itinerary', async () => {
    getSession.mockResolvedValue(sessionWithToken('jwt-456'));
    const created: Itinerary = {
      id: 'abc',
      userId: 'u-1',
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
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer jwt-456',
      },
      body: JSON.stringify({ title: 'Lisboa' }),
    });
  });

  it('createItinerary throws when there is no active session', async () => {
    getSession.mockResolvedValue(sessionWithToken(null));
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(createItinerary({ title: 'Lisboa' })).rejects.toThrow('Not authenticated');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('createItinerary throws when the response is not ok', async () => {
    getSession.mockResolvedValue(sessionWithToken('jwt-456'));
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 400, json: async () => ({}) }),
    );

    await expect(createItinerary({ title: '' })).rejects.toThrow(
      'Failed to create itinerary: 400',
    );
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('../lib/supabase.js', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'test-token' } },
        error: null,
      }),
    },
  },
}));

const { Home } = await import('./Home.js');

describe('Home', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : input.toString();
        if (url.includes('/api/itineraries')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => [],
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            status: 'ok',
            service: 'travel-planner-backend',
            timestamp: '2026-05-25T00:00:00.000Z',
          }),
        });
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the welcome hero with primary CTA', () => {
    const html = renderToStaticMarkup(<Home />);
    expect(html).toContain('Bem-vindo de volta');
    expect(html).toContain('Criar nova viagem');
  });

  it('renders the main dashboard sections', () => {
    const html = renderToStaticMarkup(<Home />);
    expect(html).toContain('Visão geral');
    expect(html).toContain('Novo roteiro');
    expect(html).toContain('Meus roteiros');
    expect(html).toContain('Atalhos rápidos');
  });

  it('renders the CreateItineraryForm in the new itinerary section', () => {
    const html = renderToStaticMarkup(<Home />);
    expect(html).toContain('Título do roteiro');
    expect(html).toContain('Criar roteiro');
  });

  it('renders a backend status footer placeholder before the health check resolves', () => {
    const html = renderToStaticMarkup(<Home />);
    expect(html).toContain('verificando...');
  });
});

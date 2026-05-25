import { useEffect, useState } from 'react';
import { fetchHealth } from './services/health.js';
import type { HealthResponse } from '@travel-planner/shared';

export function App(): JSX.Element {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  return (
    <main>
      <h1>Travel Planner</h1>
      <p>Frontend inicial pronto.</p>
      <section>
        <h2>Backend status</h2>
        {error ? <p>Erro: {error}</p> : null}
        {health ? (
          <pre>{JSON.stringify(health, null, 2)}</pre>
        ) : (
          !error && <p>Carregando...</p>
        )}
      </section>
    </main>
  );
}

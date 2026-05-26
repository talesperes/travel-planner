import { useEffect, useState } from 'react';
import type { Itinerary } from '@travel-planner/shared';
import { CreateItineraryForm } from './components/CreateItineraryForm.js';
import { fetchItineraries } from './services/itineraries.js';

export function App(): JSX.Element {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetchItineraries()
      .then(setItineraries)
      .catch((err: unknown) =>
        setLoadError(err instanceof Error ? err.message : String(err)),
      );
  }, []);

  function handleCreated(itinerary: Itinerary): void {
    setItineraries((prev) => [...prev, itinerary]);
  }

  return (
    <main>
      <h1>Travel Planner</h1>
      <section>
        <h2>Novo roteiro</h2>
        <CreateItineraryForm onCreated={handleCreated} />
      </section>
      <section>
        <h2>Meus roteiros</h2>
        {loadError ? <p>Erro ao carregar roteiros: {loadError}</p> : null}
        {itineraries.length === 0 && !loadError ? (
          <p>Nenhum roteiro criado ainda.</p>
        ) : (
          <ul>
            {itineraries.map((it) => (
              <li key={it.id}>{it.title}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

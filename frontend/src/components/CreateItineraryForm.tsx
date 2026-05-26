import { useState, type FormEvent } from 'react';
import type { Itinerary } from '@travel-planner/shared';
import { createItinerary } from '../services/itineraries.js';

interface Props {
  onCreated: (itinerary: Itinerary) => void;
}

export function CreateItineraryForm({ onCreated }: Props): JSX.Element {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError('Informe um título para o roteiro.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const itinerary = await createItinerary({ title: trimmed });
      onCreated(itinerary);
      setTitle('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="itinerary-title">Título do roteiro</label>
      <input
        id="itinerary-title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ex.: Viagem ao Japão"
        disabled={submitting}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Criando...' : 'Criar roteiro'}
      </button>
      {error ? <p role="alert">Erro: {error}</p> : null}
    </form>
  );
}

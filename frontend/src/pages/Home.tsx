import { useEffect, useRef, useState } from 'react';
import type { HealthResponse, Itinerary } from '@travel-planner/shared';
import { CreateItineraryForm } from '../components/CreateItineraryForm.js';
import { fetchHealth } from '../services/health.js';
import { fetchItineraries } from '../services/itineraries.js';
import styles from './Home.module.css';

interface QuickAction {
  id: string;
  title: string;
  description: string;
}

interface HomeProps {
  onSignOut?: () => void;
}

const quickActions: QuickAction[] = [
  {
    id: 'invite',
    title: 'Convidar acompanhante',
    description: 'Planeje em conjunto com amigos ou família.',
  },
  {
    id: 'checklist',
    title: 'Checklist de bagagem',
    description: 'Gere uma lista do que levar na próxima viagem.',
  },
  {
    id: 'explore',
    title: 'Explorar destinos',
    description: 'Encontre inspiração para a sua próxima viagem.',
  },
];

function formatDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) {
    return iso;
  }
  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function Home({ onSignOut }: HomeProps = {}): JSX.Element {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [itinerariesLoaded, setItinerariesLoaded] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch((err: unknown) =>
        setHealthError(err instanceof Error ? err.message : String(err)),
      );
  }, []);

  useEffect(() => {
    fetchItineraries()
      .then((data) => {
        setItineraries(data);
        setItinerariesLoaded(true);
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : String(err));
        setItinerariesLoaded(true);
      });
  }, []);

  function handleCreated(itinerary: Itinerary): void {
    setItineraries((prev) => [...prev, itinerary]);
  }

  function focusNewItineraryForm(): void {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    formRef.current?.querySelector<HTMLInputElement>('#itinerary-title')?.focus();
  }

  const nextTrip = itineraries[0];

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-hero-title">
        <p className={styles.heroEyebrow}>Travel Planner</p>
        <h1 id="home-hero-title" className={styles.heroTitle}>
          Bem-vindo de volta!
        </h1>
        <p className={styles.heroSubtitle}>
          Sua próxima aventura está a poucos cliques. Continue planejando ou comece algo novo.
        </p>
        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={focusNewItineraryForm}
          >
            Criar nova viagem
          </button>
          <button type="button" className={styles.secondaryButton}>
            Explorar destinos
          </button>
          {onSignOut ? (
            <button type="button" className={styles.secondaryButton} onClick={onSignOut}>
              Sair
            </button>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="home-stats-title">
        <h2 id="home-stats-title" className={styles.sectionTitle}>
          Visão geral
        </h2>
        <ul className={styles.stats}>
          <li className={styles.statCard}>
            <span className={styles.statLabel}>Roteiros criados</span>
            <span className={styles.statValue}>{itineraries.length}</span>
          </li>
          <li className={styles.statCard}>
            <span className={styles.statLabel}>Próximo roteiro</span>
            <span className={styles.statValue}>{nextTrip?.title ?? '—'}</span>
          </li>
          <li className={styles.statCard}>
            <span className={styles.statLabel}>Criado em</span>
            <span className={styles.statValue}>
              {nextTrip ? formatDate(nextTrip.createdAt) : '—'}
            </span>
          </li>
        </ul>
      </section>

      <section aria-labelledby="home-new-title" ref={formRef}>
        <h2 id="home-new-title" className={styles.sectionTitle}>
          Novo roteiro
        </h2>
        <CreateItineraryForm onCreated={handleCreated} />
      </section>

      <section aria-labelledby="home-trips-title">
        <h2 id="home-trips-title" className={styles.sectionTitle}>
          Meus roteiros
        </h2>
        {loadError ? (
          <p className={styles.placeholder}>Erro ao carregar roteiros: {loadError}</p>
        ) : null}
        {itineraries.length === 0 && !loadError ? (
          <p className={styles.placeholder}>
            {itinerariesLoaded
              ? 'Nenhum roteiro criado ainda. Use o formulário acima para começar.'
              : 'Carregando roteiros...'}
          </p>
        ) : (
          <ul className={styles.tripList}>
            {itineraries.map((itinerary) => (
              <li key={itinerary.id} className={styles.tripCard}>
                <span className={styles.tripStatus}>Roteiro</span>
                <p className={styles.tripDestination}>{itinerary.title}</p>
                <p className={styles.tripDates}>
                  Criado em {formatDate(itinerary.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="home-actions-title">
        <h2 id="home-actions-title" className={styles.sectionTitle}>
          Atalhos rápidos
        </h2>
        <ul className={styles.quickActions}>
          {quickActions.map((action) => (
            <li key={action.id}>
              <button type="button" className={styles.quickAction}>
                <span className={styles.quickActionTitle}>{action.title}</span>
                <span className={styles.quickActionDescription}>{action.description}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <footer className={styles.footer}>
        <span>
          <span
            className={`${styles.statusDot} ${
              healthError
                ? styles.statusError
                : health
                  ? styles.statusOk
                  : styles.statusLoading
            }`}
            aria-hidden="true"
          />
          Backend:{' '}
          {healthError
            ? `indisponível (${healthError})`
            : health
              ? `${health.service} • ${health.status}`
              : 'verificando...'}
        </span>
      </footer>
    </div>
  );
}

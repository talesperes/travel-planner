import type { CreateItineraryInput, Itinerary } from '@travel-planner/shared';

export async function fetchItineraries(): Promise<Itinerary[]> {
  const res = await fetch('/api/itineraries');
  if (!res.ok) {
    throw new Error(`Failed to fetch itineraries: ${res.status}`);
  }
  return (await res.json()) as Itinerary[];
}

export async function createItinerary(input: CreateItineraryInput): Promise<Itinerary> {
  const res = await fetch('/api/itineraries', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to create itinerary: ${res.status}`);
  }
  return (await res.json()) as Itinerary;
}

import { randomUUID } from 'node:crypto';
import type { Itinerary } from '@travel-planner/shared';

const itineraries: Itinerary[] = [];

export function listItineraries(): Itinerary[] {
  return [...itineraries];
}

export function createItinerary(title: string): Itinerary {
  const itinerary: Itinerary = {
    id: randomUUID(),
    title,
    createdAt: new Date().toISOString(),
  };
  itineraries.push(itinerary);
  return itinerary;
}

export function resetItineraries(): void {
  itineraries.length = 0;
}

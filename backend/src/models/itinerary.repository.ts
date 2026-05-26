import { randomUUID } from 'node:crypto';
import type { Itinerary } from '@travel-planner/shared';

const itineraries: Itinerary[] = [];

export function listItineraries(userId: string): Itinerary[] {
  return itineraries.filter((it) => it.userId === userId);
}

export function createItinerary(input: { title: string; userId: string }): Itinerary {
  const itinerary: Itinerary = {
    id: randomUUID(),
    userId: input.userId,
    title: input.title,
    createdAt: new Date().toISOString(),
  };
  itineraries.push(itinerary);
  return itinerary;
}

export function resetItineraries(): void {
  itineraries.length = 0;
}

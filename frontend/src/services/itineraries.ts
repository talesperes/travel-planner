import type { CreateItineraryInput, Itinerary } from '@travel-planner/shared';
import { supabase } from '../lib/supabase.js';

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw new Error('Not authenticated');
  }
  return token;
}

export async function fetchItineraries(): Promise<Itinerary[]> {
  const token = await getAccessToken();
  const res = await fetch('/api/itineraries', {
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch itineraries: ${res.status}`);
  }
  return (await res.json()) as Itinerary[];
}

export async function createItinerary(input: CreateItineraryInput): Promise<Itinerary> {
  const token = await getAccessToken();
  const res = await fetch('/api/itineraries', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`Failed to create itinerary: ${res.status}`);
  }
  return (await res.json()) as Itinerary;
}

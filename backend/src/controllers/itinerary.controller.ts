import type { Request, Response } from 'express';
import type { CreateItineraryInput, Itinerary } from '@travel-planner/shared';
import { createItinerary, listItineraries } from '../models/itinerary.repository.js';

interface ErrorResponse {
  error: string;
}

export function getItineraries(_req: Request, res: Response<Itinerary[]>): void {
  res.json(listItineraries());
}

export function postItinerary(
  req: Request<unknown, unknown, Partial<CreateItineraryInput>>,
  res: Response<Itinerary | ErrorResponse>,
): void {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  if (!title) {
    res.status(400).json({ error: 'title is required' });
    return;
  }

  const itinerary = createItinerary(title);
  res.status(201).json(itinerary);
}

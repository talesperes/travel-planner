import { Router } from 'express';
import { getItineraries, postItinerary } from '../controllers/itinerary.controller.js';

export const itineraryRouter = Router();

itineraryRouter.get('/', getItineraries);
itineraryRouter.post('/', postItinerary);

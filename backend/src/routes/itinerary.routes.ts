import { Router } from 'express';
import { getItineraries, postItinerary } from '../controllers/itinerary.controller.js';
import { createRequireAuth, type TokenVerifier } from '../middlewares/auth.js';

export function createItineraryRouter(verifyToken: TokenVerifier): Router {
  const router = Router();
  const requireAuth = createRequireAuth(verifyToken);
  router.get('/', requireAuth, getItineraries);
  router.post('/', requireAuth, postItinerary);
  return router;
}

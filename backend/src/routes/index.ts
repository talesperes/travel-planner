import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { createItineraryRouter } from './itinerary.routes.js';
import type { TokenVerifier } from '../middlewares/auth.js';

export function createApiRouter(verifyToken: TokenVerifier): Router {
  const apiRouter = Router();
  apiRouter.use('/health', healthRouter);
  apiRouter.use('/itineraries', createItineraryRouter(verifyToken));
  return apiRouter;
}

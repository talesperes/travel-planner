import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { itineraryRouter } from './itinerary.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/itineraries', itineraryRouter);

import express, { type Express } from 'express';
import cors from 'cors';
import { apiRouter } from './routes/index.js';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', apiRouter);

  return app;
}

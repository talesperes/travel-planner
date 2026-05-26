import express, { type Express } from 'express';
import cors from 'cors';
import { createApiRouter } from './routes/index.js';
import type { TokenVerifier } from './middlewares/auth.js';
import { verifySupabaseToken } from './services/supabaseAuth.js';

export interface AppDeps {
  verifyToken?: TokenVerifier;
}

export function createApp(deps: AppDeps = {}): Express {
  const verifyToken = deps.verifyToken ?? verifySupabaseToken;
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', createApiRouter(verifyToken));

  return app;
}

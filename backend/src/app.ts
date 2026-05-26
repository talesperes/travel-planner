import express, { type Express } from 'express';
import cors from 'cors';
import { createApiRouter } from './routes/index.js';
import type { TokenVerifier } from './middlewares/auth.js';
import { verifySupabaseToken } from './services/supabaseAuth.js';
import { env } from './config/env.js';

export interface AppDeps {
  verifyToken?: TokenVerifier;
  allowedOrigins?: string[];
}

export function createApp(deps: AppDeps = {}): Express {
  const verifyToken = deps.verifyToken ?? verifySupabaseToken;
  const allowedOrigins = deps.allowedOrigins ?? env.frontendOrigins;
  const app = express();

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: false,
    }),
  );
  app.use(express.json());

  app.use('/api', createApiRouter(verifyToken));

  return app;
}

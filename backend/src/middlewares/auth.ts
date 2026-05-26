import type { Request, RequestHandler, Response, NextFunction } from 'express';

export interface AuthenticatedUser {
  userId: string;
}

export type TokenVerifier = (token: string) => Promise<AuthenticatedUser | null>;

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AuthenticatedUser;
  }
}

export function createRequireAuth(verifyToken: TokenVerifier): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const header = req.header('authorization') ?? req.header('Authorization');
    const match = header?.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      res.status(401).json({ error: 'missing or malformed authorization header' });
      return;
    }
    try {
      const token = match[1]!.trim();
      const user = await verifyToken(token);
      if (!user) {
        res.status(401).json({ error: 'invalid or expired token' });
        return;
      }
      req.auth = user;
      next();
    } catch {
      res.status(401).json({ error: 'invalid or expired token' });
    }
  };
}

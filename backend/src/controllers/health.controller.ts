import type { Request, Response } from 'express';
import type { HealthResponse } from '@travel-planner/shared';

export function getHealth(_req: Request, res: Response<HealthResponse>): void {
  res.json({
    status: 'ok',
    service: 'travel-planner-backend',
    timestamp: new Date().toISOString(),
  });
}

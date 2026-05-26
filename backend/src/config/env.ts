const nodeEnv = process.env.NODE_ENV ?? 'development';

function parseFrontendOrigins(raw: string | undefined, env: string): string[] {
  const parsed = (raw ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter((o) => o.length > 0);
  if (parsed.length > 0) return parsed;
  if (env === 'production') {
    throw new Error(
      'FRONTEND_ORIGIN is required in production: set it to the comma-separated list of allowed frontend origins.',
    );
  }
  return ['http://localhost:5173'];
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv,
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? '',
  frontendOrigins: parseFrontendOrigins(process.env.FRONTEND_ORIGIN, nodeEnv),
};

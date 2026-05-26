import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
import type { AuthenticatedUser, TokenVerifier } from '../middlewares/auth.js';

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      'Supabase not configured: set SUPABASE_URL and SUPABASE_ANON_KEY in the backend environment.',
    );
  }
  client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export const verifySupabaseToken: TokenVerifier = async (
  token: string,
): Promise<AuthenticatedUser | null> => {
  const { data, error } = await getClient().auth.getUser(token);
  if (error || !data?.user) return null;
  return { userId: data.user.id };
};

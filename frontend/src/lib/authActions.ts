import type { AuthError, AuthResponse, AuthOtpResponse } from '@supabase/supabase-js';
import { supabase } from './supabase.js';

export type OtpRequestResult = { error: AuthError | null };
export type OtpVerifyResult = { error: AuthError | null };

export async function requestSignUpOtp(email: string, name: string): Promise<OtpRequestResult> {
  const response: AuthOtpResponse = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      data: { name },
    },
  });
  return { error: response.error };
}

export async function requestLoginOtp(email: string): Promise<OtpRequestResult> {
  const response: AuthOtpResponse = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });
  return { error: response.error };
}

export async function verifyEmailOtp(email: string, token: string): Promise<OtpVerifyResult> {
  const response: AuthResponse = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  return { error: response.error };
}

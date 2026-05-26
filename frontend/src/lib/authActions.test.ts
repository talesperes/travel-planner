import { describe, it, expect, beforeEach, vi } from 'vitest';

const signInWithOtp = vi.fn();
const verifyOtp = vi.fn();

vi.mock('./supabase.js', () => ({
  supabase: {
    auth: {
      signInWithOtp: (...args: unknown[]) => signInWithOtp(...args),
      verifyOtp: (...args: unknown[]) => verifyOtp(...args),
    },
  },
}));

const { requestSignUpOtp, requestLoginOtp, verifyEmailOtp } = await import('./authActions.js');

describe('requestSignUpOtp', () => {
  beforeEach(() => {
    signInWithOtp.mockReset();
    verifyOtp.mockReset();
  });

  it('sends email, name in user_metadata and shouldCreateUser=true', async () => {
    signInWithOtp.mockResolvedValue({ data: {}, error: null });

    const result = await requestSignUpOtp('alice@example.com', 'Alice');

    expect(signInWithOtp).toHaveBeenCalledTimes(1);
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: 'alice@example.com',
      options: {
        shouldCreateUser: true,
        data: { name: 'Alice' },
      },
    });
    expect(result.error).toBeNull();
  });

  it('passes through the supabase error so the caller can render it', async () => {
    const error = { name: 'AuthApiError', message: 'rate limit' };
    signInWithOtp.mockResolvedValue({ data: {}, error });

    const result = await requestSignUpOtp('alice@example.com', 'Alice');

    expect(result.error).toBe(error);
  });
});

describe('requestLoginOtp', () => {
  beforeEach(() => {
    signInWithOtp.mockReset();
    verifyOtp.mockReset();
  });

  it('sends email with shouldCreateUser=false (never auto-creates accounts on login)', async () => {
    signInWithOtp.mockResolvedValue({ data: {}, error: null });

    const result = await requestLoginOtp('bob@example.com');

    expect(signInWithOtp).toHaveBeenCalledTimes(1);
    expect(signInWithOtp).toHaveBeenCalledWith({
      email: 'bob@example.com',
      options: { shouldCreateUser: false },
    });
    expect(result.error).toBeNull();
  });

  it('passes through the supabase error', async () => {
    const error = { name: 'AuthApiError', message: 'user not found' };
    signInWithOtp.mockResolvedValue({ data: {}, error });

    const result = await requestLoginOtp('bob@example.com');

    expect(result.error).toBe(error);
  });
});

describe('verifyEmailOtp', () => {
  beforeEach(() => {
    signInWithOtp.mockReset();
    verifyOtp.mockReset();
  });

  it('verifies with type=email and the provided token', async () => {
    verifyOtp.mockResolvedValue({ data: { session: null, user: null }, error: null });

    const result = await verifyEmailOtp('alice@example.com', '123456');

    expect(verifyOtp).toHaveBeenCalledTimes(1);
    expect(verifyOtp).toHaveBeenCalledWith({
      email: 'alice@example.com',
      token: '123456',
      type: 'email',
    });
    expect(result.error).toBeNull();
  });

  it('passes through the supabase error on bad code', async () => {
    const error = { name: 'AuthApiError', message: 'invalid token' };
    verifyOtp.mockResolvedValue({ data: { session: null, user: null }, error });

    const result = await verifyEmailOtp('alice@example.com', '000000');

    expect(result.error).toBe(error);
  });
});

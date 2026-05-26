import { useState, type FormEvent } from 'react';
import { requestLoginOtp, verifyEmailOtp } from '../lib/authActions.js';

interface LoginProps {
  onSwitchToSignUp: () => void;
}

type Stage = 'form' | 'otp';

export function Login({ onSwitchToSignUp }: LoginProps): JSX.Element {
  const [stage, setStage] = useState<Stage>('form');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleRequestOtp(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: otpError } = await requestLoginOtp(email);
    setSubmitting(false);
    if (otpError) {
      setError(otpError.message);
      return;
    }
    setStage('otp');
  }

  async function handleVerifyOtp(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: verifyError } = await verifyEmailOtp(email, otp);
    setSubmitting(false);
    if (verifyError) {
      setError(verifyError.message);
    }
  }

  return (
    <section className="auth-card">
      <h2>Entrar</h2>
      {stage === 'form' ? (
        <form onSubmit={handleRequestOtp}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Enviando...' : 'Receber código por email'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp}>
          <p>
            Enviamos um código para <strong>{email}</strong>. Cole aqui para entrar.
          </p>
          <label htmlFor="login-otp">Código</label>
          <input
            id="login-otp"
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            autoComplete="one-time-code"
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Validando...' : 'Entrar'}
          </button>
          <button type="button" className="link" onClick={() => setStage('form')}>
            Alterar email
          </button>
        </form>
      )}
      {error ? <p className="auth-error">{error}</p> : null}
      <p>
        Ainda não tem conta?{' '}
        <button type="button" className="link" onClick={onSwitchToSignUp}>
          Criar conta
        </button>
      </p>
    </section>
  );
}

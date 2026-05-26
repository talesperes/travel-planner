import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabase.js';

interface SignUpProps {
  onSwitchToLogin: () => void;
}

type Stage = 'form' | 'otp';

export function SignUp({ onSwitchToLogin }: SignUpProps): JSX.Element {
  const [stage, setStage] = useState<Stage>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleRequestOtp(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: { name },
      },
    });
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
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });
    setSubmitting(false);
    if (verifyError) {
      setError(verifyError.message);
    }
  }

  return (
    <section className="auth-card">
      <h2>Criar conta</h2>
      {stage === 'form' ? (
        <form onSubmit={handleRequestOtp}>
          <label htmlFor="signup-name">Nome</label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
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
            Enviamos um código para <strong>{email}</strong>. Cole aqui para confirmar o cadastro.
          </p>
          <label htmlFor="signup-otp">Código</label>
          <input
            id="signup-otp"
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            autoComplete="one-time-code"
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Validando...' : 'Confirmar código'}
          </button>
          <button type="button" className="link" onClick={() => setStage('form')}>
            Alterar email
          </button>
        </form>
      )}
      {error ? <p className="auth-error">{error}</p> : null}
      <p>
        Já tem conta?{' '}
        <button type="button" className="link" onClick={onSwitchToLogin}>
          Fazer login
        </button>
      </p>
    </section>
  );
}

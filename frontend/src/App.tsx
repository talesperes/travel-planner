import { useState } from 'react';
import { useAuth } from './hooks/useAuth.js';
import { SignUp } from './pages/SignUp.js';
import { Login } from './pages/Login.js';
import { Home } from './pages/Home.js';

type AuthView = 'login' | 'signup';

export function App(): JSX.Element {
  const { session, loading, error, signOut } = useAuth();
  const [view, setView] = useState<AuthView>('login');

  return (
    <main>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <div role="alert">
          <p>Não foi possível inicializar a sessão: {error.message}</p>
          <button type="button" onClick={() => window.location.reload()}>
            Tentar novamente
          </button>
        </div>
      ) : session ? (
        <Home onSignOut={signOut} />
      ) : view === 'login' ? (
        <Login onSwitchToSignUp={() => setView('signup')} />
      ) : (
        <SignUp onSwitchToLogin={() => setView('login')} />
      )}
    </main>
  );
}

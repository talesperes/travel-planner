import { useState } from 'react';
import { useAuth } from './hooks/useAuth.js';
import { SignUp } from './pages/SignUp.js';
import { Login } from './pages/Login.js';
import { Home } from './pages/Home.js';

type AuthView = 'login' | 'signup';

export function App(): JSX.Element {
  const { session, loading, signOut } = useAuth();
  const [view, setView] = useState<AuthView>('login');

  return (
    <main>
      {loading ? (
        <p>Carregando...</p>
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

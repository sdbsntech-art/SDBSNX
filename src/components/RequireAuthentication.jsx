import React, { useEffect } from 'react';
import { navigateToPath } from '../lib/navigation';
import { useAuth } from '../context/AuthContext';
import '../styles/admin.css';

export default function RequireAuthentication({ children }) {
  const { user, loading, configurationError } = useAuth();

  useEffect(() => {
    if (!loading && !configurationError && !user) {
      navigateToPath('/connexion', { replace: true });
    }
  }, [configurationError, loading, user]);

  if (loading) {
    return (
      <main className="admin-gate" aria-live="polite">
        <div className="admin-gate-card">Vérification de la session…</div>
      </main>
    );
  }

  if (configurationError) {
    return (
      <main className="admin-gate">
        <section className="admin-gate-card" role="alert">
          <h1>Connexion indisponible</h1>
          <p>Le service d’authentification ne répond pas. Vérifiez la configuration Supabase du déploiement, puis réessayez.</p>
          <button type="button" className="admin-button admin-button-secondary" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </section>
      </main>
    );
  }

  if (!user) return null;
  return children;
}

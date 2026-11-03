import React, { useEffect } from 'react';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { navigateToPath } from '../lib/navigation';

export default function RequireRole({ roles, children }) {
  const { user, role, loading, roleError } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigateToPath('/connexion', { replace: true });
  }, [loading, user]);

  if (loading) {
    return (
      <main className="admin-gate" aria-live="polite">
        <div className="admin-gate-card">Vérification de la session…</div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (roleError || !roles.includes(role)) {
    return (
      <main className="admin-gate">
        <section className="admin-gate-card" role="alert">
          <ShieldAlert size={32} />
          <h1>Accès refusé</h1>
          <p>
            {roleError
              ? 'Votre rôle ne peut pas être vérifié. Réessayez plus tard ou contactez un administrateur.'
              : 'Votre compte ne dispose pas des droits nécessaires pour accéder à cet espace.'}
          </p>
          <button type="button" className="admin-button admin-button-secondary" onClick={() => navigateToPath('/')}>
            <ArrowLeft size={17} /> Retour au site
          </button>
        </section>
      </main>
    );
  }

  return children;
}

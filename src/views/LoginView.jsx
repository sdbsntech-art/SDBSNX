import React, { useState } from 'react';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { navigateToPath } from '../lib/navigation';
import '../styles/admin.css';

export default function LoginView() {
  const { signInWithPassword, signInWithMagicLink, configurationError, user, role, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!loading && user && !submitting) {
      navigateToPath(role === 'admin' || role === 'editor' ? '/admin' : '/', { replace: true });
    }
  }, [loading, role, submitting, user]);

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const result = await signInWithPassword(email.trim(), password);
      if (result.error) {
        setError('Connexion impossible. Vérifiez vos informations ou réessayez plus tard.');
      } else {
        navigateToPath(result.role === 'admin' || result.role === 'editor' ? '/admin' : '/', { replace: true });
      }
    } catch (signInError) {
      if (import.meta.env.DEV) console.error('Password sign-in failed:', signInError);
      setError('Connexion impossible. Vérifiez vos informations ou réessayez plus tard.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMagicLink = async () => {
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const result = await signInWithMagicLink(email.trim());
      if (result.error) {
        if (import.meta.env.DEV) console.error('Magic-link sign-in failed:', result.error);
        setError('Impossible d’envoyer le lien. Vérifiez votre adresse ou réessayez plus tard.');
      } else {
        setMessage('Si cette adresse peut recevoir un lien de connexion, un message vient d’être envoyé.');
      }
    } catch (signInError) {
      if (import.meta.env.DEV) console.error('Magic-link sign-in failed:', signInError);
      setError('Impossible d’envoyer le lien. Vérifiez votre adresse ou réessayez plus tard.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-back-link"><ShieldCheck size={17} /> Accès sécurisé</div>
      <section className="admin-login-card">
        <div className="admin-login-mark"><ShieldCheck size={26} /></div>
        <p className="admin-eyebrow">SDBSNX · espace privé</p>
        <h1>Connexion</h1>
        <p className="admin-muted">Connectez-vous pour accéder au site et à son espace de gestion.</p>
        {configurationError && (
          <p className="admin-alert admin-alert-error" role="alert">
            Le service de connexion n’est pas disponible. Vérifiez la configuration Supabase côté déploiement.
          </p>
        )}

        <form className="admin-form" onSubmit={handlePasswordSubmit}>
          <label htmlFor="admin-email">Adresse e-mail</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="admin-password">Mot de passe</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && <p className="admin-alert admin-alert-error" role="alert">{error}</p>}
          {message && <p className="admin-alert admin-alert-success" role="status">{message}</p>}

          <button className="admin-button admin-button-primary admin-button-full" type="submit" disabled={submitting}>
            <KeyRound size={17} /> {submitting ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className="admin-login-divider"><span>ou</span></div>
        <button
          className="admin-button admin-button-secondary admin-button-full"
          type="button"
          disabled={submitting || !email.trim()}
          onClick={handleMagicLink}
        >
          <Mail size={17} /> Recevoir un lien de connexion
        </button>
        <p className="admin-login-footnote">L’accès dépend du rôle attribué à votre compte dans Supabase.</p>
        <p className="admin-login-footnote">Le compte doit exister dans le nouveau projet Supabase. L’accès à l’administration nécessite le rôle `admin` ou `editor` dans `user_roles`.</p>
      </section>
    </main>
  );
}

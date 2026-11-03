import React, { useState } from 'react';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { navigateToPath } from '../lib/navigation';
import '../styles/admin.css';

function getEmailAuthErrorMessage(error, mode) {
  const code = error?.code;
  const status = error?.status;
  const providerMessage = String(error?.message || '').toLowerCase();

  if (mode === 'login') {
    if (
      code === 'invalid_credentials'
      || code === 'user_not_found'
      || providerMessage.includes('invalid login credentials')
    ) {
      return 'Adresse e-mail ou mot de passe incorrect. Si vous avez créé ce compte avec Google, utilisez le bouton « Continuer avec Google ».';
    }
    if (code === 'email_not_confirmed' || providerMessage.includes('email not confirmed')) {
      return 'Confirmez votre adresse avec le lien reçu par e-mail, puis réessayez.';
    }
  }

  if (mode === 'signup') {
    if (code === 'weak_password') {
      return 'Ce mot de passe est trop faible. Choisissez-en un autre conformément aux exigences indiquées par Supabase.';
    }
    if (code === 'email_address_invalid') {
      return 'Cette adresse e-mail n’est pas acceptée. Vérifiez-la et réessayez.';
    }
    if (code === 'signup_disabled') {
      return 'Les inscriptions par e-mail sont désactivées. Contactez l’administrateur ou essayez Google si cette option est activée.';
    }
    if (code === 'user_already_exists' || code === 'email_exists') {
      return 'Un compte existe peut-être déjà avec cette adresse. Essayez de vous connecter ou utilisez Google si ce compte y a été créé.';
    }
  }

  if (status === 429 || code === 'over_request_rate_limit' || code === 'over_email_send_rate_limit') {
    return 'Trop de tentatives ont été effectuées. Attendez quelques minutes avant de réessayer.';
  }
  if (status >= 500) {
    return 'Le service de connexion rencontre un problème temporaire. Réessayez un peu plus tard.';
  }

  return mode === 'signup'
    ? 'Inscription impossible pour le moment. Vérifiez les paramètres d’inscription du nouveau projet Supabase puis réessayez.'
    : 'Connexion impossible pour le moment. Vérifiez que ce compte existe dans le nouveau projet Supabase.';
}

export default function LoginView() {
  const {
    signInWithPassword,
    signInWithMagicLink,
    signUpWithPassword,
    signInWithGoogle,
    configurationError,
    user,
    role,
    loading,
  } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!loading && user && !submitting) {
      navigateToPath(role === 'admin' ? '/admin' : '/', { replace: true });
    }
  }, [loading, role, submitting, user]);

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await signUpWithPassword(email.trim(), password);
        if (signUpError) {
          if (import.meta.env.DEV) console.error('Email signup failed:', signUpError);
          setError(getEmailAuthErrorMessage(signUpError, mode));
        } else if (data.session) {
          navigateToPath('/', { replace: true });
        } else {
          setMessage('Inscription enregistrée. Vérifiez votre boîte e-mail pour confirmer votre adresse avant de vous connecter.');
        }
      } else {
        const result = await signInWithPassword(email.trim(), password);
        if (result.error) {
          if (import.meta.env.DEV) console.error('Password sign-in failed:', result.error);
          setError(getEmailAuthErrorMessage(result.error, mode));
        } else {
          navigateToPath(result.role === 'admin' ? '/admin' : '/', { replace: true });
        }
      }
    } catch (authError) {
      if (import.meta.env.DEV) console.error('Email authentication failed:', authError);
      setError(mode === 'signup'
        ? 'Le service d’inscription est momentanément inaccessible. Vérifiez votre connexion puis réessayez.'
        : 'Le service de connexion est momentanément inaccessible. Vérifiez votre connexion puis réessayez.');
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

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) {
        if (import.meta.env.DEV) console.error('Google sign-in failed:', googleError);
        setError('Connexion Google indisponible. Réessayez plus tard.');
        setSubmitting(false);
      }
    } catch (googleError) {
      if (import.meta.env.DEV) console.error('Google sign-in failed:', googleError);
      setError('Connexion Google indisponible. Vérifiez la configuration Supabase puis réessayez.');
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode((currentMode) => currentMode === 'login' ? 'signup' : 'login');
    setError('');
    setMessage('');
  };

  return (
    <main className="admin-login-page">
      <div className="admin-back-link"><ShieldCheck size={17} /> Accès sécurisé</div>
      <section className="admin-login-card">
        <div className="admin-login-mark"><ShieldCheck size={26} /></div>
        <p className="admin-eyebrow">SDBSNX · espace apprenant</p>
        <h1>{mode === 'signup' ? 'Créer un compte' : 'Connexion'}</h1>
        <p className="admin-muted">
          {mode === 'signup'
            ? 'Inscrivez-vous pour accéder aux cours, révisions et ressources.'
            : 'Connectez-vous pour retrouver les cours et ressources du site.'}
        </p>
        {configurationError && (
          <p className="admin-alert admin-alert-error" role="alert">
            Le service de connexion n’est pas disponible. Vérifiez la configuration Supabase côté déploiement.
          </p>
        )}

        <button
          className="admin-button admin-button-secondary admin-button-full"
          type="button"
          disabled={submitting}
          onClick={handleGoogleSignIn}
        >
          <span className="admin-google-mark" aria-hidden="true">G</span>
          {mode === 'signup' ? 'S’inscrire avec Google' : 'Continuer avec Google'}
        </button>

        <div className="admin-login-divider"><span>ou avec votre e-mail</span></div>
        <form className="admin-form" onSubmit={handlePasswordSubmit}>
          <label htmlFor="admin-email">Adresse e-mail</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="admin-password">Mot de passe</label>
          <input
            id="admin-password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
            minLength={8}
            maxLength={128}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && <p className="admin-alert admin-alert-error" role="alert">{error}</p>}
          {message && <p className="admin-alert admin-alert-success" role="status">{message}</p>}

          <button className="admin-button admin-button-primary admin-button-full" type="submit" disabled={submitting}>
            <KeyRound size={17} />
            {submitting
              ? (mode === 'signup' ? 'Création…' : 'Connexion…')
              : (mode === 'signup' ? 'Créer mon compte' : 'Se connecter')}
          </button>
        </form>

        {mode === 'login' && (
          <>
            <div className="admin-login-divider"><span>ou</span></div>
            <button
              className="admin-button admin-button-secondary admin-button-full"
              type="button"
              disabled={submitting || !email.trim()}
              onClick={handleMagicLink}
            >
              <Mail size={17} /> Recevoir un lien de connexion
            </button>
          </>
        )}

        <p className="admin-login-footnote">
          {mode === 'signup' ? 'Déjà inscrit ?' : 'Pas encore de compte ?'}{' '}
          <button type="button" className="admin-text-button" onClick={switchMode} disabled={submitting}>
            {mode === 'signup' ? 'Se connecter' : 'Créer un compte'}
          </button>
        </p>
        <p className="admin-login-footnote">L’accès à l’administration est réservé aux comptes auxquels un rôle autorisé a été attribué.</p>
      </section>
    </main>
  );
}

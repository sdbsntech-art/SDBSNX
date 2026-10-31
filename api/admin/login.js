import {
  createSessionCookie,
  credentialsMatch,
  getAdminCredentials,
  isSameOrigin,
  readJsonBody,
  sendJson,
} from '../../server/adminAuth.js';

export default function login(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Méthode non autorisée.' });
  }

  if (!isSameOrigin(req)) {
    return sendJson(res, 403, { error: 'Requête d’authentification refusée.' });
  }

  let credentials;
  try {
    credentials = getAdminCredentials();
  } catch {
    return sendJson(res, 503, { error: 'L’authentification administrateur n’est pas configurée sur le serveur.' });
  }

  const body = readJsonBody(req);
  if (
    !body
    || typeof body.email !== 'string'
    || typeof body.password !== 'string'
    || body.email.length > 254
    || body.password.length > 1024
  ) {
    return sendJson(res, 400, { error: 'Saisissez une adresse e-mail et un mot de passe valides.' });
  }

  if (!credentialsMatch(body.email, body.password, credentials)) {
    return sendJson(res, 401, { error: 'Identifiants invalides. Vérifiez vos informations puis réessayez.' });
  }

  res.setHeader('Set-Cookie', createSessionCookie(credentials.email, credentials.secret));
  return sendJson(res, 200, { authenticated: true, email: credentials.email });
}

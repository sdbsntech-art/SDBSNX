import {
  getAdminCredentials,
  getSession,
  sendJson,
} from '../../server/adminAuth.js';

export default function session(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { error: 'Méthode non autorisée.' });
  }

  let credentials;
  try {
    credentials = getAdminCredentials();
  } catch {
    return sendJson(res, 503, { error: 'L’authentification administrateur n’est pas configurée sur le serveur.' });
  }

  const authenticatedSession = getSession(req, credentials);
  return sendJson(res, 200, authenticatedSession
    ? { authenticated: true, email: authenticatedSession.email }
    : { authenticated: false });
}

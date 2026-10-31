import {
  clearSessionCookie,
  isSameOrigin,
  sendJson,
} from '../../server/adminAuth.js';

export default function logout(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Méthode non autorisée.' });
  }

  if (!isSameOrigin(req)) {
    return sendJson(res, 403, { error: 'Requête de déconnexion refusée.' });
  }

  res.setHeader('Set-Cookie', clearSessionCookie());
  return sendJson(res, 200, { authenticated: false });
}

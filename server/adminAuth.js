import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'sdbsnx_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

export function getAdminCredentials() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_SESSION_SECRET || ADMIN_SESSION_SECRET.length < 32) {
    throw new Error('Admin authentication environment variables are not configured.');
  }

  return {
    email: ADMIN_EMAIL.trim().toLowerCase(),
    password: ADMIN_PASSWORD,
    secret: ADMIN_SESSION_SECRET,
  };
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(payload, secret) {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function cookieOptions(maxAge) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

function getCookie(req) {
  const cookies = req.headers.cookie || '';
  const value = cookies.split(';').map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return value ? value.slice(COOKIE_NAME.length + 1) : '';
}

export function isSameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) return false;

  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

export function createSessionCookie(email, secret) {
  const payload = Buffer.from(JSON.stringify({
    email,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  })).toString('base64url');
  const value = `${payload}.${sign(payload, secret)}`;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${value}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

export function getSession(req, credentials) {
  const value = getCookie(req);
  const separator = value.lastIndexOf('.');
  if (separator <= 0) return null;

  const payload = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  if (!safeEqual(signature, sign(payload, credentials.secret))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (
      session.email !== credentials.email
      || !Number.isInteger(session.expiresAt)
      || session.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return { email: session.email };
  } catch {
    return null;
  }
}

export function sendJson(res, status, body) {
  return res.status(status)
    .setHeader('Cache-Control', 'no-store')
    .json(body);
}

export function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body !== 'string') return null;

  try {
    return JSON.parse(req.body);
  } catch {
    return null;
  }
}

export function clearSessionCookie() {
  return cookieOptions(0);
}

export function credentialsMatch(email, password, credentials) {
  return safeEqual(String(email || '').trim().toLowerCase(), credentials.email)
    && safeEqual(String(password || ''), credentials.password);
}

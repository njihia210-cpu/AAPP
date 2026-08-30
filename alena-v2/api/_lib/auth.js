import crypto from 'node:crypto';
import { redis, K } from './redis.js';

const COOKIE = 'alena_session';
const SESSION_TTL = 60 * 60 * 24 * 30; // 30 Tage

/* ------------------------------------------------------------ Passwort */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex');
  return `scrypt$16384$${salt}$${hash}`;
}

export function verifyPassword(password, stored) {
  try {
    const [scheme, n, salt, hash] = String(stored || '').split('$');
    if (scheme !== 'scrypt') return false;
    const calc = crypto.scryptSync(password, salt, 64, { N: Number(n), r: 8, p: 1 });
    const known = Buffer.from(hash, 'hex');
    if (calc.length !== known.length) return false;
    return crypto.timingSafeEqual(calc, known);
  } catch {
    return false;
  }
}

export function passwordProblem(password) {
  if (typeof password !== 'string' || password.length < 10) {
    return 'Das Passwort muss mindestens 10 Zeichen lang sein.';
  }
  if (password.length > 200) return 'Das Passwort ist zu lang.';
  return null;
}

/* -------------------------------------------------------------- Cookie */
export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', [
    `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL}`,
  ]);
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', [`${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`]);
}

function readCookie(req, name) {
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

/* ------------------------------------------------------------ Sessions */
export async function createSession(username) {
  const token = crypto.randomBytes(32).toString('base64url');
  await redis.set(K.session(token), username, { ex: SESSION_TTL });
  await redis.sadd(K.userSessions(username), token);
  await redis.expire(K.userSessions(username), SESSION_TTL);
  return token;
}

export async function destroySession(token) {
  if (!token) return;
  const username = await redis.get(K.session(token));
  await redis.del(K.session(token));
  if (username) await redis.srem(K.userSessions(username), token);
}

export async function destroyAllSessions(username) {
  const tokens = (await redis.smembers(K.userSessions(username))) || [];
  if (tokens.length) await redis.del(...tokens.map((t) => K.session(t)));
  await redis.del(K.userSessions(username));
}

/* --------------------------------------------------------------- Users */
export async function getUser(username) {
  if (!username) return null;
  const user = await redis.get(K.user(username));
  return user || null;
}

export async function saveUser(user) {
  await redis.set(K.user(user.username), user);
  await redis.sadd(K.users, user.username);
}

export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

export function cleanUsername(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
}

/* ---------------------------------------------------------------- Guard */
export async function currentUser(req) {
  const token = readCookie(req, COOKIE);
  if (!token) return null;
  const username = await redis.get(K.session(token));
  if (!username) return null;
  const user = await getUser(username);
  if (!user || user.active === false) return null;
  return { ...user, sessionToken: token };
}

export async function requireUser(req, res) {
  const user = await currentUser(req);
  if (!user) {
    res.status(401).json({ error: 'Nicht angemeldet.' });
    return null;
  }
  return user;
}

export async function requireHost(req, res) {
  const user = await currentUser(req);
  if (!user) {
    res.status(401).json({ error: 'Nicht angemeldet.' });
    return null;
  }
  if (user.role !== 'host') {
    res.status(403).json({ error: 'Kein Zugriff auf den Host-Bereich.' });
    return null;
  }
  return user;
}

/* -------------------------------------------------------- Rate limiting */
export async function tooManyAttempts(key) {
  const count = await redis.get(K.loginFails(key));
  return Number(count || 0) >= 8;
}

export async function noteFailure(key) {
  const n = await redis.incr(K.loginFails(key));
  if (n === 1) await redis.expire(K.loginFails(key), 900); // 15 Minuten
}

export async function clearFailures(key) {
  await redis.del(K.loginFails(key));
}

export function clientKey(req) {
  const fwd = req.headers['x-forwarded-for'];
  const ip = Array.isArray(fwd) ? fwd[0] : String(fwd || '').split(',')[0].trim();
  return ip || 'unbekannt';
}

/* -------------------------------------------------------------- Methods */
export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '));
  res.status(405).json({ error: 'Methode nicht erlaubt.' });
}

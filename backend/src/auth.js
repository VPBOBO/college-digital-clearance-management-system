import crypto from 'node:crypto';
import { AppError } from './errors.js';

const COOKIE_NAME = 'cdcms.sid';
const SESSION_HOURS = Number.parseInt(process.env.SESSION_TTL_HOURS ?? '8', 10);
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
const DUMMY_PASSWORD = 'cdcms-invalid-account-dummy-password-never-used-for-login';
const ARGON_OPTIONS = Object.freeze({ type: 2, memoryCost: 19456, timeCost: 2, parallelism: 1 });
const dummyHashCache = new WeakMap();

async function getDummyHash(argon2) {
  if (!dummyHashCache.has(argon2)) {
    dummyHashCache.set(argon2, argon2.hash(DUMMY_PASSWORD, ARGON_OPTIONS));
  }
  return dummyHashCache.get(argon2);
}

function parseCookies(header = '') {
  const result = {};
  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    const key = part.slice(0, separator).trim();

    let value = part.slice(separator + 1).trim();

    // Accept cookie values surrounded by matching double quotes.
    if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
    }

    if (key) {
      try { result[key] = decodeURIComponent(value); } catch { /* Ignore malformed cookie values. */ }
    }
  }
  return result;
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function cookieOptions(maxAgeSeconds) {
  return [
    `${COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
    ...(COOKIE_SECURE ? ['Secure'] : [])
  ].join('; ');
}

export function setSessionCookie(res, token) {
  const maxAge = SESSION_HOURS * 60 * 60;
  res.setHeader('Set-Cookie', `${cookieOptions(maxAge).replace(`${COOKIE_NAME}=`, `${COOKIE_NAME}=${encodeURIComponent(token)}`)}`);
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', cookieOptions(0));
}

export function createAuthMiddleware(pool) {
  return async function sessionMiddleware(req, _res, next) {
    try {
      const token = parseCookies(req.headers.cookie)[COOKIE_NAME];

        if (!token || !/^[A-Za-z0-9_-]{40,64}$/.test(token)) {
            return next();
        }

      const result = await pool.query(
        `SELECT ua.id, ua.username, ua.display_name
           FROM app_sessions s
           JOIN user_accounts ua ON ua.id = s.user_id
          WHERE s.token_hash = $1
            AND s.expires_at > NOW()
            AND ua.is_active = TRUE`,
        [hashToken(token)]
      );

        if (result.rowCount === 1) {
            req.user = result.rows[0];
        }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireAuthentication(req, _res, next) {
  if (!req.user) return next(new AppError(401, 'AUTHENTICATION_REQUIRED', 'Sign in is required.'));
  next();
}

export function makeSessionToken() {
  return crypto.randomBytes(32).toString('base64url');
}

export function tokenDigest(token) {
  return hashToken(token);
}

export function requireRole(pool, roleName) {
  return async function roleMiddleware(req, _res, next) {
    try {
      const result = await pool.query(
        `SELECT 1
           FROM user_role_assignments ura
           JOIN role_catalog rc ON rc.id = ura.role_id
          WHERE ura.user_id = $1
            AND ura.is_active = TRUE
            AND rc.name = $2`,
        [req.user.id, roleName]
      );
      if (result.rowCount !== 1) {
        return next(new AppError(403, 'ROLE_REQUIRED', 'Your account is not authorized for this operation.'));
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

export async function loginUser(pool, argon2, username, password) {
  await purgeExpiredSessions(pool);
  const result = await pool.query(
    `SELECT id, username, display_name, password_hash, is_active
       FROM user_accounts WHERE username = $1`,
    [username]
  );
  const account = result.rows[0];
  // Same response for unknown user and incorrect password.
  const hashToVerify = account && account.is_active
    ? account.password_hash
    : await getDummyHash(argon2);
  const verified = await argon2.verify(hashToVerify, password).catch(() => false);
  if (!account || !account.is_active || !verified) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Username or password is incorrect.');
  }

  const token = makeSessionToken();
  const digest = tokenDigest(token);
  await pool.query(
    `INSERT INTO app_sessions (token_hash, user_id, expires_at)
     VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 hour'))`,
    [digest, account.id, SESSION_HOURS]
  );
  return { token, user: { id: account.id, username: account.username, displayName: account.display_name } };
}

export async function getUserRoles(pool, userId) {
  const result = await pool.query(
    `SELECT rc.name
       FROM user_role_assignments ura
       JOIN role_catalog rc ON rc.id = ura.role_id
      WHERE ura.user_id = $1 AND ura.is_active = TRUE
      ORDER BY rc.name`,
    [userId]
  );
  return result.rows.map((row) => row.name);
}

export async function destroySession(pool, req) {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!token || !/^[A-Za-z0-9_-]{40,64}$/.test(token)) return;
  await pool.query('DELETE FROM app_sessions WHERE token_hash = $1', [hashToken(token)]);
}

export async function purgeExpiredSessions(pool) {
  const result = await pool.query('DELETE FROM app_sessions WHERE expires_at <= NOW()');
  return result.rowCount;
}

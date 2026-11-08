import argon2 from 'argon2';
import { assertLocalDatabaseTarget } from './db-safety.js';

export const DEMO_ACCOUNT_USERNAMES = Object.freeze([
  'admin',
  'reviewer-a',
  'reviewer-b',
  'student-a',
  'student-b'
]);

const LOOPBACK_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '::1'
]);

export function validateDemoPassword(password) {
  if (typeof password !== 'string' || [...password].length < 7) {
    throw new Error('SEED_PASSWORD must contain at least 7 characters.');
  }

  return password;
}

export async function createDemoPasswordHash(password) {
  return argon2.hash(validateDemoPassword(password), {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1
  });
}

export function assertDemoPasswordResetAllowed(
  connectionString,
  environment = process.env
) {
  assertLocalDatabaseTarget(connectionString, {
    requiredSuffix: '_dev',
    confirmationName: 'ALLOW_DEMO_PASSWORD_RESET',
    confirmationValue: 'YES',
    environment
  });

  if (environment.NODE_ENV !== 'development') {
    throw new Error('Demo password reset requires NODE_ENV=development.');
  }

  const applicationHost = (
    environment.HOST || '127.0.0.1'
  ).trim().toLowerCase().replace(/^\[|\]$/g, '');

  if (!LOOPBACK_HOSTS.has(applicationHost)) {
    throw new Error('Demo password reset requires a loopback application HOST.');
  }

  if (environment.ALLOW_LAN === 'YES') {
    throw new Error('Demo password reset is disabled when ALLOW_LAN=YES.');
  }

  return true;
}

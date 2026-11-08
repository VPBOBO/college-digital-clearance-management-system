import test from 'node:test';
import assert from 'node:assert/strict';

import {
  assertDemoPasswordResetAllowed,
  validateDemoPassword,
  createDemoPasswordHash,
  DEMO_ACCOUNT_USERNAMES
} from '../src/demo-password-reset.js';

const DATABASE_URL =
  'postgres://cdcms_app:example@127.0.0.1:5432/cdcms_dev';

const VALID_ENVIRONMENT = {
  NODE_ENV: 'development',
  HOST: '127.0.0.1',
  ALLOW_LAN: 'NO',
  ALLOW_DEMO_PASSWORD_RESET: 'YES'
};

test('accepts a properly guarded local demo password reset', () => {
  assert.equal(
    assertDemoPasswordResetAllowed(DATABASE_URL, VALID_ENVIRONMENT),
    true
  );
});

test('rejects missing password-reset confirmation', () => {
  assert.throws(
    () => assertDemoPasswordResetAllowed(DATABASE_URL, {
      ...VALID_ENVIRONMENT,
      ALLOW_DEMO_PASSWORD_RESET: 'NO'
    }),
    /ALLOW_DEMO_PASSWORD_RESET=YES/
  );
});

test('rejects remote database hosts', () => {
  assert.throws(
    () => assertDemoPasswordResetAllowed(
      'postgres://cdcms_app:example@db.example.test:5432/cdcms_dev',
      VALID_ENVIRONMENT
    ),
    /loopback/
  );
});

test('rejects non-development database names', () => {
  assert.throws(
    () => assertDemoPasswordResetAllowed(
      'postgres://cdcms_app:example@127.0.0.1:5432/cdcms',
      VALID_ENVIRONMENT
    ),
    /end with _dev/
  );
});

test('rejects production mode', () => {
  assert.throws(
    () => assertDemoPasswordResetAllowed(DATABASE_URL, {
      ...VALID_ENVIRONMENT,
      NODE_ENV: 'production'
    }),
    /NODE_ENV=development/
  );
});

test('rejects a non-loopback application host', () => {
  assert.throws(
    () => assertDemoPasswordResetAllowed(DATABASE_URL, {
      ...VALID_ENVIRONMENT,
      HOST: '0.0.0.0'
    }),
    /loopback application HOST/
  );
});

test('rejects explicitly enabled LAN access', () => {
  assert.throws(
    () => assertDemoPasswordResetAllowed(DATABASE_URL, {
      ...VALID_ENVIRONMENT,
      ALLOW_LAN: 'YES'
    }),
    /ALLOW_LAN=YES/
  );
});

test('accepts the simple local demo password', () => {
  assert.equal(validateDemoPassword('test123'), 'test123');
});

test('rejects missing and too-short demo passwords', () => {
  assert.throws(() => validateDemoPassword(''), /at least 7 characters/);
  assert.throws(() => validateDemoPassword(undefined), /at least 7 characters/);
  assert.throws(() => validateDemoPassword('short'), /at least 7 characters/);
});

test('only the five designated fictional accounts are eligible', () => {
  assert.deepEqual(DEMO_ACCOUNT_USERNAMES, [
    'admin',
    'reviewer-a',
    'reviewer-b',
    'student-a',
    'student-b'
  ]);

  assert.equal(Object.isFrozen(DEMO_ACCOUNT_USERNAMES), true);
});

test('generates independently salted hashes for the same demo password', async () => {
  const hashes = [];

  for (let index = 0; index < 5; index += 1) {
    hashes.push(await createDemoPasswordHash('test123'));
  }

  assert.equal(new Set(hashes).size, 5);

  for (const hash of hashes) {
    assert.equal(
      await (await import('argon2')).default.verify(
        hash,
        'test123'
      ),
      true
    );
  }
});

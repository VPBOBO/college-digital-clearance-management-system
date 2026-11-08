import test from 'node:test';
import assert from 'node:assert/strict';
import { assertLocalDatabaseTarget } from '../src/db-safety.js';

const options = { requiredSuffix: '_dev', confirmationName: 'ALLOW_DEMO_SEED', confirmationValue: 'YES', environment: { ALLOW_DEMO_SEED: 'YES' } };

test('database safety accepts local _dev database with explicit opt-in', () => {
  const result = assertLocalDatabaseTarget('postgres://app:secret@127.0.0.1:5432/cdcms_dev', options);
  assert.equal(result.databaseName, 'cdcms_dev');
  assert.equal(result.hostname, '127.0.0.1');
});

test('database safety accepts IPv6 loopback', () => {
  const result = assertLocalDatabaseTarget('postgres://app:secret@[::1]:5432/cdcms_dev', options);
  assert.equal(result.hostname, '::1');
});

test('database safety rejects remote hosts', () => {
  assert.throws(() => assertLocalDatabaseTarget('postgres://app:secret@db.example.test:5432/cdcms_dev', options), /loopback/);
});

test('database safety rejects wrong database suffix and missing opt-in', () => {
  assert.throws(() => assertLocalDatabaseTarget('postgres://app:secret@localhost:5432/postgres', options), /end with _dev/);
  assert.throws(() => assertLocalDatabaseTarget('postgres://app:secret@localhost:5432/cdcms_dev', { ...options, environment: {} }), /ALLOW_DEMO_SEED=YES/);
});

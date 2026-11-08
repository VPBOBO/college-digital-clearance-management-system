import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import {
    createAuthMiddleware,
    loginUser,
    tokenDigest
} from '../src/auth.js';

 test('unknown usernames still execute one Argon2 verification using a dummy hash', async () => {
  let verifiedHash;
  const fakeArgon2 = {
    async hash() { return '$argon2id$dummy-cache-hash'; },
    async verify(hash, password) { verifiedHash = hash; return false; }
  };
  const fakePool = {
    async query(sql) {
      if (sql.includes('DELETE FROM app_sessions')) return { rowCount: 0, rows: [] };
      return { rowCount: 0, rows: [] };
    }
  };
  await assert.rejects(loginUser(fakePool, fakeArgon2, 'missing-user', 'password'), (error) => error.status === 401);
  assert.equal(verifiedHash, '$argon2id$dummy-cache-hash');
});

const TEST_SESSION_TOKEN = 'A'.repeat(43);

function spyOnConsole() {
  return ['debug', 'info', 'log', 'warn', 'error'].map((method) => ({
    method,
    spy: mock.method(console, method)
  }));
}

function assertNoConsoleOutput(spies) {
  for (const { method, spy } of spies) {
    assert.equal(
      spy.mock.callCount(),
      0,
      `Unexpected console.${method} call`
    );
  }
}

function createFakeSessionPool(lookups) {
  return {
    async query(sql, values) {
      lookups.push({ sql, values });

      return {
        rowCount: 1,
        rows: [{
          id: 7,
          username: 'student-a',
          display_name: 'Student A'
        }]
      };
    }
  };
}

test('quoted session cookie is unwrapped before its digest is queried', async () => {
  const lookups = [];
  const pool = createFakeSessionPool(lookups);
  const req = {
    headers: {
      cookie: `cdcms.sid="${TEST_SESSION_TOKEN}"`
    }
  };

  let nextCount = 0;
  let nextError;
  const spies = spyOnConsole();

  try {
    await createAuthMiddleware(pool)(req, {}, (error) => {
      nextCount++;
      nextError = error;
    });

    assert.equal(lookups.length, 1);
    assert.match(lookups[0].sql, /FROM app_sessions/);
    assert.equal(
      lookups[0].values[0],
      tokenDigest(TEST_SESSION_TOKEN)
    );

    assert.deepEqual(req.user, {
      id: 7,
      username: 'student-a',
      display_name: 'Student A'
    });

    assert.equal(nextCount, 1);
    assert.equal(nextError, undefined);
    assertNoConsoleOutput(spies);
  } finally {
    for (const { spy } of spies) {
      spy.mock.restore();
    }
  }
});

test('unquoted session cookie uses the same token digest', async () => {
  const lookups = [];
  const pool = createFakeSessionPool(lookups);
  const req = {
    headers: {
      cookie: `cdcms.sid=${TEST_SESSION_TOKEN}`
    }
  };

  let nextCount = 0;
  let nextError;
  const spies = spyOnConsole();

  try {
    await createAuthMiddleware(pool)(req, {}, (error) => {
      nextCount++;
      nextError = error;
    });

    assert.equal(lookups.length, 1);
    assert.equal(
      lookups[0].values[0],
      tokenDigest(TEST_SESSION_TOKEN)
    );

    assert.deepEqual(req.user, {
      id: 7,
      username: 'student-a',
      display_name: 'Student A'
    });

    assert.equal(nextCount, 1);
    assert.equal(nextError, undefined);
    assertNoConsoleOutput(spies);
  } finally {
    for (const { spy } of spies) {
      spy.mock.restore();
    }
  }
});

test('session cookie with an unmatched quote is ignored without a database lookup', async () => {
  const lookups = [];
  const pool = createFakeSessionPool(lookups);
  const req = {
    headers: {
      cookie: `cdcms.sid="${TEST_SESSION_TOKEN}`
    }
  };

  let nextCount = 0;
  let nextError;
  const spies = spyOnConsole();

  try {
    await createAuthMiddleware(pool)(req, {}, (error) => {
      nextCount++;
      nextError = error;
    });

    assert.equal(Object.hasOwn(req, 'user'), false);
    assert.equal(lookups.length, 0);
    assert.equal(nextCount, 1);
    assert.equal(nextError, undefined);
    assertNoConsoleOutput(spies);
  } finally {
    for (const { spy } of spies) {
      spy.mock.restore();
    }
  }
});

import { pool } from '../src/db.js';
import {
  assertDemoPasswordResetAllowed,
  validateDemoPassword,
  createDemoPasswordHash,
  DEMO_ACCOUNT_USERNAMES
} from '../src/demo-password-reset.js';

async function main() {
  assertDemoPasswordResetAllowed(
    process.env.DATABASE_URL,
    process.env
  );

  const password = validateDemoPassword(process.env.SEED_PASSWORD);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `SELECT id, username, is_active
         FROM user_accounts
        WHERE username = ANY($1::text[])
        ORDER BY username
        FOR UPDATE`,
      [DEMO_ACCOUNT_USERNAMES]
    );

    const accounts = new Map(
      result.rows.map(row => [row.username, row])
    );

    const missing = DEMO_ACCOUNT_USERNAMES.filter(
      username => !accounts.has(username)
    );

    if (missing.length) {
      throw new Error(
        `Required demo accounts are missing: ${missing.join(', ')}.`
      );
    }

    const inactive = DEMO_ACCOUNT_USERNAMES.filter(
      username => !accounts.get(username).is_active
    );

    if (inactive.length) {
      throw new Error(
        `Inactive demo accounts detected: ${inactive.join(', ')}. No accounts were reactivated or updated.`
      );
    }

    const accountIds = [];

    // Generate a separate Argon2id hash and random salt for each account.
    for (const username of DEMO_ACCOUNT_USERNAMES) {
      const account = accounts.get(username);
      const passwordHash = await createDemoPasswordHash(password);

      const updated = await client.query(
        `UPDATE user_accounts
            SET password_hash = $1
          WHERE id = $2 AND is_active = TRUE`,
        [passwordHash, account.id]
      );

      if (updated.rowCount !== 1) {
        throw new Error(`Could not safely update account ${username}.`);
      }

      accountIds.push(account.id);
    }

    const invalidated = await client.query(
      `DELETE FROM app_sessions
        WHERE user_id = ANY($1::bigint[])`,
      [accountIds]
    );

    await client.query('COMMIT');

    console.log('Demo password reset completed successfully.');
    console.log(`Updated accounts: ${DEMO_ACCOUNT_USERNAMES.join(', ')}`);
    console.log('Each account received an independently salted Argon2id hash.');
    console.log(`Invalidated existing sessions: ${invalidated.rowCount}`);
    console.log('Roles, student records, assignments, clearance decisions and processing history were preserved.');
    console.log('The password value was not printed.');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

try {
  await main();
} catch (error) {
  const diagnostic = error?.code ?? error?.name ?? 'unknown error';
  const message = String(error?.message ?? 'No error detail available.')
    .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, '[database URL redacted]')
    .slice(0, 240);

  console.error(`Demo password reset failed: ${diagnostic}: ${message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}

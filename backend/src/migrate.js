import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pool } from './db.js';
import { assertLocalDatabaseTarget } from './db-safety.js';

const here = dirname(fileURLToPath(import.meta.url));
let stage = 'database safety check';
try {
  assertLocalDatabaseTarget(process.env.DATABASE_URL, {
    requiredSuffix: '_dev', confirmationName: 'ALLOW_DEV_MIGRATIONS', confirmationValue: 'YES'
  });
  stage = 'apply development schema';
  const sql = await readFile(join(here, 'schema.sql'), 'utf8');
  await pool.query(sql);
  console.log('Local development database schema applied successfully.');
} catch (error) {
  const diagnostic = error?.code ?? error?.name ?? 'unknown error';
  const message = String(error?.message ?? 'No error detail available.')
    .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, '[database URL redacted]')
    .slice(0, 240);
  console.error(`Database schema application failed during ${stage}: ${diagnostic}: ${message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}

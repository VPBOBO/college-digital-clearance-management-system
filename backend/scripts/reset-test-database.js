import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { assertLocalDatabaseTarget } from '../src/db-safety.js';

dotenv.config();

if (!process.env.TEST_DATABASE_URL) {
  console.error('TEST_DATABASE_URL is required.');
  process.exit(1);
}
try {
  assertLocalDatabaseTarget(process.env.TEST_DATABASE_URL, {
    requiredSuffix: '_test', confirmationName: 'ALLOW_TEST_DATABASE_RESET', confirmationValue: 'YES'
  });
} catch (error) {
  console.error(`Refusing test database reset: ${error.message}`);
  process.exit(1);
}
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

const { pool } = await import('../src/db.js');
const here = dirname(fileURLToPath(import.meta.url));

try {
  const current = await pool.query('SELECT current_database() AS name');
  const databaseName = current.rows[0].name;
  if (!databaseName.endsWith('_test')) throw new Error('Database name did not pass the _test guard.');
  await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  const schema = await readFile(join(here, '../src/schema.sql'), 'utf8');
  await pool.query(schema);
  console.log(`Dedicated test database schema reset successfully: ${databaseName}`);
} catch (error) {
  console.error('Test database reset failed:', error.code ?? error.name);
  process.exitCode = 1;
} finally {
  await pool.end();
}

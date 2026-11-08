import { pool } from './db.js';
import { createApp } from './app.js';
import { purgeExpiredSessions } from './auth.js';
import { assertLocalDatabaseTarget } from './db-safety.js';

assertLocalDatabaseTarget(process.env.DATABASE_URL, {
  requiredSuffix: '_dev', confirmationName: 'ALLOW_DEV_DATABASE', confirmationValue: 'YES'
});

const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const host = process.env.HOST ?? '127.0.0.1';
const loopbackHosts = new Set(['127.0.0.1', 'localhost', '::1']);
if (!loopbackHosts.has(host.toLowerCase()) && process.env.ALLOW_LAN !== 'YES') {
  throw new Error('Refusing non-loopback API binding. Set ALLOW_LAN=YES explicitly for a trusted local network.');
}
if (!loopbackHosts.has(host.toLowerCase())) {
  console.warn('WARNING: CDCMS API is exposed beyond loopback. Use only on a trusted private network.');
}

const app = createApp(pool);
const server = app.listen(port, host, async () => {
  console.log(`CDCMS API listening on http://${host}:${port}`);
  try {
    const removed = await purgeExpiredSessions(pool);
    if (removed > 0) console.log(`Removed ${removed} expired session(s).`);
  } catch (error) {
    console.error('Startup session cleanup failed:', error.code ?? error.name ?? 'database error');
  }
});
const cleanupTimer = setInterval(async () => {
  try { await purgeExpiredSessions(pool); }
  catch (error) { console.error('Expired-session cleanup failed:', error.code ?? error.name ?? 'database error'); }
}, 15 * 60 * 1000);
cleanupTimer.unref();

async function shutdown(signal) {
  console.log(`Received ${signal}; shutting down.`);
  clearInterval(cleanupTimer);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

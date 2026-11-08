export function parseDatabaseTarget(connectionString) {
  let parsed;
  try {
    parsed = new URL(connectionString);
  } catch {
    throw new Error('Database URL is invalid.');
  }
  if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
    throw new Error('Database URL must use PostgreSQL.');
  }
  const databaseName = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
  const hostname = parsed.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  return { databaseName, hostname };
}

export function assertLocalDatabaseTarget(connectionString, {
  requiredSuffix,
  confirmationName,
  confirmationValue,
  environment = process.env
}) {
  const { databaseName, hostname } = parseDatabaseTarget(connectionString);
  const localHosts = new Set(['localhost', '127.0.0.1', '::1']);
  if (!localHosts.has(hostname)) {
    throw new Error(`Refusing operation: database host must be loopback (received ${hostname || 'empty'}).`);
  }
  if (!databaseName || !databaseName.endsWith(requiredSuffix)) {
    throw new Error(`Refusing operation: database name must end with ${requiredSuffix}.`);
  }
  if (environment[confirmationName] !== confirmationValue) {
    throw new Error(`Refusing operation: set ${confirmationName}=${confirmationValue} explicitly.`);
  }
  return { databaseName, hostname };
}

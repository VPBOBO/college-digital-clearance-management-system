import crypto from 'node:crypto';
import argon2 from 'argon2';
import { pool } from './db.js';
import { assignClearanceForStudent } from './assignment-service.js';
import { assertLocalDatabaseTarget } from './db-safety.js';

const suppliedPassword = Boolean(process.env.SEED_PASSWORD);
const demoPassword = process.env.SEED_PASSWORD || crypto.randomBytes(15).toString('base64url');
const createdAccounts = [];
let stage = 'database safety check';

async function ensureCodeRecord(table, code, label) {
  // Table/column names are selected from this fixed internal allowlist, never from request input.
  const columns = table === 'academic_periods' ? ['code', 'label'] : ['code', 'name'];
  const [codeColumn, labelColumn] = columns;
  const inserted = await pool.query(
    `INSERT INTO ${table} (${codeColumn}, ${labelColumn}) VALUES ($1, $2)
     ON CONFLICT (${codeColumn}) DO NOTHING RETURNING id, ${labelColumn} AS label, is_active`,
    [code, label]
  );
  const row = inserted.rows[0] ?? (await pool.query(
    `SELECT id, ${labelColumn} AS label, is_active FROM ${table} WHERE ${codeColumn} = $1`, [code]
  )).rows[0];
  if (!row || row.label !== label || !row.is_active) {
    throw new Error(`Existing ${table} fixture ${code} differs from the expected active demo fixture. No existing value was changed.`);
  }
  return row.id;
}

async function ensureAccount(username, displayName) {
  // Generate a separate Argon2id hash and random salt for each new account.
  const passwordHash = await argon2.hash(demoPassword, {
    type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1
  });
  const inserted = await pool.query(
    `INSERT INTO user_accounts (username, display_name, password_hash, is_active)
     VALUES ($1, $2, $3, TRUE)
     ON CONFLICT (username) DO NOTHING
     RETURNING id, is_active`,
    [username, displayName, passwordHash]
  );
  const row = inserted.rows[0] ?? (await pool.query(
    'SELECT id, is_active FROM user_accounts WHERE username = $1', [username]
  )).rows[0];
  if (!row || !row.is_active) {
    throw new Error(`Demo account ${username} already exists but is inactive. Seed will not reactivate or overwrite it.`);
  }
  if (inserted.rowCount === 1) createdAccounts.push(username);
  return row.id;
}

async function ensureRole(userId, roleName) {
  const result = await pool.query(
    `INSERT INTO user_role_assignments (user_id, role_id, is_active)
     SELECT $1, id, TRUE FROM role_catalog WHERE name = $2
     ON CONFLICT (user_id, role_id) DO NOTHING`, [userId, roleName]
  );
  const active = await pool.query(
    `SELECT ura.is_active FROM user_role_assignments ura
      JOIN role_catalog rc ON rc.id = ura.role_id
     WHERE ura.user_id = $1 AND rc.name = $2`, [userId, roleName]
  );
  if (active.rowCount !== 1 || !active.rows[0].is_active) {
    throw new Error(`Required demo role assignment ${roleName} is missing or inactive. Seed will not reactivate it.`);
  }
}

async function ensureOfficeAssignment(userId, officeId) {
  await pool.query(
    `INSERT INTO office_staff_assignments (user_id, office_id, is_active)
     VALUES ($1, $2, TRUE) ON CONFLICT (user_id, office_id) DO NOTHING`, [userId, officeId]
  );
  const result = await pool.query(
    'SELECT is_active FROM office_staff_assignments WHERE user_id = $1 AND office_id = $2', [userId, officeId]
  );
  if (result.rowCount !== 1 || !result.rows[0].is_active) {
    throw new Error('A required demo office assignment is missing or inactive. Seed will not reactivate it.');
  }
}

async function ensureStudentProfile(userId, number, name, programId) {
  const inserted = await pool.query(
    `INSERT INTO student_profiles (user_id, student_number, full_name, program_id, is_active)
     VALUES ($1, $2, $3, $4, TRUE)
     ON CONFLICT (student_number) DO NOTHING RETURNING id, user_id, full_name, program_id, is_active`,
    [userId, number, name, programId]
  );
  const row = inserted.rows[0] ?? (await pool.query(
    'SELECT id, user_id, full_name, program_id, is_active FROM student_profiles WHERE student_number = $1', [number]
  )).rows[0];
  if (!row || Number(row.user_id) !== Number(userId) || row.full_name !== name || Number(row.program_id) !== Number(programId) || !row.is_active) {
    throw new Error(`Existing student profile ${number} differs from the expected active demo fixture. No existing value was changed.`);
  }
  return row.id;
}

async function ensureTemplate(periodId) {
  const inserted = await pool.query(
    `INSERT INTO clearance_templates (code, name, academic_period_id, is_active)
     VALUES ('DEMO-TEMPLATE-2026', 'Sample Clearance Template', $1, TRUE)
     ON CONFLICT (code) DO NOTHING
     RETURNING id, name, academic_period_id, is_active`, [periodId]
  );
  const row = inserted.rows[0] ?? (await pool.query(
    `SELECT id, name, academic_period_id, is_active
       FROM clearance_templates WHERE code = 'DEMO-TEMPLATE-2026'`
  )).rows[0];
  if (!row || row.name !== 'Sample Clearance Template' ||
      Number(row.academic_period_id) !== Number(periodId) || !row.is_active) {
    throw new Error('Existing demo template differs from the expected active fixture. Seed did not change it.');
  }
  return row.id;
}

async function ensureRequirement(code, name, officeId) {
  const inserted = await pool.query(
    `INSERT INTO requirement_definitions (code, name, office_id, is_active)
     VALUES ($1, $2, $3, TRUE) ON CONFLICT (code) DO NOTHING
     RETURNING id, name, office_id, is_active`, [code, name, officeId]
  );
  const row = inserted.rows[0] ?? (await pool.query(
    'SELECT id, name, office_id, is_active FROM requirement_definitions WHERE code = $1', [code]
  )).rows[0];
  if (!row || row.name !== name || Number(row.office_id) !== Number(officeId) || !row.is_active) {
    throw new Error(`Existing requirement ${code} differs from the expected active demo fixture. No existing value was changed.`);
  }
  return row.id;
}

async function ensureTemplateRequirement(templateId, requirementId, mandatory, remarkFlag, programId) {
  await pool.query(
    `INSERT INTO template_requirements
       (template_id, requirement_definition_id, is_mandatory, remark_required_on_reject, applicable_program_id, is_active)
     VALUES ($1, $2, $3, $4, $5, TRUE)
     ON CONFLICT (template_id, requirement_definition_id) DO NOTHING`,
    [templateId, requirementId, mandatory, remarkFlag, programId]
  );
  const row = (await pool.query(
    `SELECT is_mandatory, remark_required_on_reject, applicable_program_id, is_active
       FROM template_requirements WHERE template_id = $1 AND requirement_definition_id = $2`,
    [templateId, requirementId]
  )).rows[0];
  if (!row || row.is_mandatory !== mandatory || row.remark_required_on_reject !== remarkFlag ||
      Number(row.applicable_program_id) !== Number(programId) || !row.is_active) {
    throw new Error('Existing template requirement differs from expected demo configuration or is inactive. Seed did not alter it.');
  }
}

async function main() {
  const { databaseName } = assertLocalDatabaseTarget(process.env.DATABASE_URL, {
    requiredSuffix: '_dev',
    confirmationName: 'ALLOW_DEMO_SEED',
    confirmationValue: 'YES'
  });
  stage = 'create demo roles';
  const roles = [
    'Student', 'Instructor / Faculty Member', 'Administrative Office Personnel',
    'Department Personnel', 'Department Head', 'System Administrator'
  ];
  for (const role of roles) {
    await pool.query('INSERT INTO role_catalog (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [role]);
  }

  stage = 'ensure academic fixtures';
  const periodId = await ensureCodeRecord('academic_periods', 'DEMO-2026-1', 'Sample Academic Period 2026');
  const programA = await ensureCodeRecord('programs', 'PROGRAM-A', 'Sample Program A');
  const programB = await ensureCodeRecord('programs', 'PROGRAM-B', 'Sample Program B');
  const officeA = await ensureCodeRecord('offices', 'OFFICE-A', 'Sample Office A');
  const officeB = await ensureCodeRecord('offices', 'OFFICE-B', 'Sample Office B');

  stage = 'create only missing demo accounts';
  const adminId = await ensureAccount('admin', 'Sample System Administrator');
  const reviewerAId = await ensureAccount('reviewer-a', 'Sample Office Reviewer A');
  const reviewerBId = await ensureAccount('reviewer-b', 'Sample Office Reviewer B');
  const studentAId = await ensureAccount('student-a', 'Sample Student A');
  const studentBId = await ensureAccount('student-b', 'Sample Student B');

  stage = 'ensure role and office assignments';
  await ensureRole(adminId, 'System Administrator');
  await ensureRole(reviewerAId, 'Administrative Office Personnel');
  await ensureRole(reviewerBId, 'Administrative Office Personnel');
  await ensureRole(studentAId, 'Student');
  await ensureRole(studentBId, 'Student');
  await ensureOfficeAssignment(reviewerAId, officeA);
  await ensureOfficeAssignment(reviewerBId, officeB);

  stage = 'ensure student profiles';
  const studentA = await ensureStudentProfile(studentAId, 'DEMO-STU-001', 'Sample Student A', programA);
  const studentB = await ensureStudentProfile(studentBId, 'DEMO-STU-002', 'Sample Student B', programB);

  stage = 'ensure requirements and template';
  const requirementA = await ensureRequirement('REQ-A', 'Sample Requirement A', officeA);
  const requirementB = await ensureRequirement('REQ-B', 'Sample Requirement B', officeB);
  const templateId = await ensureTemplate(periodId);
  await ensureTemplateRequirement(templateId, requirementA, true, 'REQUIRED', programA);
  await ensureTemplateRequirement(templateId, requirementB, true, 'OPTIONAL', programB);

  stage = 'assign applicable clearance requirements through backend service';
  const assignedA = await assignClearanceForStudent(pool, { studentProfileId: studentA, templateId });
  const assignedB = await assignClearanceForStudent(pool, { studentProfileId: studentB, templateId });

  console.log(`Fictional CDCMS fixtures are ready in local database ${databaseName}.`);
  console.log(`New accounts created: ${createdAccounts.length ? createdAccounts.join(', ') : 'none; existing accounts and passwords were left unchanged'}.`);
  if (createdAccounts.length) {
    if (suppliedPassword) console.log('New accounts used SEED_PASSWORD from your local environment; its value was not printed.');
    else console.log(`Generated local-only password for newly created accounts only (save it privately): ${demoPassword}`);
  }
  console.log(`Student A assignment: request ${assignedA.requestId}, ${assignedA.assignedRequirementCount} requirement(s), created=${assignedA.created}`);
  console.log(`Student B assignment: request ${assignedB.requestId}, ${assignedB.assignedRequirementCount} requirement(s), created=${assignedB.created}`);
}

try {
  await main();
} catch (error) {
  const diagnostic = error?.code ?? error?.name ?? 'unknown error';
  const message = String(error?.message ?? 'No error detail available.')
    .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, '[database URL redacted]')
    .slice(0, 240);
  console.error(`Seed failed during ${stage}: ${diagnostic}: ${message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}

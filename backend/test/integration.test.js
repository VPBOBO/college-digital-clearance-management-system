import test, { before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { assertLocalDatabaseTarget } from '../src/db-safety.js';

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
if (!TEST_DATABASE_URL) {
  test('integration suite requires TEST_DATABASE_URL', { skip: 'Set TEST_DATABASE_URL to a dedicated database ending in _test and ALLOW_TEST_DATABASE_RESET=YES.' }, () => {});
} else {
  process.env.DATABASE_URL = TEST_DATABASE_URL;
  process.env.NODE_ENV = 'test';
  process.env.COOKIE_SECURE = 'false';

  const [{ pool }, { createApp }, argon2Module, assignmentModule] = await Promise.all([
    import('../src/db.js'), import('../src/app.js'), import('argon2'), import('../src/assignment-service.js')
  ]);
  const argon2 = argon2Module.default;
  const { assignClearanceForStudent } = assignmentModule;
  const here = dirname(fileURLToPath(import.meta.url));
  let server;
  let baseUrl;
  let ids = {};
  const TEST_PASSWORD = 'integration-only-not-a-real-password';
  assertLocalDatabaseTarget(TEST_DATABASE_URL, {
    requiredSuffix: '_test', confirmationName: 'ALLOW_TEST_DATABASE_RESET', confirmationValue: 'YES'
  });

  async function resetDatabase() {
    const current = await pool.query('SELECT current_database() AS name');
    assert.ok(current.rows[0].name.endsWith('_test'), 'Refusing to reset unless the database name ends in _test.');
    assert.equal(process.env.ALLOW_TEST_DATABASE_RESET, 'YES', 'Set ALLOW_TEST_DATABASE_RESET=YES explicitly before running destructive integration tests.');
    await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    const schema = await readFile(join(here, '../src/schema.sql'), 'utf8');
    await pool.query(schema);

    const roleNames = ['Student', 'Administrative Office Personnel', 'System Administrator'];
    for (const name of roleNames) await pool.query('INSERT INTO role_catalog (name) VALUES ($1)', [name]);
    const hash = await argon2.hash(TEST_PASSWORD, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
    const users = {};
    for (const [username, name] of [
      ['admin','Test Admin'], ['reviewer-a','Reviewer A'], ['reviewer-b','Reviewer B'],
      ['student-a','Student A'], ['student-b','Student B']
    ]) {
      const r = await pool.query(
        'INSERT INTO user_accounts (username, display_name, password_hash) VALUES ($1,$2,$3) RETURNING id',
        [username, name, hash]
      );
      users[username] = r.rows[0].id;
    }
    for (const [username, role] of [
      ['admin','System Administrator'], ['reviewer-a','Administrative Office Personnel'],
      ['reviewer-b','Administrative Office Personnel'], ['student-a','Student'], ['student-b','Student']
    ]) {
      await pool.query(
        `INSERT INTO user_role_assignments (user_id, role_id)
         SELECT $1, id FROM role_catalog WHERE name = $2`, [users[username], role]
      );
    }
    const period = (await pool.query("INSERT INTO academic_periods (code,label) VALUES ('TST-1','Test Period') RETURNING id")).rows[0].id;
    const programA = (await pool.query("INSERT INTO programs (code,name) VALUES ('PA','Program A') RETURNING id")).rows[0].id;
    const programB = (await pool.query("INSERT INTO programs (code,name) VALUES ('PB','Program B') RETURNING id")).rows[0].id;
    const officeA = (await pool.query("INSERT INTO offices (code,name) VALUES ('OA','Office A') RETURNING id")).rows[0].id;
    const officeB = (await pool.query("INSERT INTO offices (code,name) VALUES ('OB','Office B') RETURNING id")).rows[0].id;
    await pool.query('INSERT INTO office_staff_assignments (user_id,office_id) VALUES ($1,$2),($3,$4)', [users['reviewer-a'],officeA,users['reviewer-b'],officeB]);
    const studentA = (await pool.query("INSERT INTO student_profiles (user_id,student_number,full_name,program_id) VALUES ($1,'ST-A','Student A',$2) RETURNING id", [users['student-a'],programA])).rows[0].id;
    const studentB = (await pool.query("INSERT INTO student_profiles (user_id,student_number,full_name,program_id) VALUES ($1,'ST-B','Student B',$2) RETURNING id", [users['student-b'],programB])).rows[0].id;
    const reqA = (await pool.query("INSERT INTO requirement_definitions (code,name,office_id) VALUES ('RA','Req A',$1) RETURNING id",[officeA])).rows[0].id;
    const reqB = (await pool.query("INSERT INTO requirement_definitions (code,name,office_id) VALUES ('RB','Req B',$1) RETURNING id",[officeB])).rows[0].id;
    const template = (await pool.query("INSERT INTO clearance_templates (code,name,academic_period_id) VALUES ('T','Template',$1) RETURNING id",[period])).rows[0].id;
    const trA = (await pool.query("INSERT INTO template_requirements (template_id,requirement_definition_id,is_mandatory,remark_required_on_reject,applicable_program_id) VALUES ($1,$2,TRUE,'REQUIRED',$3) RETURNING id",[template,reqA,programA])).rows[0].id;
    const trB = (await pool.query("INSERT INTO template_requirements (template_id,requirement_definition_id,is_mandatory,remark_required_on_reject,applicable_program_id) VALUES ($1,$2,TRUE,'OPTIONAL',$3) RETURNING id",[template,reqB,programB])).rows[0].id;
    const assignedA = await assignClearanceForStudent(pool,{studentProfileId:studentA,templateId:template});
    const assignedB = await assignClearanceForStudent(pool,{studentProfileId:studentB,templateId:template});
    const recordA = (await pool.query('SELECT id FROM clearance_requirement_records WHERE clearance_request_id=$1',[assignedA.requestId])).rows[0].id;
    const recordB = (await pool.query('SELECT id FROM clearance_requirement_records WHERE clearance_request_id=$1',[assignedB.requestId])).rows[0].id;
    ids = { ...users, studentA, studentB, officeA, officeB, period, template, trA, trB,
      requestA: assignedA.requestId, requestB: assignedB.requestId, recordA, recordB };
  }

  async function login(username) {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST', headers: {'content-type':'application/json'},
      body: JSON.stringify({username,password:TEST_PASSWORD})
    });
    assert.equal(response.status, 200);
    const cookie = response.headers.get('set-cookie');
    assert.ok(cookie);
    return cookie.split(';')[0];
  }

  async function decision(cookie, recordId, decision = 'Approved', remark) {
    return fetch(`${baseUrl}/api/staff/review-items/${recordId}/decision`, {
      method: 'POST', headers: {'content-type':'application/json',cookie},
      body: JSON.stringify({decision, ...(remark === undefined ? {} : {remark})})
    });
  }

  before(async () => {
    await resetDatabase();
    const app = createApp(pool);
    server = app.listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  beforeEach(async () => {
    // Recreate the dedicated disposable test schema instead of truncating append-only history.
    await resetDatabase();
  });

  after(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
    await pool.end();
  });

  test('FS-01 authenticates and does not return password hash', async () => {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({username:'student-a',password:TEST_PASSWORD})
    });
    assert.equal(response.status,200);
    const body = await response.json();
    assert.equal(JSON.stringify(body).includes('$argon2id$'),false);
    const hash = (await pool.query('SELECT password_hash FROM user_accounts WHERE username=$1',['student-a'])).rows[0].password_hash;
    assert.equal(hash.startsWith('$argon2id$'),true);
    assert.match(hash,/m=19456,t=2,p=1/);
  });

  test('FS-02 backend assignment applies program-specific requirements', async () => {
    const a = await pool.query('SELECT rd.code FROM clearance_requirement_records crr JOIN template_requirements tr ON tr.id=crr.template_requirement_id JOIN requirement_definitions rd ON rd.id=tr.requirement_definition_id WHERE crr.clearance_request_id=$1',[ids.requestA]);
    const b = await pool.query('SELECT rd.code FROM clearance_requirement_records crr JOIN template_requirements tr ON tr.id=crr.template_requirement_id JOIN requirement_definitions rd ON rd.id=tr.requirement_definition_id WHERE crr.clearance_request_id=$1',[ids.requestB]);
    assert.deepEqual(a.rows.map(x=>x.code),['RA']);
    assert.deepEqual(b.rows.map(x=>x.code),['RB']);
  });

  test('FS-02 assignment rejects a template with zero applicable mandatory requirements', async () => {
    const user = (await pool.query("INSERT INTO user_accounts (username,display_name,password_hash) SELECT 'student-zero','Zero Student',password_hash FROM user_accounts WHERE username='student-a' RETURNING id")).rows[0].id;
    const programA = (await pool.query("SELECT id FROM programs WHERE code='PA'")).rows[0].id;
    const student = (await pool.query("INSERT INTO student_profiles (user_id,student_number,full_name,program_id) VALUES ($1,'ST-ZERO','Zero Student',$2) RETURNING id", [user, programA])).rows[0].id;
    await pool.query('UPDATE template_requirements SET is_active=FALSE WHERE template_id=$1', [ids.template]);
    try {
      await assert.rejects(
        assignClearanceForStudent(pool, { studentProfileId: student, templateId: ids.template }),
        (error) => error.status === 422 && error.code === 'NO_MANDATORY_REQUIREMENTS'
      );
    } finally {
      await pool.query('UPDATE template_requirements SET is_active=TRUE WHERE template_id=$1', [ids.template]);
    }
    const count = await pool.query('SELECT COUNT(*)::int AS count FROM clearance_requests WHERE student_profile_id=$1', [student]);
    assert.equal(count.rows[0].count, 0);
  });

  test('FS-03 review queue defaults to Pending and supports status filtering', async () => {
    const cookie = await login('reviewer-a');
    const pending = await fetch(`${baseUrl}/api/staff/review-items`,{headers:{cookie}});
    assert.equal(pending.status,200);
    const pendingBody = await pending.json();
    assert.equal(pendingBody.filter,'Pending');
    assert.equal(pendingBody.items.length,1);
    await decision(cookie,ids.recordA,'Approved');
    const approved = await fetch(`${baseUrl}/api/staff/review-items?status=Approved`,{headers:{cookie}});
    assert.equal(approved.status,200);
    assert.equal((await approved.json()).items.length,1);
  });

  test('FS-03B Reviewer B cannot see Office A items and detail access is scoped', async () => {
    const reviewerB = await login('reviewer-b');
    const list = await fetch(`${baseUrl}/api/staff/review-items`, { headers: { cookie: reviewerB } });
    assert.equal(list.status, 200);
    const body = await list.json();
    assert.equal(body.items.length, 1);
    assert.equal(body.items[0].requirement_code, 'RB');
    const forbiddenDetail = await fetch(`${baseUrl}/api/staff/review-items/${ids.recordA}`, { headers: { cookie: reviewerB } });
    assert.equal(forbiddenDetail.status, 404);
    const ownDetail = await fetch(`${baseUrl}/api/staff/review-items/${ids.recordB}`, { headers: { cookie: reviewerB } });
    assert.equal(ownDetail.status, 200);
  });

  test('FS-04 authorized reviewer can retrieve a Pending review item', async () => {
    const cookie = await login('reviewer-a');
    const response = await fetch(`${baseUrl}/api/staff/review-items/${ids.recordA}`, { headers: { cookie } });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.item.record_id, ids.recordA);
    assert.equal(body.item.status, 'Pending');
    assert.equal(body.item.requirement_code, 'RA');
  });

  test('FS-05 missing and whitespace-only REQUIRED remark returns 422; OPTIONAL permits omission', async () => {
    const reviewerA = await login('reviewer-a');
    const missing = await decision(reviewerA,ids.recordA,'Rejected');
    assert.equal(missing.status,422);
    const whitespace = await decision(reviewerA,ids.recordA,'Rejected','   \t ');
    assert.equal(whitespace.status,422);
    const tooLong = await decision(reviewerA,ids.recordA,'Rejected','x'.repeat(1001));
    assert.equal(tooLong.status,422);
    const reviewerB = await login('reviewer-b');
    const optional = await decision(reviewerB,ids.recordB,'Rejected');
    assert.equal(optional.status,200);
  });

  test('FS-06 wrong office assignment and wrong role return 403', async () => {
    const reviewerB = await login('reviewer-b');
    const denied = await decision(reviewerB,ids.recordA,'Approved');
    assert.equal(denied.status,403);
    const student = await login('student-a');
    const wrongRole = await decision(student,ids.recordA,'Approved');
    assert.equal(wrongRole.status,403);
    const state = await pool.query('SELECT status FROM clearance_requirement_records WHERE id=$1',[ids.recordA]);
    const history = await pool.query('SELECT COUNT(*)::int AS count FROM processing_history_events WHERE requirement_record_id=$1',[ids.recordA]);
    assert.equal(state.rows[0].status,'Pending');
    assert.equal(history.rows[0].count,0);
  });

  test('FS-07 decision and history contain matching actor and status fields', async () => {
    const cookie = await login('reviewer-a');
    const response = await decision(cookie,ids.recordA,'Rejected','Fictional test remark');
    assert.equal(response.status,200);
    const history = await pool.query('SELECT actor_user_id,previous_status,new_status,remark,created_at FROM processing_history_events WHERE requirement_record_id=$1',[ids.recordA]);
    assert.equal(history.rowCount,1);
    assert.equal(Number(history.rows[0].actor_user_id),Number(ids['reviewer-a']));
    assert.equal(history.rows[0].previous_status,'Pending');
    assert.equal(history.rows[0].new_status,'Rejected');
    assert.equal(history.rows[0].remark,'Fictional test remark');
    assert.ok(history.rows[0].created_at instanceof Date);
  });

  test('FS-08 another student receives the identical 404 body as an unknown request', async () => {
    const cookie = await login('student-a');
    const notOwned = await fetch(`${baseUrl}/api/student/clearance-requests/${ids.requestB}`,{headers:{cookie}});
    const missing = await fetch(`${baseUrl}/api/student/clearance-requests/99999999`,{headers:{cookie}});
    assert.equal(notOwned.status,404);
    assert.equal(missing.status,404);
    assert.deepEqual(await notOwned.json(),await missing.json());
  });

  test('FS-09 completion is derived from persisted mandatory requirement status', async () => {
    const reviewer = await login('reviewer-a');
    const student = await login('student-a');
    const before = await fetch(`${baseUrl}/api/student/clearance-requests`, { headers: { cookie: student } });
    const beforeRequest = (await before.json()).requests[0];
    assert.equal(beforeRequest.completion.isComplete, false);
    assert.equal(beforeRequest.completion.mandatoryTotal, 1);
    assert.equal((await decision(reviewer, ids.recordA, 'Approved')).status, 200);
    const after = await fetch(`${baseUrl}/api/student/clearance-requests`, { headers: { cookie: student } });
    const afterRequest = (await after.json()).requests[0];
    assert.equal(afterRequest.completion.isComplete, true);
    assert.equal(afterRequest.completion.mandatoryApproved, 1);
  });

  test('FS-11 a second decision returns 409 before remark validation', async () => {
    const cookie = await login('reviewer-a');
    assert.equal((await decision(cookie,ids.recordA,'Approved')).status,200);
    const second = await decision(cookie,ids.recordA,'Rejected','   ');
    assert.equal(second.status,409);
  });

  test('FS-13 two parallel decisions produce exactly one success and one conflict', async () => {
    const cookie = await login('reviewer-a');
    const results = await Promise.all([
      decision(cookie,ids.recordA,'Approved'),
      decision(cookie,ids.recordA,'Rejected','Parallel test')
    ]);
    assert.deepEqual(results.map(x=>x.status).sort(),[200,409]);
    const history = await pool.query('SELECT COUNT(*)::int AS count FROM processing_history_events WHERE requirement_record_id=$1',[ids.recordA]);
    assert.equal(history.rows[0].count,1);
  });

  test('FS-14 unauthenticated protected request returns 401', async () => {
    const response = await fetch(`${baseUrl}/api/student/clearance-requests`);
    assert.equal(response.status,401);
    const staffResponse = await fetch(`${baseUrl}/api/staff/review-items`);
    assert.equal(staffResponse.status,401);
  });

  test('FS-15 history insert failure rolls back the requirement update', async () => {
    await pool.query(`CREATE OR REPLACE FUNCTION fail_history_insert() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'test-only history fault'; END $$`);
    await pool.query('CREATE TRIGGER test_fail_history BEFORE INSERT ON processing_history_events FOR EACH ROW EXECUTE FUNCTION fail_history_insert()');
    try {
      const cookie = await login('reviewer-a');
      const response = await decision(cookie,ids.recordA,'Approved');
      assert.equal(response.status,500);
      const state = await pool.query('SELECT status FROM clearance_requirement_records WHERE id=$1',[ids.recordA]);
      const events = await pool.query('SELECT COUNT(*)::int AS count FROM processing_history_events WHERE requirement_record_id=$1',[ids.recordA]);
      assert.equal(state.rows[0].status,'Pending');
      assert.equal(events.rows[0].count,0);
    } finally {
      await pool.query('DROP TRIGGER IF EXISTS test_fail_history ON processing_history_events');
      await pool.query('DROP FUNCTION IF EXISTS fail_history_insert()');
    }
  });

  test('FS-15 status update failure cannot create a history event', async () => {
    await pool.query(`CREATE OR REPLACE FUNCTION fail_status_update() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'test-only status fault'; END $$`);
    await pool.query('CREATE TRIGGER test_fail_status BEFORE UPDATE ON clearance_requirement_records FOR EACH ROW EXECUTE FUNCTION fail_status_update()');
    try {
      const cookie = await login('reviewer-a');
      const response = await decision(cookie,ids.recordA,'Approved');
      assert.equal(response.status,500);
      const state = await pool.query('SELECT status FROM clearance_requirement_records WHERE id=$1',[ids.recordA]);
      const events = await pool.query('SELECT COUNT(*)::int AS count FROM processing_history_events WHERE requirement_record_id=$1',[ids.recordA]);
      assert.equal(state.rows[0].status,'Pending');
      assert.equal(events.rows[0].count,0);
    } finally {
      await pool.query('DROP TRIGGER IF EXISTS test_fail_status ON clearance_requirement_records');
      await pool.query('DROP FUNCTION IF EXISTS fail_status_update()');
    }
  });

  test('FS-16 concurrent duplicate assignment creates one request only', async () => {
    const user = (await pool.query("INSERT INTO user_accounts (username,display_name,password_hash) SELECT 'student-c','Student C',password_hash FROM user_accounts WHERE username='student-a' RETURNING id")).rows[0].id;
    const programA = (await pool.query("SELECT id FROM programs WHERE code='PA'")).rows[0].id;
    const student = (await pool.query("INSERT INTO student_profiles (user_id,student_number,full_name,program_id) VALUES ($1,'ST-C','Student C',$2) RETURNING id",[user,programA])).rows[0].id;
    const results = await Promise.all([
      assignClearanceForStudent(pool,{studentProfileId:student,templateId:ids.template}),
      assignClearanceForStudent(pool,{studentProfileId:student,templateId:ids.template})
    ]);
    assert.equal(results.filter(x=>x.created).length,1);
    const count = await pool.query('SELECT COUNT(*)::int AS count FROM clearance_requests WHERE student_profile_id=$1',[student]);
    assert.equal(count.rows[0].count,1);
  });

  test('history is append-only and request deletion cannot cascade away records/history', async () => {
    const cookie = await login('reviewer-a');
    assert.equal((await decision(cookie, ids.recordA, 'Approved')).status, 200);

    const event = (
      await pool.query(
        'SELECT id FROM processing_history_events WHERE requirement_record_id=$1',
        [ids.recordA]
      )
    ).rows[0];

    await assert.rejects(
      pool.query(
        'UPDATE processing_history_events SET remark=$1 WHERE id=$2',
        ['tamper', event.id]
      ),
      (error) => error.code === '55000'
    );

    await assert.rejects(
      pool.query('DELETE FROM processing_history_events WHERE id=$1', [event.id]),
      (error) => error.code === '55000'
    );

    await assert.rejects(
      pool.query('TRUNCATE TABLE processing_history_events'),
      (error) => error.code === '55000'
    );

    // A requirement record with history cannot be deleted.
    await assert.rejects(
      pool.query(
        'DELETE FROM clearance_requirement_records WHERE id=$1',
        [ids.recordA]
      ),
      (error) =>
        error.code === '23001' &&
        error.constraint === 'processing_history_events_requirement_record_id_fkey'
    );

    // A clearance request containing requirement records cannot be deleted.
    await assert.rejects(
      pool.query(
        'DELETE FROM clearance_requests WHERE id=$1',
        [ids.requestA]
      ),
      (error) =>
        error.code === '23001' &&
        error.constraint === 'clearance_requirement_records_clearance_request_id_fkey'
    );

    // Confirm the requirement record and its history still exist.
    const remaining = await pool.query(
      `SELECT
        (SELECT COUNT(*)::int FROM clearance_requirement_records WHERE id=$1) AS record_count,
        (SELECT COUNT(*)::int FROM processing_history_events WHERE id=$2) AS history_count`,
      [ids.recordA, event.id]
    );

    assert.equal(remaining.rows[0].record_count, 1);
    assert.equal(remaining.rows[0].history_count, 1);
  });

  test('FS-17 inactive office staff assignment is denied', async () => {
    await pool.query('UPDATE office_staff_assignments SET is_active=FALSE WHERE user_id=$1 AND office_id=$2',[ids['reviewer-a'],ids.officeA]);
    const cookie = await login('reviewer-a');
    const response = await decision(cookie,ids.recordA,'Approved');
    assert.equal(response.status,403);
  });

  test('AUTH-04 expired session is rejected on the next authenticated request', async () => {
    const cookie = await login('student-a');
    assert.ok(cookie.startsWith('cdcms.sid='));

    const token = decodeURIComponent(cookie.slice('cdcms.sid='.length));
    const digest = crypto.createHash('sha256').update(token).digest('hex');

    const updated = await pool.query(
      "UPDATE app_sessions SET expires_at=NOW()-INTERVAL '1 minute' WHERE token_hash=$1",
      [digest]
    );
    assert.equal(updated.rowCount, 1);

    const response = await fetch(`${baseUrl}/api/me`, { headers: { cookie } });
    assert.equal(response.status, 401);
  });

  test('AUTH-05 logout invalidates the session and clears the cookie', async () => {
    const cookie = await login('student-a');

    const logout = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { cookie }
    });

    assert.equal(logout.status, 200);
    assert.match(logout.headers.get('set-cookie') ?? '', /Max-Age=0/i);

    const replay = await fetch(`${baseUrl}/api/me`, { headers: { cookie } });
    assert.equal(replay.status, 401);
  });

  test('AUTH-06 inactive account cannot use an existing session', async () => {
    const cookie = await login('student-a');

    await pool.query(
      'UPDATE user_accounts SET is_active=FALSE WHERE id=$1',
      [ids['student-a']]
    );

    const response = await fetch(`${baseUrl}/api/me`, { headers: { cookie } });
    assert.equal(response.status, 401);
  });
}

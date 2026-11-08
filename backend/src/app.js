import express from 'express';
import argon2 from 'argon2';
import { AppError, errorHandler } from './errors.js';
import { calculateCompletion, validateDecision } from './domain.js';
import {
  clearSessionCookie,
  createAuthMiddleware,
  destroySession,
  getUserRoles,
  loginUser,
  requireAuthentication,
  requireRole,
  setSessionCookie
} from './auth.js';

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function asSafeInteger(value) {
  if (!/^\d+$/.test(String(value))) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function allowedOrigins() {
  return new Set((process.env.WEB_ORIGINS ?? 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',').map((item) => item.trim()).filter(Boolean));
}

export function createApp(pool) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));
  app.use('/api', (_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });

  // Permit only the configured browser origins. Native Android requests have no Origin header.
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      if (!allowedOrigins().has(origin)) {
        return next(new AppError(403, 'ORIGIN_NOT_ALLOWED', 'This application origin is not allowed.'));
      }
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    }
    if (req.method === 'OPTIONS') return res.status(204).end();
    next();
  });

  app.use(createAuthMiddleware(pool));

  app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'cdcms-api' }));

  app.post('/api/auth/login', asyncRoute(async (req, res) => {
    const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!username || !password) {
      throw new AppError(400, 'LOGIN_FIELDS_REQUIRED', 'Username and password are required.');
    }
    const { token, user } = await loginUser(pool, argon2, username, password);
    setSessionCookie(res, token);
    const roles = await getUserRoles(pool, user.id);
    res.json({ user: { ...user, roles } });
  }));

  app.post('/api/auth/logout', requireAuthentication, asyncRoute(async (req, res) => {
    await destroySession(pool, req);
    clearSessionCookie(res);
    res.json({ ok: true });
  }));

  app.get('/api/me', requireAuthentication, asyncRoute(async (req, res) => {
    const roles = await getUserRoles(pool, req.user.id);
    res.json({ user: { id: req.user.id, username: req.user.username, displayName: req.user.display_name, roles } });
  }));

  app.get('/api/staff/review-items/:recordId', requireAuthentication, requireRole(pool, 'Administrative Office Personnel'), asyncRoute(async (req, res) => {
    const recordId = asSafeInteger(req.params.recordId);
    if (!recordId) throw new AppError(400, 'INVALID_RECORD_ID', 'Record identifier must be a positive integer.');
    const result = await pool.query(
      `SELECT crr.id AS record_id, crr.status, cr.id AS request_id,
              sp.student_number, sp.full_name AS student_name, p.name AS program_name,
              rd.code AS requirement_code, rd.name AS requirement_name, o.name AS office_name,
              tr.is_mandatory, tr.remark_required_on_reject, crr.created_at
         FROM clearance_requirement_records crr
         JOIN clearance_requests cr ON cr.id = crr.clearance_request_id
         JOIN student_profiles sp ON sp.id = cr.student_profile_id AND sp.is_active = TRUE
         JOIN user_accounts student_account ON student_account.id = sp.user_id AND student_account.is_active = TRUE
         JOIN programs p ON p.id = sp.program_id AND p.is_active = TRUE
         JOIN template_requirements tr ON tr.id = crr.template_requirement_id AND tr.is_active = TRUE
         JOIN requirement_definitions rd ON rd.id = tr.requirement_definition_id AND rd.is_active = TRUE
         JOIN offices o ON o.id = crr.office_id AND o.is_active = TRUE
        WHERE crr.id = $1
          AND EXISTS (SELECT 1 FROM office_staff_assignments osa
                       WHERE osa.user_id = $2 AND osa.office_id = crr.office_id AND osa.is_active = TRUE)
        LIMIT 1`,
      [recordId, req.user.id]
    );
    if (result.rowCount !== 1) {
      // The reviewer-facing detail route intentionally hides both unknown and unassigned records.
      throw new AppError(404, 'REVIEW_ITEM_NOT_FOUND', 'Review item was not found.');
    }
    res.json({ item: result.rows[0] });
  }));

  app.get('/api/staff/review-items', requireAuthentication, requireRole(pool, 'Administrative Office Personnel'), asyncRoute(async (req, res) => {
    const allowed = new Set(['Pending', 'Approved', 'Rejected', 'All']);
    const status = req.query.status ?? 'Pending';
    if (!allowed.has(status)) throw new AppError(400, 'INVALID_STATUS_FILTER', 'Status filter must be Pending, Approved, Rejected, or All.');

    const result = await pool.query(
      `SELECT crr.id AS record_id,
              crr.status,
              cr.id AS request_id,
              sp.student_number,
              sp.full_name AS student_name,
              p.name AS program_name,
              rd.code AS requirement_code,
              rd.name AS requirement_name,
              o.name AS office_name,
              tr.is_mandatory,
              tr.remark_required_on_reject,
              crr.created_at
         FROM clearance_requirement_records crr
         JOIN clearance_requests cr ON cr.id = crr.clearance_request_id
         JOIN student_profiles sp ON sp.id = cr.student_profile_id AND sp.is_active = TRUE
         JOIN user_accounts student_account ON student_account.id = sp.user_id AND student_account.is_active = TRUE
         JOIN programs p ON p.id = sp.program_id AND p.is_active = TRUE
         JOIN template_requirements tr ON tr.id = crr.template_requirement_id AND tr.is_active = TRUE
         JOIN requirement_definitions rd ON rd.id = tr.requirement_definition_id AND rd.is_active = TRUE
         JOIN offices o ON o.id = crr.office_id AND o.is_active = TRUE
        WHERE EXISTS (
          SELECT 1 FROM office_staff_assignments osa
           WHERE osa.user_id = $1 AND osa.office_id = crr.office_id AND osa.is_active = TRUE
             AND EXISTS (SELECT 1 FROM offices active_office WHERE active_office.id = osa.office_id AND active_office.is_active = TRUE)
        )
          AND ($2 = 'All' OR crr.status = $2)
        ORDER BY CASE crr.status WHEN 'Pending' THEN 0 ELSE 1 END, sp.student_number, rd.code`,
      [req.user.id, status]
    );
    res.json({ items: result.rows, filter: status });
  }));

  app.post('/api/staff/review-items/:recordId/decision', requireAuthentication, requireRole(pool, 'Administrative Office Personnel'), asyncRoute(async (req, res) => {
    const recordId = asSafeInteger(req.params.recordId);
    if (!recordId) throw new AppError(400, 'INVALID_RECORD_ID', 'Record identifier must be a positive integer.');
    if (typeof req.body?.decision !== 'string') throw new AppError(400, 'DECISION_REQUIRED', 'Decision is required.');

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const result = await client.query(
        `SELECT crr.id, crr.status, crr.office_id,
                tr.remark_required_on_reject
           FROM clearance_requirement_records crr
           JOIN template_requirements tr ON tr.id = crr.template_requirement_id AND tr.is_active = TRUE
           JOIN requirement_definitions rd ON rd.id = tr.requirement_definition_id AND rd.is_active = TRUE
          WHERE crr.id = $1
          FOR UPDATE OF crr`,
        [recordId]
      );
      if (result.rowCount !== 1) throw new AppError(404, 'REVIEW_ITEM_NOT_FOUND', 'Review item was not found.');
      const record = result.rows[0];

      const assignment = await client.query(
        `SELECT 1 FROM office_staff_assignments osa
          JOIN offices o ON o.id = osa.office_id AND o.is_active = TRUE
          WHERE osa.user_id = $1 AND osa.office_id = $2 AND osa.is_active = TRUE`,
        [req.user.id, record.office_id]
      );
      if (assignment.rowCount !== 1) {
        throw new AppError(403, 'OFFICE_ASSIGNMENT_REQUIRED', 'You are not assigned to the office responsible for this item.');
      }

      const decision = validateDecision({
        currentStatus: record.status,
        decision: req.body.decision,
        remarkFlag: record.remark_required_on_reject,
        remark: req.body.remark
      });

      const update = await client.query(
        `UPDATE clearance_requirement_records
            SET status = $2, updated_at = NOW()
          WHERE id = $1 AND status = 'Pending'
          RETURNING id, status`,
        [recordId, decision.decision]
      );
      if (update.rowCount !== 1) throw new AppError(409, 'DECISION_CONFLICT', 'This requirement has already been processed.');

      await client.query(
        `INSERT INTO processing_history_events
           (requirement_record_id, actor_user_id, previous_status, new_status, remark)
         VALUES ($1, $2, $3, $4, $5)`,
        [recordId, req.user.id, record.status, decision.decision, decision.remark]
      );
      await client.query('COMMIT');
      res.json({ recordId, previousStatus: record.status, newStatus: decision.decision });
    } catch (error) {
      try { await client.query('ROLLBACK'); } catch { /* preserve original error */ }
      throw error;
    } finally {
      client.release();
    }
  }));

  app.get('/api/student/clearance-requests', requireAuthentication, requireRole(pool, 'Student'), asyncRoute(async (req, res) => {
    const result = await pool.query(
      `SELECT cr.id AS request_id,
              ap.label AS academic_period,
              cr.created_at,
              crr.id AS record_id,
              crr.status,
              rd.code AS requirement_code,
              rd.name AS requirement_name,
              tr.is_mandatory,
              phe.remark
         FROM clearance_requests cr
         JOIN student_profiles sp ON sp.id = cr.student_profile_id
         JOIN academic_periods ap ON ap.id = cr.academic_period_id
         JOIN clearance_requirement_records crr ON crr.clearance_request_id = cr.id
         JOIN template_requirements tr ON tr.id = crr.template_requirement_id
         JOIN requirement_definitions rd ON rd.id = tr.requirement_definition_id
         LEFT JOIN LATERAL (
           SELECT remark FROM processing_history_events
            WHERE requirement_record_id = crr.id
            ORDER BY created_at DESC, id DESC LIMIT 1
         ) phe ON TRUE
        WHERE sp.user_id = $1
        ORDER BY cr.id, crr.id`,
      [req.user.id]
    );
    const requests = groupStudentRows(result.rows);
    res.json({ requests });
  }));

  app.get('/api/student/clearance-requests/:requestId', requireAuthentication, requireRole(pool, 'Student'), asyncRoute(async (req, res) => {
    const requestId = asSafeInteger(req.params.requestId);
    if (!requestId) throw new AppError(404, 'CLEARANCE_NOT_FOUND', 'Clearance request was not found.');
    const result = await pool.query(
      `SELECT cr.id AS request_id,
              ap.label AS academic_period,
              cr.created_at,
              crr.id AS record_id,
              crr.status,
              rd.code AS requirement_code,
              rd.name AS requirement_name,
              tr.is_mandatory,
              phe.remark
         FROM clearance_requests cr
         JOIN student_profiles sp ON sp.id = cr.student_profile_id
         JOIN academic_periods ap ON ap.id = cr.academic_period_id
         JOIN clearance_requirement_records crr ON crr.clearance_request_id = cr.id
         JOIN template_requirements tr ON tr.id = crr.template_requirement_id
         JOIN requirement_definitions rd ON rd.id = tr.requirement_definition_id
         LEFT JOIN LATERAL (
           SELECT remark FROM processing_history_events
            WHERE requirement_record_id = crr.id
            ORDER BY created_at DESC, id DESC LIMIT 1
         ) phe ON TRUE
        WHERE cr.id = $1 AND sp.user_id = $2
        ORDER BY crr.id`,
      [requestId, req.user.id]
    );
    if (result.rowCount === 0) {
      // Same response body for nonexistent and another student's request.
      throw new AppError(404, 'CLEARANCE_NOT_FOUND', 'Clearance request was not found.');
    }
    res.json({ request: groupStudentRows(result.rows)[0] });
  }));

  app.use((_req, _res, next) => next(new AppError(404, 'ROUTE_NOT_FOUND', 'API route was not found.')));
  app.use(errorHandler);
  return app;
}

function groupStudentRows(rows) {
  const grouped = new Map();
  for (const row of rows) {
    if (!grouped.has(row.request_id)) {
      grouped.set(row.request_id, {
        requestId: row.request_id,
        academicPeriod: row.academic_period,
        createdAt: row.created_at,
        requirements: []
      });
    }
    grouped.get(row.request_id).requirements.push({
      recordId: row.record_id,
      requirementCode: row.requirement_code,
      requirementName: row.requirement_name,
      status: row.status,
      isMandatory: row.is_mandatory,
      remark: row.remark
    });
  }
  return [...grouped.values()].map((request) => ({
    ...request,
    completion: calculateCompletion(request.requirements)
  }));
}

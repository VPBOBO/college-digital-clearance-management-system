import { AppError } from './errors.js';

/**
 * Assign one student's applicable requirements from a template.
 * This is the same backend use case that a future admin endpoint must call.
 * It is intentionally called by seed.js instead of inserting assignment rows directly.
 */
export async function assignClearanceForStudent(pool, { studentProfileId, templateId }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const studentResult = await client.query(
      `SELECT sp.id, sp.program_id
         FROM student_profiles sp
         JOIN user_accounts ua ON ua.id = sp.user_id AND ua.is_active = TRUE
         JOIN programs p ON p.id = sp.program_id AND p.is_active = TRUE
        WHERE sp.id = $1 AND sp.is_active = TRUE`,
      [studentProfileId]
    );
    if (studentResult.rowCount !== 1) {
      throw new AppError(404, 'STUDENT_NOT_FOUND', 'Student profile was not found or is inactive.');
    }

    const templateResult = await client.query(
      `SELECT ct.id, ct.academic_period_id
         FROM clearance_templates ct
         JOIN academic_periods ap ON ap.id = ct.academic_period_id AND ap.is_active = TRUE
        WHERE ct.id = $1 AND ct.is_active = TRUE`,
      [templateId]
    );
    if (templateResult.rowCount !== 1) {
      throw new AppError(404, 'TEMPLATE_NOT_FOUND', 'Clearance template was not found or is inactive.');
    }

    const student = studentResult.rows[0];
    const template = templateResult.rows[0];
    const applicableResult = await client.query(
      `SELECT tr.id AS template_requirement_id,
              tr.is_mandatory,
              tr.remark_required_on_reject,
              rd.office_id
         FROM template_requirements tr
         JOIN requirement_definitions rd ON rd.id = tr.requirement_definition_id
         JOIN offices o ON o.id = rd.office_id AND o.is_active = TRUE
        WHERE tr.template_id = $1
          AND tr.is_active = TRUE
          AND rd.is_active = TRUE
          AND (tr.applicable_program_id IS NULL OR tr.applicable_program_id = $2)
        ORDER BY tr.id`,
      [templateId, student.program_id]
    );

    const mandatoryCount = applicableResult.rows.filter((row) => row.is_mandatory).length;
    if (mandatoryCount === 0) {
      throw new AppError(422, 'NO_MANDATORY_REQUIREMENTS', 'The applicable template has no mandatory requirements.');
    }

    const insertRequest = await client.query(
      `INSERT INTO clearance_requests (student_profile_id, template_id, academic_period_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_profile_id, template_id, academic_period_id) DO NOTHING
       RETURNING id`,
      [studentProfileId, templateId, template.academic_period_id]
    );

    const created = insertRequest.rowCount === 1;
    let requestId = insertRequest.rows[0]?.id;
    if (!created) {
      const existing = await client.query(
        `SELECT id FROM clearance_requests
          WHERE student_profile_id = $1 AND template_id = $2 AND academic_period_id = $3`,
        [studentProfileId, templateId, template.academic_period_id]
      );
      requestId = existing.rows[0]?.id;
      if (!requestId) throw new Error('Conflicting clearance request was not visible after uniqueness check.');
      const existingCount = await client.query(
        'SELECT COUNT(*)::int AS count FROM clearance_requirement_records WHERE clearance_request_id = $1',
        [requestId]
      );
      await client.query('COMMIT');
      return {
        requestId,
        created: false,
        assignedRequirementCount: existingCount.rows[0].count
      };
    }

    for (const row of applicableResult.rows) {
      await client.query(
        `INSERT INTO clearance_requirement_records
           (clearance_request_id, template_requirement_id, office_id, status)
         VALUES ($1, $2, $3, 'Pending')`,
        [requestId, row.template_requirement_id, row.office_id]
      );
    }

    await client.query('COMMIT');
    return {
      requestId,
      created: true,
      assignedRequirementCount: applicableResult.rowCount
    };
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch { /* preserve original error */ }
    throw error;
  } finally {
    client.release();
  }
}

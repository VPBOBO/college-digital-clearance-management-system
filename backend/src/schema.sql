CREATE TABLE IF NOT EXISTS role_catalog (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_accounts (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_role_assignments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES user_accounts(id),
  role_id BIGINT NOT NULL REFERENCES role_catalog(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS academic_periods (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS programs (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS offices (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS office_staff_assignments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES user_accounts(id),
  office_id BIGINT NOT NULL REFERENCES offices(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (user_id, office_id)
);
CREATE INDEX IF NOT EXISTS idx_office_staff_user_active ON office_staff_assignments(user_id, is_active);

CREATE TABLE IF NOT EXISTS student_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE REFERENCES user_accounts(id),
  student_number TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  program_id BIGINT NOT NULL REFERENCES programs(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS requirement_definitions (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  office_id BIGINT NOT NULL REFERENCES offices(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS clearance_templates (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  academic_period_id BIGINT NOT NULL REFERENCES academic_periods(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS template_requirements (
  id BIGSERIAL PRIMARY KEY,
  template_id BIGINT NOT NULL REFERENCES clearance_templates(id),
  requirement_definition_id BIGINT NOT NULL REFERENCES requirement_definitions(id),
  is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
  remark_required_on_reject TEXT NOT NULL DEFAULT 'UNSPECIFIED'
    CHECK (remark_required_on_reject IN ('UNSPECIFIED', 'OPTIONAL', 'REQUIRED')),
  applicable_program_id BIGINT REFERENCES programs(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (template_id, requirement_definition_id)
);

CREATE TABLE IF NOT EXISTS clearance_requests (
  id BIGSERIAL PRIMARY KEY,
  student_profile_id BIGINT NOT NULL REFERENCES student_profiles(id),
  template_id BIGINT NOT NULL REFERENCES clearance_templates(id),
  academic_period_id BIGINT NOT NULL REFERENCES academic_periods(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_profile_id, template_id, academic_period_id)
);

CREATE TABLE IF NOT EXISTS clearance_requirement_records (
  id BIGSERIAL PRIMARY KEY,
  clearance_request_id BIGINT NOT NULL REFERENCES clearance_requests(id) ON DELETE RESTRICT,
  template_requirement_id BIGINT NOT NULL REFERENCES template_requirements(id),
  office_id BIGINT NOT NULL REFERENCES offices(id),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (clearance_request_id, template_requirement_id)
);
CREATE INDEX IF NOT EXISTS idx_clearance_records_office_status ON clearance_requirement_records(office_id, status);

CREATE TABLE IF NOT EXISTS processing_history_events (
  id BIGSERIAL PRIMARY KEY,
  requirement_record_id BIGINT NOT NULL REFERENCES clearance_requirement_records(id) ON DELETE RESTRICT,
  actor_user_id BIGINT NOT NULL REFERENCES user_accounts(id),
  previous_status TEXT NOT NULL CHECK (previous_status IN ('Pending', 'Approved', 'Rejected')),
  new_status TEXT NOT NULL CHECK (new_status IN ('Approved', 'Rejected')),
  remark TEXT CONSTRAINT processing_history_events_remark_length_check
    CHECK (remark IS NULL OR char_length(remark) <= 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_processing_history_record_created ON processing_history_events(requirement_record_id, created_at DESC);

CREATE TABLE IF NOT EXISTS app_sessions (
  token_hash TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_app_sessions_expiry ON app_sessions(expires_at);


-- Upgrade-safe FK changes: request/record deletion must never cascade through decision history.
ALTER TABLE clearance_requirement_records
  DROP CONSTRAINT IF EXISTS clearance_requirement_records_clearance_request_id_fkey;
ALTER TABLE clearance_requirement_records
  ADD CONSTRAINT clearance_requirement_records_clearance_request_id_fkey
  FOREIGN KEY (clearance_request_id) REFERENCES clearance_requests(id) ON DELETE RESTRICT;

ALTER TABLE processing_history_events
  DROP CONSTRAINT IF EXISTS processing_history_events_requirement_record_id_fkey;
ALTER TABLE processing_history_events
  ADD CONSTRAINT processing_history_events_requirement_record_id_fkey
  FOREIGN KEY (requirement_record_id) REFERENCES clearance_requirement_records(id) ON DELETE RESTRICT;

ALTER TABLE processing_history_events
  DROP CONSTRAINT IF EXISTS processing_history_events_remark_length_check;
ALTER TABLE processing_history_events
  ADD CONSTRAINT processing_history_events_remark_length_check
  CHECK (remark IS NULL OR char_length(remark) <= 1000);

-- Processing history is append-only for application-level data changes.
CREATE OR REPLACE FUNCTION reject_processing_history_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'processing history events are append-only'
    USING ERRCODE = '55000';
END;
$$;
DROP TRIGGER IF EXISTS processing_history_events_immutable ON processing_history_events;
CREATE TRIGGER processing_history_events_immutable
BEFORE UPDATE OR DELETE ON processing_history_events
FOR EACH ROW EXECUTE FUNCTION reject_processing_history_mutation();

-- TRUNCATE is a statement-level operation and does not fire row-level DELETE triggers.
-- Block it explicitly so ordinary SQL access cannot erase the event table in one command.
DROP TRIGGER IF EXISTS processing_history_events_no_truncate ON processing_history_events;
CREATE TRIGGER processing_history_events_no_truncate
BEFORE TRUNCATE ON processing_history_events
FOR EACH STATEMENT EXECUTE FUNCTION reject_processing_history_mutation();

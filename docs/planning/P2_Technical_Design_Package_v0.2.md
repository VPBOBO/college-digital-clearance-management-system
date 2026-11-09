# CDCMS P2 Technical Design and Decision Package

**Document ID:** CDCMS-P2-DESIGN-001<br>
**Version:** 0.2<br>
**Prepared:** 2026-11-09<br>
**Status:** Working technical design reference; TD-R01 and TD-R09 are owner-established for the academic MVP; remaining P2 items retain their recorded open or provisional status.<br>
**Scope:** P2 data model, permissions, authentication, API contract and history design

> **Authority notice:** This document is a technical planning aid. It does not amend Requirements Baseline 0.1 or replace the owner-approved MVP Specification v0.3. TD-R01 and TD-R09 are established separately by the project owner and recorded in `docs/decisions.md`. This document does not establish TD-R07 or any other remaining open or provisional decision. The implementation team retains ownership of production code.

---

## 1. Purpose

P2 exists to agree on the minimum shared technical contracts before the backend, web and Android workstreams develop incompatible assumptions. This package consolidates the current implementation, relevant baseline requirements, MVP v0.3, the approved execution plan, the first-slice technical contract, and the 62-page proposal reconciliation.

P2 must remain time-boxed. It is not an invitation to design every future institutional feature. Resolve or explicitly defer only the decisions needed for the next MVP increments.

### 1.1 Authority and evidence order

Use this order when resolving disagreements:

1. Requirements Baseline 0.1 as applied through CHG-001 and CHG-002.
2. Recorded owner-established decisions, limited to their recorded scope.
3. Owner-approved MVP Specification v0.3, Traceability Crosswalk v0.3 and Execution Plan v0.3.
4. Accepted technical decisions and contracts, when separately recorded.
5. Actual source code and test evidence, to describe the current implementation—not to invent requirements.
6. The original proposal, AI reviews and this package as non-authoritative design input.

Do not infer institutional policy from the sample data, generic examples, AI recommendations or the detail of the original proposal.

## 2. Current state verified from the repository

The following describes the current repository snapshot reviewed for this package. It does not claim that every behavior has been tested on all three team environments.

| Area | Current state | Evidence path |
|---|---|---|
| Client/server architecture | Android Java student client and React/Vite staff/admin web client call one Node/Express API and PostgreSQL database. | `docs/decisions.md` TD-001–TD-008; `backend/src/app.js`; `web/src/api.js`; `android/` |
| Password hashing | Argon2id is an established technology decision. Current parameters are memory 19,456 KiB, time cost 2, parallelism 1. | TD-006; `backend/src/auth.js` |
| Authentication | Opaque server-managed sessions; 32-byte random token; SHA-256 token digest stored in `app_sessions`; HttpOnly, SameSite=Lax cookie; Secure in production; default 8-hour TTL. | `backend/src/auth.js`; `backend/src/schema.sql` |
| Role catalog | Six baseline role values are seeded. Demo accounts currently exercise student, office-personnel and system-administrator roles; instructor demo account is still needed. | `backend/src/seed.js`; `backend/src/schema.sql`; IR-004 |
| Office assignment | Office staff assignments are stored and checked by protected reviewer routes. | `backend/src/schema.sql`; `backend/src/app.js` |
| Configurable requirements | Requirement definitions, templates, template requirements, mandatory flag, program applicability and rejection-remark setting exist in the schema. | `backend/src/schema.sql` |
| Office decisions | Office reviewer can approve/reject assigned pending records; backend validates remark policy, locks and conditionally updates the record, writes processing history in the same transaction. | `backend/src/app.js`; `backend/src/domain.js` |
| Student view | Student routes return only the signed-in student's own clearance information and progress data. | `backend/src/app.js` |
| Academic reference data | The first slice has programs and a simplified academic-period table, but no department table, separate academic-year/semester structure, student-classification catalog/profile link or year-level catalog. Subject/section/enrollment data is absent and remains conditional/open. | `backend/src/schema.sql`; AS-001–AS-010; SC-001–SC-003 |
| Admin configuration UI/API | Not implemented. Current first slice uses seeded configuration and does not satisfy MAC-004. | `docs/implementation/First-Slice_Technical_Contract_Draft_0.3.md`; README |
| Instructor processing | Required by IR-001/IR-002 and P4, but not implemented. IR-003's precise assignment basis remains conditional. | `docs/requirements/instructor-responsibilities.md`; P4 in execution plan |
| Historical configuration | Processing events have append-only triggers and request/record references restrict deletion. This does not by itself preserve the original meaning of mutable requirement/template/assignment configuration. | `backend/src/schema.sql`; RH-001–RH-007; TD-R09 |

### 2.1 Important distinctions

- Argon2id password hashing is already established by TD-006. TD-R01 concerns the shared session/token mechanism, not whether to replace Argon2id.
- `user_role_assignments` can represent multiple role rows, but RP-I03 remains an open institutional question. Database capability is not policy approval.
- Instructor processing is an MVP requirement. The exact instructor-to-student responsibility source is conditional/open; do not require a Student Information System, enrollment import, subjects or sections without evidence.
- Student classification values must be configurable data (SC-001/SC-002), but the actual institutional classification list and criteria are open, and whether classification changes requirement applicability is conditional (SC-003). Use only clearly fictional sample values until those facts are confirmed.
- Academic years/semesters and departments must be manageable as data under AS-005/AS-006. The first-slice period table is simplified, and no department table exists yet; do not claim those admin capabilities are implemented. Year-level/subject/section dimensions remain limited to their approved applicability or assignment need.
- Processing-history immutability and configuration-history preservation are different problems. Do not treat one as a substitute for the other.

## 3. TD-R01 — Authentication mechanism shared by web and Android

**Current decision-register status:** ESTABLISHED / CONFIRMED / REQUIRED (owner-approved 2026-11-09; see `docs/decisions.md` and CHG-004).<br>
**Selected approach:** Opaque, server-managed sessions shared by the web and Android clients for the academic MVP.<br>
**Owner approval:** Recorded on 2026-11-09 in `docs/decisions.md` and CHG-004.

### 3.1 The problem in plain language

Both clients need to prove which user is making a request. With a server-managed session, the client holds a random session identifier and the backend checks that it still exists and is valid. With a self-contained token such as a JWT, the client holds a signed token whose claims can often be checked without a session-table lookup.

The project needs one understandable approach that works with the existing browser and Android clients and allows the backend to revoke access when an account or role becomes inactive.

### 3.2 Options

| Criterion | Opaque server-managed session | Self-contained bearer token (for example JWT) |
|---|---|---|
| Server-side session state | Required in PostgreSQL or another session store. | Not inherently required for access-token validation; refresh/revocation may still require server state. |
| Immediate logout/revocation | Straightforward: delete the session record. | Requires revocation state, short expiry, refresh-token management, or another strategy. |
| Account disablement | Can be checked during each authenticated request. | Must be checked separately or reflected in token/revocation policy. |
| Role change | Current middleware can reload active role assignments for protected operations. | Token claims can become stale unless refreshed or role checks still query the database. |
| Browser | HttpOnly cookie is a natural fit; CSRF and cookie policy must be reviewed. | Bearer-token storage and XSS exposure must be designed carefully. |
| Android | Android must persist and send the cookie correctly; the current client already does this. | Authorization header and secure token storage are needed. |
| Current implementation impact | Retains the working pilot architecture. | Replaces/reworks authentication and both-client integration. |
| Added complexity for current MVP | Low; verification and documentation remain. | Higher; token issue/expiry/refresh/revocation behavior must be added. |

### 3.3 Selected approach

Retain the current opaque server-managed session approach for the current academic MVP:

1. Backend generates a cryptographically random session token using the existing secure random generator.
2. Backend stores only the token digest in PostgreSQL; it does not store the raw session token.
3. Backend sends the raw token to the client using an HttpOnly cookie.
4. Browser cookie uses the configured SameSite policy and Secure in production. Do not set a broad Domain attribute unless deployment requires it.
5. Every protected request validates that the session exists, has not expired, and belongs to an active account.
6. Every protected operation checks current role and record assignment/scope; possession of a session does not grant permission by itself.
7. Logout deletes the server-side session and clears the client cookie.
8. Argon2id remains the independent password-hashing choice under TD-006.

This approach was selected because the working web and Android pilot already use it. Retaining it avoids unnecessary token-refresh, revocation and client-migration work for the academic MVP. Keep the existing implementation where it works; correct only demonstrated problems that prevent the approved workflow from working.

### 3.4 Functional verification of the selected approach

The owner decision is established. These checks verify that the existing implementation works as intended; they are not a gate for selecting sessions. Prioritize sign-in, authenticated requests, logout, expiry and current authorization. Do not add an authentication framework, token-refresh flow or optional hardening unless a specific MVP failure demonstrates the need.

| ID | Check | Expected result |
|---|---|---|
| AUTH-01 | Correct username/password | Login succeeds and returns the expected user identity and active roles, but never the password hash or raw session database digest. |
| AUTH-02 | Unknown username vs wrong password | Same generic public error response; no account enumeration through message differences. |
| AUTH-03 | Session persistence | Database contains a digest, not the raw cookie token. The token has sufficient cryptographic randomness. |
| AUTH-04 | Expiry | An expired server-side session is rejected even if the client still sends its cookie. |
| AUTH-05 | Logout | Logout deletes the session; replaying the previous cookie no longer authenticates. |
| AUTH-06 | Disabled account | An account made inactive cannot use an existing session on the next protected request. |
| AUTH-07 | Role/assignment change | Inactive role or office/instructor assignment prevents subsequent protected actions according to the policy. |
| AUTH-08 | Browser session behavior | The browser can sign in, send its session cookie, and remain authenticated on subsequent API requests from the configured demo application. |
| AUTH-09 | Android restart/expiry | The app returns to sign-in after a process restart because the session cookie is held in memory; the student can sign in again. Backend session expiry remains enforced. |
| AUTH-10 | Session cleanup | The current login path purges expired rows using `purgeExpiredSessions`; verify that cleanup behavior and frequency are suitable. Expiry is independently checked on authenticated requests, so cleanup is housekeeping rather than an access-control mechanism. |

**Verification snapshot (2026-11-09):** The owner ran 28/28 backend unit
tests and 22/22 PostgreSQL integration tests. AUTH-04, AUTH-05 and AUTH-06
passed their dedicated integration tests. The remaining acceptance checks
are partially verified, implementation-reviewed, or not separately tested.
See
[`BUILD_AND_TEST_STATUS_2026-11-09.md`](../implementation/BUILD_AND_TEST_STATUS_2026-11-09.md)
for the evidence and limitations of each check. Do not interpret the overall
test counts as proof that every AUTH check passed.

**Android restart behavior:** The app creates an in-memory `CookieManager`
and opens the sign-in screen when its activity starts. After a full app
process restart, the student signs in again. Persistent session storage is
not part of the current MVP and has not been added.


**Scope note:** Keep the existing session, cookie and origin behavior unless a core MVP test shows that it prevents the intended demo workflow. Do not introduce a CSRF library or another authentication dependency by default. Make only the smallest change needed to fix a demonstrated problem. This is an academic demonstration approach, not a production security certification.

**TTL qualification:** The current default is 8 hours. Keep it as the pilot default for now, but explicitly confirm that it is suitable for the academic demonstration. It is a technical session setting, not an institutional policy.

### 3.5 Established decision wording

> For the academic MVP, use opaque server-managed sessions shared by the web and Android clients. The backend generates a cryptographically random session identifier, stores only its digest in PostgreSQL, and sends the identifier through an HttpOnly cookie. Protected requests validate session existence, expiry and account activity, then independently enforce current role and assignment/scope authorization. Logout invalidates the server-side session. Argon2id password hashing remains governed separately by TD-006. This decision applies to the academic MVP and does not claim production security certification.

**Decision recorded:** This owner-approved approach is already entered in the established decisions section of `docs/decisions.md`. The AUTH checks remain implementation-verification work. Approval does not mean that unrun tests have passed.

## 4. TD-R09 — Historical configuration and assignment preservation

**Current decision-register status:** ESTABLISHED / CONFIRMED / REQUIRED (owner-approved 2026-11-09; see `docs/decisions.md` and CHG-005).<br>
**Selected approach:** Assignment-time snapshots of effective configuration and responsibility values, with stable source references; processing history remains separate and append-only.<br>
**Owner approval:** Recorded on 2026-11-09. Full configuration versioning, a separate assignment-history table, and retroactive correction/reassignment are not approved by this decision.

### 4.1 Required behavior

RH-001 to RH-003 require an existing student-specific clearance record to remain understandable after later changes to a reusable requirement, academic configuration or approval responsibility. RH-004 to RH-007 retain their existing status and qualifications in Requirements Baseline 0.1; this decision selects the snapshot mechanism but does not resolve those separate policy questions. In particular, it does not authorize a retroactive correction or reassignment capability. At minimum, an authorized viewer must be able to establish:

- which requirement was assigned, including its code and name;
- whether it was mandatory or optional and which rejection-remark policy applied;
- the student-program and applicable-program context used when the requirement was assigned;
- which office was responsible at assignment, including the office identity and display label as they then existed;
- the actual decision, actor, timestamp and remark from the separate processing history;
- which source template, template-requirement, requirement definition, academic period and office generated the assignment, using retained source identifiers.

Later edits to reusable configuration must not silently change the meaning or displayed historical context of an existing record. Historical reads must use the stored snapshots; the current active/inactive state of a source configuration row must govern future assignment, not whether an old record can be read.

**Instructor boundary:** Instructor processing remains required by IR-001/IR-002/IR-004, but the instructor-to-student responsibility source remains conditional under IR-003. This TD-R09 decision snapshots the current office-based responsibility model. It does not approve instructor assignment fields or an instructor-assignment workflow. If IR-003 is later resolved to include instructor responsibility, the effective instructor identity and display context must also be preserved for the affected assignment.

### 4.2 Current implementation gap and migration constraint

The current schema retains `template_id` and `academic_period_id` on `clearance_requests`, and `template_requirement_id` and `office_id` on `clearance_requirement_records`. The requirement definition is currently reached through `template_requirements`; the student program is reached through the mutable student profile. Decision events are stored separately in `processing_history_events`, with database protections against update, delete and truncate.

The request and requirement records do not yet contain the complete effective display and policy values. Current read and decision queries use live configuration joins, and some historical reads apply active-state filters. A later rename, policy change, program change, office change or deactivation can therefore alter or hide the context shown for an older record.

The implementation must add the snapshots described in §4.5, populate them when assignments are created, backfill existing development records, and update historical reads and decision validation to use the stored values. The backfill can copy only the values currently found through each existing record's linked configuration. It cannot reconstruct any earlier value that may already have been changed before the snapshot was introduced. Treat pre-backfill history as verified only to the extent supported by existing evidence; do not claim that the backfill recovers unavailable historical states.

`backend/src/migrate.js` currently applies the guarded development `schema.sql`; it does not track or apply an ordered, versioned migration history. Implement snapshot columns and backfill steps so repeated schema application does not overwrite already-populated snapshot values. Selection of any dedicated migration tool remains separate under TD-R11.

### 4.3 Selected method and rejected alternatives

Use **assignment-time snapshots with retained source references**. The existing reusable configuration remains the source for future assignments. During the assignment transaction, the backend copies the effective values needed to interpret the new student-specific request and requirement records. Later configuration edits affect future assignments only; historical reads use the copied values.

This is the smallest approach that fits the existing workflow. It avoids requiring administrators and application queries to manage immutable configuration versions and avoids creating a separate assignment-history table solely to preserve values already captured on the request and requirement records.

The following alternatives are not selected for this MVP decision:

| Alternative | Status | Reason not selected |
|---|---|---|
| Immutable/versioned configuration | Not selected | Adds a version lifecycle and version-aware reads across configuration and history without being necessary for the approved snapshot behavior. |
| Hybrid versioning plus snapshots | Not selected | Adds the cost of both mechanisms; no current evidence justifies that additional complexity. |
| Freeze all configuration once used | Not selected | Restricts ordinary future maintenance and still needs a clear process for creating changed future configuration. |

Retain source IDs for traceability, but do not treat a source ID as a substitute for preserving its former display or policy values. Keep referenced source rows rather than deleting them; deactivate/retire them so they are not used for new assignments. Do not add a retroactive correction or reassignment operation. Any future proposal for that capability requires a separate owner decision and an explicit, auditable design.

### 4.4 Snapshot ownership and read rules

- Request-wide context belongs on `clearance_requests`: the template, academic period and student's program as resolved when the request is generated.
- Requirement-specific context belongs on each `clearance_requirement_records` row: the requirement definition, its template inclusion/policy, applicable-program rule and resolved responsible office.
- Keep the existing foreign-key source references. Add a direct requirement-definition reference to the requirement record so later edits to the template-requirement association cannot change which definition the historical record identifies.
- New assignment logic must write the source references and corresponding snapshot values in the same database transaction.
- Historical student/staff list and detail queries must display snapshot values and must not require linked configuration rows to remain active.
- Decision validation must use the rejection-remark policy snapshot belonging to the record, not the current mutable template-requirement row.
- Current active configuration is still checked when creating future assignments. Snapshotting does not make retired configuration eligible for new assignments.
- Do not update snapshot values when a source configuration row is edited. The normal application workflow must provide no silent path to rewrite an existing snapshot.

### 4.5 Logical snapshot field groups

The following is the minimum logical field mapping for the current schema. It guides the implementation; it is not a claim that the SQL columns or migration have already been added.

| Record | Preserve at assignment | Existing source references to retain / interpretation |
|---|---|---|
| `clearance_requests` | Template code and name; academic-period code and label; student's program ID, code and name as they were at assignment. | Keep existing `student_profile_id`, `template_id` and `academic_period_id`. The program snapshot preserves the program used by the assignment process even if the student's current profile later changes. |
| `clearance_requirement_records` | Requirement code and name; mandatory/optional setting; rejection-remark policy; applicable-program ID/code/name when restricted to one program; responsible office code and name. | Keep existing `template_requirement_id` and `office_id`; add a direct `requirement_definition_id` source reference. A null applicable-program snapshot means the template requirement applied to all programs. |
| `processing_history_events` | No new configuration snapshot fields. | Keep its existing actor, previous/new status, timestamp and remark. It remains separate and append-only. |

For the current model, `requirement_definitions` has code/name and an `office_id`; `template_requirements` has the mandatory flag, rejection-remark policy and optional `applicable_program_id`. There is no requirement description/instructions column in the current schema. Do not add a description field or snapshot absent text as part of TD-R09. If a description/instructions field is separately justified and approved later, its effective value must be snapshotted too.

Do not duplicate every student-profile field. Do not snapshot classification, department, section, subject, enrollment or other dimensions unless an approved applicability rule actually uses them. Do not add instructor snapshot columns until IR-003 establishes the responsibility source and required representation. Do not add assignment-actor history or a separate assignment-history table through this decision; the existing request/record creation timestamps identify assignment time.

### 4.6 TD-R09 acceptance tests

**Test setup constraint:** `clearance_requests` has a uniqueness constraint on `(student_profile_id, template_id, academic_period_id)`. Tests that verify changed configuration on a future assignment must use a distinct eligible assignment context, such as another student or academic period. They must not bypass the duplicate guard or create a second request for the same tuple. HIST-09 separately verifies that concurrent duplicate assignment remains prevented.

| ID | Scenario | Expected result |
|---|---|---|
| HIST-01 | Create a student requirement, then rename the reusable requirement definition. | Existing record continues to display the assigned code/name; a new assignment captures the changed code/name. |
| HIST-02 | Inspect the requirement description/instructions snapshot scope. | The current schema has no such field. No description/instructions field is invented or added by TD-R09; if one is separately approved later, its effective value must be snapshotted. |
| HIST-03 | Change a template requirement from mandatory to optional or vice versa. | Existing record retains its assigned setting; a new assignment captures the current setting. |
| HIST-04 | Change the rejection-remark policy for future assignments. | Existing record continues to enforce its assigned policy; a new record uses the current policy. |
| HIST-05 | Change the responsible office on a reusable requirement for future assignments. | Existing record retains the original office ID/code/name; a future assignment captures the new office context. Instructor responsibility is excluded until IR-003 is separately resolved. |
| HIST-06 | Deactivate/retire a template, requirement definition, program or office used by an old record. | Old records remain readable to authorized viewers using snapshots; inactive configuration is excluded from new assignments. Referenced source rows are not deleted. |
| HIST-07 | Read decision history after source configuration changes. | Actor, previous/new status, decision time and remark remain unchanged and available from append-only processing history. |
| HIST-08 | Attempt to change historical snapshot values through an ordinary application operation. | No normal application operation silently changes snapshots; no retroactive correction/reassignment operation is exposed by this decision. Any future correction capability requires separate approval and an auditable design. |
| HIST-09 | Generate two assignments concurrently for the same student/template/period. | The existing duplicate guard continues to ensure only one request and one set of requirement records. |
| HIST-10 | Change a template requirement to reference a different requirement definition after an existing record was assigned. | The existing record retains its original definition ID/code/name; a future assignment captures the new definition and its values. |
| HIST-11 | Rename a template or academic period after a request was assigned. | The existing request retains the assignment-time template and period code/name/label; a subsequent eligible request captures the current values. |
| HIST-12 | Change the student's program or a template requirement's applicable-program rule after assignment. | The existing request and requirement retain the assignment-time student-program and applicability context; future assignments use and capture the current values.

### 4.7 Established decision wording

> For the MVP, preserve the effective requirement configuration and office responsibility context associated with each student-specific clearance request and requirement record through assignment-time snapshots, while retaining stable references to their source configuration. Capture request-level template, academic-period and student-program context, and requirement-level definition/display, mandatory treatment, rejection-remark policy, applicable-program context and responsible-office identity/display. Later changes to reusable configuration must not silently rewrite existing snapshots. Historical reads use snapshot values; active configuration governs future assignments. Processing decision events remain separate and append-only. Do not introduce full configuration versioning, a separate assignment-history table, or a retroactive correction/reassignment feature through this decision. Instructor responsibility remains subject to IR-003.

The decision is established. Implementation, data backfill, query changes and HIST acceptance-test results remain separate work and must not be marked verified until evidence is recorded.

## 5. Role and permission matrix — P2 working draft

**Authority:** RP-001 to RP-006 and the existing provisional draft matrix in `docs/requirements/roles-permissions.md`.<br>
**Status:** Working interpretation for P2 review; cells marked conditional/open must not become permissions by assumption.

### 5.1 Baseline role catalog

Keep the six baseline role values. Whether every role exists at the actual institution remains RP-I01. Department roles remain conditional where the baseline says so. Do not substitute the proposal's five-role catalog or add Authorized Recorder as a settled seventh role.

| Baseline role | MVP treatment |
|---|---|
| Student | Required sample role; view only own clearance data and remarks. |
| Instructor / Faculty Member | Required MVP workflow; view and decide only assigned requirements. One or two demo instructors required by IR-004. |
| Administrative Office Personnel | Required MVP workflow; view and decide only requirements assigned to an office for which the account has an active assignment. |
| Department Personnel | Do not activate in the demo unless the owner/team has a justified sample use and the institutional condition is recorded. |
| Department Head | Do not activate in the demo unless the relevant department role and approval/supervision need are established. |
| System Administrator | Manage the fictional users, academic configuration, offices, definitions, templates and assignment setup needed for the MVP. Administrator status does not automatically confer approval authority. |

### 5.2 Capability matrix for review

Legend: **Yes** = baseline-supported MVP capability; **Conditional** = only when the cited condition is satisfied; **No by default** = not granted in the MVP without separate authority; **Open** = must not be assumed.

| Capability | Student | Instructor | Office Personnel | Dept. Personnel | Dept. Head | System Administrator |
|---|---|---|---|---|---|---|
| Sign in and view own account | Yes | Yes | Yes | Yes | Yes | Yes |
| View own assigned requirements/statuses/remarks/progress | Yes | No | No | No | No | No by default; monitoring only if approved |
| View assigned students/requirements | No | Yes, assigned only | Yes, assigned office only | Conditional | Conditional | Limited administrative/monitoring scope; define explicitly |
| Approve/reject assigned requirement with configured remark behavior | No | Yes, assigned only | Yes, assigned office only | Conditional on authorization | Conditional on institutional policy | No by default; separate approval authority must be established |
| Monitor own pending/completed tasks | No | Yes | Yes | Yes, if role exists and applies | Yes, if role exists and applies | No by default |
| Monitor department-level progress | No | No | No | Conditional | Conditional | Conditional/limited; avoid broad access without a need |
| Supervise department personnel | No | No | No | No | Conditional | No by default |
| Manage user accounts and role assignments | No | No | No | No | No | Yes |
| Manage academic reference data (programs/departments/academic periods/classifications) and offices | No | No | No | No | No | Yes |
| Manage requirement definitions/templates/applicability | No | Open per RP-I07; no default | Open per RP-I07; no default | Open per RP-I07; no default | Open per RP-I07; no default | Yes |
| Generate student requirement assignments | No | Open per RP-M15 | Open per RP-M15 | Open per RP-M15 | Open per RP-M15 | Yes |
| View broad system-wide audit/activity history | No | No | No | No | Open | Optional/Should only if approved and scoped |

### 5.3 Recommended permission implementation direction

TD-R07 recommends a fixed role set with per-role permissions and no custom permission editor, but remains RECOMMENDED/PROVISIONAL/UNDECIDED.

For the MVP, evaluate a small fixed permission catalogue and role-to-permission mapping, with the mapping maintained through controlled seed/migration changes rather than a general-purpose permission-editor screen. The backend should authorize named actions (for example `student.clearance.read-own`, `office.requirement.decide-assigned`, `instructor.requirement.decide-assigned`, `admin.template.manage`) and separately enforce record scope. A role name alone must never grant access to arbitrary records.

Before adding `permissions` and `role_permissions` tables, compare the cost against a centralized backend policy map. Whichever approach is chosen must satisfy RP-002, RP-004 and RP-006 without adding custom permission editing. Do not add direct per-user permission overrides for the MVP without a demonstrated requirement.

### 5.4 Multi-role policy

The existing schema supports multiple role-assignment rows for one user. RP-I03 remains UNKNOWN/UNDECIDED. For the classroom demo, use one role per demo account unless the owner obtains evidence and approves another arrangement. Do not infer that technical support means the college permits cross-role accounts.

## 6. Logical data model — minimum entities and responsibilities

This is a logical model, not final SQL. The historical snapshot fields follow established TD-R09; other entity attributes and relationships remain subject to TD-R07, CR-005/006, AS-009 and IR-003. Avoid adding full SIS entities unless needed by an approved clearance rule.

| Entity/concept | Purpose | Important relationships / notes |
|---|---|---|
| UserAccount | Login identity, display name, active state, password hash | Has one or more role assignments only if RP-I03 permits; session records belong to it. |
| RoleCatalog / RoleAssignment | Six baseline roles and account-role link | Current database uses a catalog and assignment table; active state must be checked on every protected operation. |
| Permission / RolePermission (or equivalent policy map) | Defines allowed operations per role | Exact physical design waits on TD-R07; no custom permission editor. |
| Institution / College context | One configured institution/college context for this single-college MVP | Represent the top-level academic context required by AS-001 without designing multi-tenancy. The official institution name/grouping remains unverified under AS-I01; use fictional public-safe labels. |
| StudentProfile | Student number, name, program, and a reference to a configurable student classification; year level or other academic attributes only as required by approved applicability | Classification values must be data, not hardcoded. The classification list and its institutional meaning remain unverified; do not infer that classification changes requirements unless SC-003 is approved for that use. |
| InstructorProfile or Instructor identity | Identifies sample instructors for assigned workflow | Physical entity may be separate profile or user-role identity; choose the simplest valid design. |
| AcademicYear | Configurable academic-year data managed by administrators | AS-001/AS-006. Naming and format remain subject to AS-I05. Keep distinct from a semester/term. |
| Semester/Term | Configurable semester/term data managed by administrators | AS-001/AS-006. Number, names and relationship to academic years remain subject to AS-I05. |
| AcademicPeriod | Association between an academic year and semester/term, if needed by clearance configuration | A convenience association must not replace the distinct academic-year and semester/term entities. |
| Program | Configurable academic program data used by student profiles and approved applicability | Administrators manage programs under AS-005. Actual program names remain unverified under AS-I03. Keep program distinct from department and subject. |
| Department | Configurable department data for academic structure and administration | Administrators manage departments under AS-005. Actual names and relationships to programs remain unverified under AS-I02. Department-role workflows remain conditional. |
| StudentClassification | Configurable classification values that student profiles may reference; administrators can add, rename and disable values | SC-001/SC-002 require managing classifications as data and supporting at least Regular/Irregular as configured values. Actual institutional values/criteria remain unverified; whether classification affects applicability is conditional under SC-003. |
| Subject / Section / Enrollment (conditional) | Academic records used only if a confirmed applicability or instructor-assignment rule requires them | Subject/section setup is conditional under AS-007; storing actual enrollment is undecided under AS-009. Do not build or import these as a full SIS without evidence. |
| YearLevel (conditional use) | Configurable year-level values if a confirmed applicability rule or required student record uses them | Do not hardcode year-level labels. Include only as far as the MVP applicability/record model needs them under AS-004, AS-007 and AS-008. |
| Office | Administrative unit that owns requirements | Referenced by requirement configuration and responsibility records. |
| OfficeAssignment | Links office personnel to office scope | Historical validity must satisfy RH-003; current boolean-active model is not the complete history solution. |
| RequirementDefinition | Reusable requirement identity, code and name | The current schema has no description/instructions field. Any such field must be separately justified and approved; its effective value must then be preserved under TD-R09. |
| ClearanceTemplate | Reusable requirement set for an academic period/target group | Kept distinct from student records under CR-002. |
| TemplateRequirement | Inclusion of a definition in a template, mandatory flag, simple applicability and rejection-remark policy | Current schema already has core fields. The current office source is `requirement_definitions.office_id` and its effective office is snapshotted on the requirement record under TD-R09. Instructor responsibility remains conditional under CR-003/CR-I02 and IR-003; do not add it by assumption. |
| ResponsibilityAssignment | Identifies the responsible office or instructor for an assigned requirement; other authorized parties only if separately approved | The exact instructor assignment source is conditional under IR-003. For the fictional demo, use a simple explicit and replaceable assignment. Do not assume multiple signatories or a universal one-to-one rule until CR-I02 and the selected IR-003 approach justify the cardinality. |
| ClearanceRequest | Student-specific request/assignment for a template and period | Existing duplicate guard uses student/template/period uniqueness. |
| ClearanceRequirementRecord | One student-specific requirement instance and its status | Carries the requirement-level snapshot values and stable source references defined by established TD-R09. |
| ProcessingHistoryEvent | Append-only decision history: actor, prior/new state, timestamp and remark | Distinct from configuration snapshot and security audit. |
| AppSession | Opaque server-managed session digest, user, expiry and creation time | Current implementation; approach owner-established for the academic MVP. Functional verification remains tracked in §3.4. |
| AuditEvent (if needed by MVP scope) | Security/admin events distinct from processing decisions | Define the event set and redaction; do not duplicate the processing history without a purpose. |

### 6.1 Important relationship rules

- One student may have clearance requests for relevant templates/academic periods; one request belongs to one student and one template/period context.
- One template contains multiple template requirements; a reusable definition may appear in multiple templates if the approved model permits it.
- One clearance request generates student-specific requirement records for the applicable template requirements.
- Each requirement record must resolve to the responsible party or parties justified by the approved requirement and assignment model. For the initial fictional demo, use one explicit responsible office or instructor where the scenario requires it. Do not hardcode universal one-to-one cardinality or multiple-party support until CR-I02 and the selected IR-003 approach justify it. Do not require enrollment, subject or section integration without evidence.
- One requirement record may have multiple append-only processing-history events only if the approved workflow later allows repeated decisions. In the current first-slice workflow, Pending can transition to Approved or Rejected and those states are terminal; reopening/revocation remains deferred.
- Completion is derived by the backend from applicable mandatory requirement records under DA-11 for the fictional demo. Do not store a manually editable overall `CLEARED` value or implement finalization.

## 7. API contract outline — proposed boundaries, not final endpoint approval

The current API already has authentication, office review and student retrieval paths. Extend the contract by adding only operations needed for P3/P4. Exact route naming and response envelopes must be agreed by the implementation team before client integration.

### 7.1 Shared rules

- REST/JSON remains established under TD-005.
- Backend owns validation, authorization, assignment, decisions, applicability and completion.
- A client never supplies an arbitrary status; it submits an allowed action (`Approved` or `Rejected`) and optional remark.
- Every protected operation checks authentication, required role/action authorization and record-level scope. The physical role-to-permission implementation remains subject to TD-R07.
- Student data endpoints return only data linked to the authenticated student profile.
- Use consistent response bodies and error codes across web and Android.
- Use pagination only where expected result volume justifies it; a small demo may use a bounded result set. If pagination is added, define maximum page size and stable ordering.

### 7.2 Candidate operation groups

| Group | Candidate operations | Authorization and scope |
|---|---|---|
| Authentication | Existing `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/me` | Session must be valid; protected routes require active account. |
| Admin accounts/roles | List/create/update/disable fictional accounts; assign allowed baseline roles | System Administrator role with explicit backend authorization for this management action; the role-to-permission implementation remains subject to TD-R07; no automatic approval authority. |
| Admin academic data | Manage academic-year/semester periods, programs/departments and student-classification values (add, rename, disable); manage other student academic attributes where required | System Administrator role with explicit backend authorization for this management action; the role-to-permission implementation remains subject to TD-R07. Keep the actual period structure subject to AS-I05. Student classifications are managed as data (at least Regular/Irregular as configurable sample values); their effect on applicability remains conditional. Year level, subjects, sections and enrollment are included only to the extent justified by approved requirements/conditions. |
| Admin offices | List/create/update/deactivate offices; assign office personnel | System Administrator role with explicit backend authorization for this management action; the role-to-permission implementation remains subject to TD-R07; preserve historical responsibility context. |
| Admin requirements | Create/update/retire requirement definitions | System Administrator role with explicit backend authorization for this management action; the role-to-permission implementation remains subject to TD-R07; TD-R09 immutability/version behavior applies. |
| Admin templates | Create/update/retire templates; attach requirements; set mandatory flag, simple applicability and remark policy | System Administrator role with explicit backend authorization for this management action; the role-to-permission implementation remains subject to TD-R07; only approved applicability dimensions. |
| Admin assignment | Generate/reuse student clearance requests and requirement records for selected fictional students | System Administrator role with explicit backend authorization for this management action; the role-to-permission implementation remains subject to TD-R07; backend evaluates applicability and guards duplicates/concurrent assignment. |
| Office processing | Existing staff review list/detail/decision operations | Administrative Office Personnel plus active assignment to the responsible office. |
| Instructor processing | Instructor review list/detail/decision operations | Instructor role plus an explicit current responsibility assignment to the requirement record. No access to unassigned records. |
| Student view | Existing student clearance request list/detail | Student role and ownership through authenticated StudentProfile. |

### 7.3 Candidate instructor operations

The instructor route may be separate from office routes to preserve distinct responsibility paths, as the execution plan requests. Candidate shape:

- `GET /api/instructor/review-items?status=Pending`
- `GET /api/instructor/review-items/{recordId}`
- `POST /api/instructor/review-items/{recordId}/decision`

The decision service and validation should be shared with office processing where practical; the authorization scope check must differ. An instructor can process only a record assigned to that instructor. Do not allow every Instructor role holder to process every academic requirement.

### 7.4 Response behavior

Use the first-slice contract as the starting point:

| Condition | Expected code |
|---|---:|
| Successful read/update/decision | 200 |
| New resource created | 201 |
| Invalid identifier/body shape | 400 |
| Missing/invalid authentication | 401 |
| Wrong role or missing assignment/scope | 403, unless a deliberate non-disclosure policy requires 404 |
| Missing resource or protected ownership mismatch | 404 where policy says not to disclose existence |
| Already-processed record or competing decision loser | 409 |
| Business validation failure, such as required remark missing/blank | 422 |
| Unexpected server failure | 500 |

The office pilot currently uses a different 403/404 policy for some reviewer detail and decision paths. Preserve the documented policy decision and review existence disclosure before generalizing it to instructor routes. Student ownership mismatch should continue to be indistinguishable from a nonexistent request.

### 7.5 Minimum request/response fields

For a staff decision:

- Request: `decision` (`Approved` or `Rejected`) and optional `remark`.
- Backend loads current record, responsible party, requirement snapshot/settings and active user scope; it does not trust a client-submitted office/instructor ID or mandatory flag.
- Response: record ID, previous status, new status and any safe display confirmation; never return password/session material.
- History event: requirement record ID, actual actor, previous/new status, time and remark.

For admin assignment:

- Request identifies selected template/period and student IDs or a controlled selection.
- Backend validates the template, active applicable definitions and each student's allowed academic attributes. The first-slice technical contract draft also specifies at least one applicable mandatory requirement per assigned demo student; retain that as a draft demo/configuration-validity guard only if accepted for the slice, not as an institutional policy claim.
- Backend creates or reuses unique request records and only the applicable student requirement instances.
- Response reports per-student created/reused/invalid result without leaking unrelated student data.

## 8. Migration and seed-data approach

**Migration tool choice remains subject to TD-R11.** Do not introduce an ORM or migration framework merely because one is common.

Recommended approach for review:

1. Use versioned, ordered, forward-only schema migrations once a migration mechanism is selected.
2. Keep schema changes and fictional reference/demo seed data conceptually separate.
3. Make repeatable seed operations deterministic and safe to re-run where possible.
4. Do not use seed scripts as the only way to change live historical configuration after real student records exist.
5. Use only fictional/sample records in public and test environments.
6. Keep development and test databases separate; every destructive test/reset operation must verify its target.
7. Add migrations for TD-R09 fields only after the historical field list and read behavior are accepted.
8. Do not combine this work with a broad schema redesign copied from the 62-page proposal.

## 9. P2 acceptance and exit checklist

P2 is complete only when the following artifacts are reviewed and either accepted or explicitly blocked/deferred:

| P2 output | Minimum completion evidence |
|---|---|
| TD-R01 decision | Owner-selected session approach recorded; session behavior and focused functional verification checks documented, with test status tracked separately. |
| TD-R09 decision | Owner-established assignment-time snapshot approach; request/requirement field groups; source-reference, retirement and no-retroactive-correction rules; HIST acceptance tests and implementation verification status. |
| Role/permission matrix | Six baseline role values, approved/conditional/open cells, admin non-approval principle, instructor and office scope, multi-role policy left open unless resolved. |
| Logical data model | Entities, relationships, responsibility model, institution/college context, student-classification catalog/profile reference, academic-year/semester representation, historical context and persisted-versus-derived status rules. |
| Academic reference data | Student-classification values are modeled as configurable data (not hardcoded), with the actual institutional list/criteria and effect on applicability kept open. Academic year/semester management is represented without inventing AS-I05 policy. |
| API contract | Routes/operations, request/response shapes, status codes, authorization scope, validation, ownership and pagination decision. |
| Migration/seed approach | Selected or explicitly deferred TD-R11 tooling; safe fictional seed/reset strategy. |
| Team alignment | Backend, web and Android contributors understand the same shared contract and unresolved items. |

Do not keep P2 open indefinitely. The approved plan time-boxes P2 to up to two working days. If TD-R09 cannot be resolved within that timebox, record the specific blocker and defer only the dependent history/schema work. Continue independent work such as mock screens or non-schema setup, and proceed with the narrow end-to-end MVP path. TD-R01 is already established; its AUTH checks are implementation verification and must not block the selected authentication approach.

## 10. Explicit non-goals for this P2 package

This package does not authorize:

- final sign-off, final requests, finalization, persisted overall `CLEARED`, certificates or certificate verification;
- reopening, revocation, replacement, return or cancellation;
- required enrollment/SIS integration, subjects/sections or imported class-offering records;
- delegation, Auto-Clear, physical approval recording or an Authorized Recorder role;
- batch approval, external notifications, uploads or integrations;
- custom permission editor or direct per-user permission overrides;
- an unrestricted general applicability/rule engine;
- production security claims or institutional-policy claims.

These ideas remain in the separate proposal reconciliation/future reference and require their own source, policy, technical and scope gates.

## 11. Owner/team decisions still required

1. Review the implementation mapping and migration/backfill plan for the established TD-R09 snapshot model before applying schema changes; no further choice among snapshot/versioning mechanisms is pending.
2. Review whether to accept TD-R07's fixed per-role permission mapping for the MVP. If not decided within P2, keep it RECOMMENDED/PROVISIONAL/UNDECIDED and specify only the minimum backend authorization needed for the next slice; do not mark it established by this package.
3. Agree on the simplest replaceable instructor assignment for the fictional MVP while IR-003 remains conditional.
4. Decide the minimum academic data dimensions needed for the current demo without violating AS-010.
5. Select/defer any TD-R11 tools needed for migrations, input validation, tests and client networking.

The remaining items above are not established by this document. TD-R01 is recorded separately as owner-established in `docs/decisions.md`.

---

## 12. References

Project files to review alongside this package:

- `docs/decisions.md` — established technical decisions, including TD-R01, and remaining open/recommended decisions.
- `docs/requirements/roles-permissions.md` — RP-001–RP-006 and RP-I01–RP-I07.
- `docs/requirements/instructor-responsibilities.md` — IR-001–IR-004 and IR-I01–IR-I05.
- `docs/requirements/clearance-requirements.md` — CR-001–CR-010 and CR-I01–CR-I06.
- `docs/requirements/academic-structure.md` — AS-001–AS-010 and institutional unknowns.
- `docs/requirements/records-and-history.md` — RH-001–RH-009.
- `docs/implementation/First-Slice_Technical_Contract_Draft_0.3.md` — first-slice API, authorization, state transitions and test inventory.
- `docs/implementation/FIRST_SLICE_IMPLEMENTATION_PILOT.md` — current implementation evidence and limitations.
- `docs/implementation/BUILD_AND_TEST_STATUS_2026-11-09.md` — owner-run authentication/session verification results and outstanding checks.
- `docs/planning/CDCMS_MVP_Scope_Decision_and_Team_Execution_Plan_v0.3.md` — P2 exit criteria and P3/P4 work.
- `docs/mvp/CDCMS_MVP_Requirements_Specification_v0.3.md` — approved MVP scope and acceptance criteria.
- `docs/mvp/CDCMS_MVP_Traceability_Crosswalk_and_Issue_Register_v0.3.md` — baseline/MVP traceability and open issue register.

**End of document.**

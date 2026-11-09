# CDCMS P2 Technical Design and Decision Package

**Document ID:** CDCMS-P2-DESIGN-001<br>
**Version:** 0.2<br>
**Prepared:** 2026-11-09<br>
**Status:** Working technical design reference; TD-R01 is owner-established for the academic MVP; remaining P2 items retain their recorded open or provisional status.<br>
**Scope:** P2 data model, permissions, authentication, API contract and history design

> **Authority notice:** This document is a technical planning aid. It does not amend Requirements Baseline 0.1 or replace the owner-approved MVP Specification v0.3. TD-R01 is established separately by the project owner and recorded in `docs/decisions.md`. This document does not establish TD-R07, TD-R09, or any other remaining open or provisional decision. The implementation team retains ownership of production code.

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

**Current decision-register status:** OPEN / UNKNOWN / UNDECIDED.<br>
**Required behavior:** RH-001 to RH-003 are CONFIRMED/REQUIRED; RH-004 to RH-007 retain their recorded provisional qualifications.<br>
**Recommended direction:** A limited hybrid of immutable/versioned configuration and assignment-time snapshots of resolved values.<br>
**Owner approval:** Not yet recorded.

### 4.1 Required behavior, independent of the technical method

A historical clearance record must remain understandable after later changes to templates, academic configuration or approval assignments. At a minimum, an authorized viewer must be able to establish:

- which requirement applied to the student at the time of assignment;
- the relevant requirement code, name and description/instructions;
- whether it was mandatory or optional;
- the applicable program/academic context used at assignment;
- which office or instructor was responsible at the relevant time; other authorized parties only where CR-004 and the applicable institutional decision permit them;
- the actual decision, actor, timestamp and remark;
- the source template/configuration identity or version, where retained.

Changing a current reusable definition must not silently change the meaning of an already-created student record. Keep processing history and configuration history separate but linkable.

### 4.2 Current implementation gap

The current schema stores references from clearance requests and requirement records to template and template-requirement configuration rows. It also stores `office_id` on the requirement record and writes decision history separately.

This preserves useful identifiers and processing events, but the record does not contain a complete copy of the effective requirement text, mandatory setting, rejection-remark rule, resolved applicability context and responsibility label. Existing queries join to current configuration and currently filter some linked configuration rows by active status. A later edit/deactivation could therefore change or hide how an old record is rendered.

This is a design gap to close before admin editing is implemented. It is not a claim that the current seeded first slice is unusable.

### 4.3 Options

| Option | Method | Strength | Cost/risk |
|---|---|---|---|
| A. Assignment-time snapshots only | Copy effective requirement/configuration/responsibility fields onto each generated student requirement record. | Easy to understand; historical display does not depend on live mutable definitions. | Repeats values; must choose exactly which fields are copied and keep source references for traceability. |
| B. Immutable versioned configuration | Never edit a configuration version after use. Create a new version/row for future assignments; existing records reference the old version. | Strong provenance and less per-record duplication. | Requires version lifecycle, immutable-row rules, and old-version read support across every relevant query. |
| C. Hybrid (recommended candidate) | Retain source IDs/version references, freeze or version used configuration, and snapshot the resolved student-specific values and responsible party on assignment. | Balances traceability, historical readability and implementation simplicity. | Requires a deliberate field list and careful migration/read-query changes. |
| D. Freeze existing configuration without versioning | Disallow editing any configuration once used; administrators must create new definitions/templates for any change. | Lowest initial schema complexity. | Becomes awkward without an explicit version/family convention; accidental edits through SQL remain possible unless guarded. |

### 4.4 Recommendation

Evaluate Option C as the leading candidate, but approve it only after a field-level logical model and acceptance tests confirm it is the smallest design that satisfies RH-001 to RH-007.

The candidate design should:

1. Keep stable source references to the template, template-requirement and requirement definition.
2. Capture the effective requirement code/name/description or instructions when a student-specific requirement is generated.
3. Capture mandatory status and the rejection-remark setting applicable to that generated record.
4. Capture the resolved applicability context needed to explain why the requirement was assigned (for the current MVP, this should remain limited to approved simple dimensions such as program).
5. Capture the responsible party for the record: office or instructor, with stable identifier and the display name/label as it applied at assignment.
6. Record assignment time and source configuration/version identifiers.
7. Retire or deactivate old configuration for future assignment without making historical student records disappear from history views.
8. Keep existing decision history append-only.
9. If a correction to an existing assignment is ever supported, represent it as an explicit, authorized and logged correction/reassignment rather than silently overwriting the old context. RH-004's permission for retroactive changes remains undecided.

**Instructor scope boundary:** Instructor processing itself is required by IR-001, IR-002 and IR-004. Only the assignment source/method under IR-003 remains conditional. The MVP may use a simple, explicit, replaceable instructor assignment for fictional demo records; it must not require subject/section/enrollment integration without institutional evidence.

**Do not mandate a dedicated assignment-history table at this stage.** A snapshot, immutable assignment version, event table or combination may meet the requirement. Choose the smallest mechanism that preserves the required observable history.

### 4.5 Candidate snapshot field groups

These are logical field groups, not approved SQL columns or final schema names.

| Group | Candidate values to preserve | Reason |
|---|---|---|
| Source identity | Template ID/version; template-requirement ID/version; requirement-definition ID/version | Trace back to the configuration that generated the record. |
| Display meaning | Requirement code, name, description/instructions | Preserve what the student was asked to satisfy. |
| Completion treatment | Mandatory flag; applicable rejection-remark policy | Preserve the rules applied to this record. |
| Applicability context | Student program and any other approved applicability values used at assignment; classification only if the selected rule actually uses it | Explain why this requirement applied. Classification is configurable data, but its effect on applicability remains conditional under SC-003. Do not add unapproved dimensions. |
| Responsibility | Responsible party type or types, stable office/instructor identifier(s), and display snapshot(s) | Preserve who was responsible at the relevant time. Other authorized parties require the applicable baseline condition/decision; the physical representation depends on CR-I02 and IR-003. |
| Assignment metadata | Assigned/created timestamp; actor or system source if relevant | Establish when and how the record was generated. |
| Decision history | Previous/new status, actor, timestamp, remark | Already represented in processing history; keep this separate from configuration snapshot. |

Do not duplicate every student profile field into each requirement record. Snapshot only the values needed to preserve the meaning and responsibility of that requirement, and explain any broader record-level context separately.

### 4.6 TD-R09 acceptance tests

| ID | Scenario | Expected result |
|---|---|---|
| HIST-01 | Create a student requirement, then rename the reusable requirement. | Existing record still displays the original assigned name; a new assignment uses the new name/version. |
| HIST-02 | Change a requirement description/instructions. | Existing record retains the old effective text; new assignments use the updated version. |
| HIST-03 | Change mandatory to optional or vice versa. | Existing record retains its assigned setting; new records use the new setting. |
| HIST-04 | Change rejection-remark policy. | Existing record uses the policy assigned to it; new records use the new policy. |
| HIST-05 | Change the responsible office/instructor for future assignments. | Existing record preserves its historical responsible party; future assignments use the new responsibility. |
| HIST-06 | Retire old template/definition/office/instructor assignment. | Old records remain readable to currently authorized viewers; retired data is excluded from new assignment. |
| HIST-07 | Read decision history after configuration change. | Actor, old/new status, decision time and remark remain unchanged and available. |
| HIST-08 | Attempt a silent retroactive edit to an existing record. | Rejected or routed through an explicitly approved, logged correction mechanism; no silent history rewrite. |
| HIST-09 | Generate two assignments concurrently for the same student/template/period. | Existing duplicate guard continues to ensure only one request/one set of requirement records. |

### 4.7 Proposed decision-record wording

> The MVP must preserve the effective requirement configuration and responsibility context associated with each student-specific clearance requirement at the time of assignment. Later changes to reusable definitions, templates, academic configuration or responsibility assignments must not silently rewrite existing clearance records. Historical decision events remain append-only and linkable to the requirement record. The technical design may use assignment-time snapshots, immutable/versioned configuration or a justified combination, selected after field-level modeling and acceptance-test review. Referenced configuration is retired rather than deleted while required for historical interpretation. Any intentional retroactive correction requires a separately approved and logged process; it is not enabled by default.

**Do not copy this wording into `docs/decisions.md` as ESTABLISHED until the owner/team approves the mechanism and field list.**

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

This is a logical model, not final SQL. Entity attributes and relationships are subject to TD-R09, TD-R07, CR-005/006, AS-009 and IR-003. Avoid adding full SIS entities unless needed by an approved clearance rule.

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
| RequirementDefinition | Reusable requirement identity, code, name, description | Must not be destructively edited in a way that rewrites old records. |
| ClearanceTemplate | Reusable requirement set for an academic period/target group | Kept distinct from student records under CR-002. |
| TemplateRequirement | Inclusion of a definition in a template, mandatory flag, simple applicability and rejection-remark policy | Current schema already has core fields. The ownership location for responsible office/instructor remains a design decision under CR-003/CR-I02, IR-003 and TD-R09; do not assume it belongs here. |
| ResponsibilityAssignment | Identifies the responsible office or instructor for an assigned requirement; other authorized parties only if separately approved | The exact instructor assignment source is conditional under IR-003. For the fictional demo, use a simple explicit and replaceable assignment. Do not assume multiple signatories or a universal one-to-one rule until CR-I02 and the selected IR-003 approach justify the cardinality. |
| ClearanceRequest | Student-specific request/assignment for a template and period | Existing duplicate guard uses student/template/period uniqueness. |
| ClearanceRequirementRecord | One student-specific requirement instance and its status | Should carry or reference the resolved historical configuration/responsibility context selected under TD-R09. |
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
| TD-R09 decision | Required observable history, chosen mechanism, field list, retirement/correction behavior, HIST acceptance tests and recorded decision status. |
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

1. Accept, revise or reject the TD-R09 hybrid candidate after reviewing the actual field-level logical model and HIST tests.
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

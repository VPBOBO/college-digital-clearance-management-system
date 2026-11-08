# CDCMS First-Slice Technical Contract

**Version:** Draft 0.3  
**Prepared:** 2026-11-07  
**Status:** Working technical draft; not separately approved  
**Authority:** Requirements Baseline 0.1 as applied through CHG-001 and CHG-002; MVP Specification v0.3; Traceability Crosswalk v0.3; Execution Plan v0.3.

> This contract is an implementation aid. It does not amend the baseline, approve unresolved baseline questions, or authorize public release. The MVP documents have been adopted by the project owner as the working MVP foundation. The first-slice contract remains a draft, and the review clarifications in `../reviews/First-Slice_Contract_Review_Clarifications.md` remain pending owner disposition.

## 1. Purpose and boundary

The first slice is a small, integrated office-clearance workflow using fictional data. It proves that the backend can assign applicable requirements, enforce reviewer authorization, record an office decision and history, derive completion, and provide the student's own status to Android.

This is narrower than the full MVP:

- The first slice uses seeded academic and clearance configuration; it does not demonstrate administrator configuration screens or endpoints. It therefore does not satisfy MAC-004.
- The first slice exercises office review only; it does not implement instructor review. It therefore does not satisfy full MAC-006.
- Instructor processing, full admin configuration, final sign-off, reopening, revocation, cancellation, actual institutional rules, and real SIS integration are deferred.

Use `Sample College` and fictional identities in examples. Do not include real institutional identity, logo, policy, or records in public-facing files until TD-R17 and TD-020 are resolved.

## 2. First-slice fixtures

Seed prerequisite records for:

- One fictional academic period.
- Two programs: Program A and Program B.
- Two offices: Office A and Office B.
- Student A in Program A and Student B in Program B, each with a student account.
- Office Staff A assigned to Office A and Office Staff B assigned to Office B.
- One system administrator account.
- Requirement A, mandatory, handled by Office A, applicable to Program A, with `remarkRequiredOnReject = REQUIRED`.
- Requirement B, mandatory, handled by Office B, applicable to Program B, with `remarkRequiredOnReject = OPTIONAL`.
- One template containing both requirements.

Expected assignment: Student A receives Requirement A only; Student B receives Requirement B only. Office Staff A can process Office A items, not Office B items, and vice versa.

Seed accounts must use fictional local-only passwords. Generate Argon2id hashes at seed time. Never commit real/reused credentials, locally generated secrets, or reusable demo password hashes. Keep local secret files out of Git.

## 3. Minimum logical data model

This is a logical model, not the final PostgreSQL schema. Physical schema and history preservation remain subject to TD-R09 and TD-R11.

### Identity and authorization

- `RoleCatalog`: preserve the six baseline role values (Student, Instructor/Faculty Member, Administrative Office Personnel, Department Personnel, Department Head, System Administrator).
- `UserAccount`: identifier, login identifier, password hash, active status.
- `UserRoleAssignment`: user, role, active status. One role per demo account is a fixture choice only; RP-I03 remains open.
- `Office`: identifier, name, active status.
- `OfficeStaffAssignment`: identifier, user, office, active status.

A reviewer must have both an active Administrative Office Personnel role assignment and an active assignment to the office responsible for the requirement.

### Student, academic and clearance data

- `StudentProfile`: account link, fictional student number, display name, program link.
- `Program` and `AcademicPeriod`.
- `RequirementDefinition`: name/description, responsible office, active status.
- `ClearanceTemplate` and `TemplateRequirement`: template link, requirement link, `isMandatory`, `remarkRequiredOnReject`, and applicability configuration.
- `ClearanceRequest`: student, academic period, template.
- `ClearanceRequirementRecord`: request, template-requirement reference, responsible office, individual status.
- `ProcessingHistoryEvent`: requirement-record reference, actor, previous status, new status, remark, event time.

Enforce uniqueness of `(student profile, template, academic period)` for a clearance request. Assignment should be idempotent: repeating the same assignment identifies/reuses the existing request instead of duplicating it. Protect against concurrent duplicate creation at the database level.

`remarkRequiredOnReject` belongs to `TemplateRequirement`. `REQUIRED` blocks a rejection without a non-empty remark; `OPTIONAL` and `UNSPECIFIED` permit a remark or no remark in the demo. AW-007 remains open as an institutional question.

TD-R09 remains open: do not claim that a particular snapshot/versioning technique has been selected for preserving historical configuration.

## 4. Seed process and assignment behavior

The first slice does not require application endpoints for creating users, students, staff assignments, academic periods, offices, requirements, or templates. The development seed process creates these prerequisite records.

The seed process must then call the same backend assignment use case/service intended for a future administrator-facing endpoint. It must not directly insert final `ClearanceRequest` and `ClearanceRequirementRecord` rows to bypass applicability logic.

The backend assignment service:

1. Loads the selected student, template, and academic period.
2. Validates that the template has at least one applicable mandatory requirement for each assigned student.
3. Evaluates applicability using the configured program conditions.
4. Creates or reuses the unique clearance request.
5. Creates only the requirement records applicable to that student.
6. Protects against duplicate records and concurrent duplicate assignment.

A zero-applicable-mandatory-requirement configuration is invalid. The assignment operation must reject it. A separate completion-calculator unit test must defensively return `isComplete: false` and `configurationValid: false` for a zero-mandatory input.

## 5. Proposed API boundary

The following paths are proposals for the first slice, not permanent API decisions.

Authentication (after TD-R01 is resolved):

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`

Office reviewer:

- `GET /api/staff/review-items`
- `GET /api/staff/review-items/{recordId}` — retrieve one review item only when it belongs to an active office assignment of the authenticated reviewer. In the current pilot, another-office and nonexistent items both return 404 from this detail route.
- `POST /api/staff/review-items/{recordId}/decision` — in the current pilot, an existing item assigned to another office returns 403 while a nonexistent item returns 404; this existence-disclosure difference remains a policy decision to review.

Student:

- `GET /api/student/clearance-requests`
- `GET /api/student/clearance-requests/{requestId}`

The decision body accepts only `Approved` or `Rejected`, plus an optional remark. Clients cannot submit arbitrary status values. The backend owns validation and state transitions.

## 6. Authorization and response rules

Before a staff decision, the backend verifies authentication, active role assignment, active office assignment for the record's responsible office, record existence, and current Pending status.

Students can retrieve only requests linked to their authenticated StudentProfile. A student's own-record mismatch and nonexistent request both return 404 with identical response bodies.

Proposed response codes:

| Condition | Code |
|---|---:|
| Successful read or decision | 200 |
| New request creation (when endpoint exists) | 201 |
| Invalid request structure | 400 |
| Missing/invalid authentication | 401 |
| Authenticated wrong role or inactive/missing office assignment | 403 |
| Missing record; student requests another student's record | 404 |
| Already-processed decision or competing decision loser | 409 |
| Business validation failure, including required remark missing/blank | 422 |
| Unexpected server failure | 500 |

The current proposed policy allows a staff member to distinguish an existing record outside their office (403) from a nonexistent record (404). This existence-disclosure trade-off must be explicitly accepted for the demo; it is not a universal security recommendation. Student responses must not disclose record existence.

A whitespace-only remark is empty after trimming. Check record state before remark validation: a decision against a record already Approved or Rejected returns 409 even if the new request also omits a required remark.

## 7. Review list behavior

The default staff review list returns Pending records only. A `status` filter is proposed to allow `Pending`, `Approved`, `Rejected`, and `All`, always constrained to the authenticated reviewer's active office assignment. Processed records remain available for history and conflict tests. The exact query parameter and response envelope remain to be finalized in the API contract.

## 8. Allowed state transitions

| Current state | Requested decision | Outcome |
|---|---|---|
| Pending | Approved | Approved |
| Pending | Rejected | Rejected |
| Approved | Any further decision | 409 Conflict |
| Rejected | Any further decision | 409 Conflict |

Approved and Rejected are terminal in the first slice. Reopening, revocation, and cancellation are deferred.

## 9. Decision/history transaction and concurrency

The backend must update a requirement record and create its corresponding history event in one database transaction. A failure in either operation rolls back both.

Each history event records at least:

- `previousStatus` (Pending for the first decision).
- `newStatus` (Approved or Rejected).
- Acting reviewer identifier.
- Event timestamp.
- Optional remark.

Two competing decision requests for the same Pending record must be run concurrently, not sequentially. Exactly one succeeds; the other returns 409. Only one successful decision event is committed.

Fault-injection tests must run only against a dedicated test database. Force history insertion to fail after the status update is attempted, and separately force the status update to fail. Verify that neither case leaves inconsistent state/history. Do not expose a production fault-injection endpoint.

## 10. Completion calculation

For the fictional demo only:

- Applicable mandatory requirement is satisfied only when Approved.
- Pending and Rejected are not satisfied.
- Optional requirements do not affect completion.
- Calculate completion when clearance data is read; do not store an independently editable overall completion status.
- With zero applicable mandatory requirements, completion is false and configuration is invalid.

Possible UI labels such as In Progress, Needs Attention, and Requirements Complete are derived display labels. They are not baseline status values and do not imply a final `Cleared` state. DA-11 is a demo-only condition; actual completion rules remain open under CR-I05/AW-I06.

## 11. First-slice test inventory

Tests use an isolated test database and resettable fictional fixtures. The reset script must check that it is connected to the dedicated test database before deleting/rebuilding data.

| ID | Test focus | Expected result | MAC trace |
|---|---|---|---|
| FS-01 | Login, Argon2id hash/verify | Correct login succeeds; wrong password fails; hash is not exposed | MAC-002, MAC-003 |
| FS-02 | Backend assignment for both students | A gets only A; B gets only B; backend applicability function is exercised | MAC-005, MAC-007 |
| FS-03 | Office A review list | Only Office A's authorized records | MAC-002, MAC-006, MAC-010 |
| FS-04 | Retrieve a Pending item | Authorized reviewer sees relevant item details | MAC-006, MAC-010 |
| FS-05 | Required/optional rejection remarks | A with REQUIRED rejects missing/blank remark; B with OPTIONAL permits no remark | MAC-006, MAC-010 |
| FS-06 | Wrong-office and student decision attempts | Denied; no state/history change | MAC-002, MAC-006, MAC-010 |
| FS-07 | Valid decision and history | One transaction; actor/time/previous/new status/remark correct | MAC-006, MAC-007, MAC-011 supporting |
| FS-08 | Student A requests Student B's record | 404, same body as nonexistent request | MAC-002, MAC-005, MAC-010 |
| FS-09 | Completion before/after approval | Correct derived value; not stored as editable state | MAC-007, MAC-009 |
| FS-10 | Zero mandatory requirements | Completion-calculator unit test returns false/invalid | MAC-009 |
| FS-11 | Second decision on processed record | 409; no extra decision event; state check occurs before remark validation | MAC-006, MAC-007, MAC-010 |
| FS-12 | Android student view | Student sees own status/progress | MAC-005, MAC-008, MAC-009 |
| FS-13 | Competing decision requests | Both requests fire in parallel; exactly one 200 and one 409; one decision event | MAC-006, MAC-007, MAC-010 |
| FS-14 | Missing authentication | Protected endpoint returns 401 | MAC-002, MAC-010 |
| FS-15 | Transaction fault injection | Failure in either status update or history insertion leaves no partial result | MAC-007, MAC-011 supporting |
| FS-16 | Duplicate assignment | Two parallel calls yield one created request and one reused request; no duplicate records | MAC-007; supporting safeguard |
| FS-17 | Inactive office assignment | Deactivated OfficeStaffAssignment receives 403 and cannot change state/history | MAC-002, MAC-006, MAC-010 |

For FS-01, inspect the stored hash only inside the test: require the `$argon2id$` prefix and confirm encoded cost parameters meet the selected security configuration. Do not print or include hashes in test output. The OWASP minimum reference documented by the stack checklist is 19 MiB memory, 2 iterations, parallelism 1; final parameters still require benchmarking and an owner decision.

FS-16 uses `201 Created` for a new request and `200 OK` when the existing request is reused. Run both assignment calls concurrently to test uniqueness protection under contention.

Use test result terms distinctly: Planned, Run, Passed, Failed, Blocked. A test is not Passed until actual output/evidence matches its expected result.

## 12. Implementation decision gates

### Before implementation-dependent setup

- Complete the relevant Ubuntu/Windows M3 checks for the developer machine/workstream.
- Record a repository arrangement: either resolve TD-R15 or explicitly remain local-only until ownership is decided.
- Keep public release separately blocked until TD-R17 and TD-020 are satisfied.

TD-011 means evaluating both compatibility **and suitability** of the established stack before implementation starts. It is broader than M3 installation checks and includes hardware and project-fit considerations. M3 supplies important evidence but does not, by itself, close TD-011.

### Before database and backend implementation

Resolve or explicitly defer the TD-R11 choices needed for the first slice, especially:

- Database migration approach.
- Query layer or ORM.
- Backend test framework.
- Input-validation tool, if one is needed.
- Session/token handling (after TD-R01).
- Android networking/JSON library.
- React routing/state library, if needed.

Every additional framework/library/tool must pass TD-010. Create the dedicated test database and safeguarded reset script. Use the backend assignment service in the seed process.

TD-R09 must be resolved before claiming the physical history-preservation design is final.

### First-slice implementation sequence

1. Establish local repository structure and record environment evidence.
2. Resolve TD-R01 and the required TD-R11 choices; record decisions and owners.
3. Create database migrations and logical relationships; create guarded test database reset and fictional seed process.
4. Implement backend authentication, authorization, assignment, review retrieval, decision/history transaction, state transition, and completion calculation.
5. Integrate office review in the web client and student status view in Android.
6. Run FS-01–FS-17; record actual evidence and defects.
7. Later increments add admin configuration (MAC-004) and instructor processing (full MAC-006), then complete the remaining MVP.

The broader product stages P0–P7 are defined in `../planning/CDCMS_MVP_Scope_Decision_and_Team_Execution_Plan_v0.3.md`. This technical sequence elaborates the first integrated slice; it does not replace the plan.

## 13. Status of unresolved decisions

- TD-011: “Evaluate the compatibility and suitability of the established stack before implementation starts.” This remains broader than M3 environment checks and is not yet closed.
- TD-R01: authentication/session mechanism; open.
- TD-R09: historical preservation implementation; open.
- TD-R11: additional tools/libraries; open; every addition subject to TD-010.
- TD-R12: Node.js team standard; 26.13.0 is a candidate, not approved standard.
- TD-R13: Windows version manager and `.nvmrc` behavior; open.
- TD-R14: Android application ID; open.
- TD-R15: repository owner; open.
- TD-R16: technical enforcement of pull-request rules; recommendation provisional.
- TD-R17: school publication, IP, ownership, naming, and licensing; open.
- TD-020: public-release review; not complete.
- AW-007, CR-I05/AW-I06, RP-I01–RP-I03, IR-I01/IR-I03 and other institutional questions remain open as recorded in the baseline and MVP crosswalk.

## 14. Status and approval

This contract is a proposed first-slice technical draft. It is not the approved MVP specification and does not amend the baseline. The project owner has approved MVP Specification v0.3, its Traceability Crosswalk v0.3, and Execution Plan v0.3 as the working MVP foundation. The technical contract remains Draft 0.3. The eleven reviewer clarifications are dispositioned as provisional first-slice implementation behavior in `FIRST_SLICE_IMPLEMENTATION_PILOT.md`; this does not create a new contract version or close TD-R01, TD-R09, TD-R11, TD-011, or other open baseline decisions.

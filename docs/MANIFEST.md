# CDCMS First-Slice Source Repository Manifest — 2026-11-07 Snapshot

> **Historical source-manifest snapshot:** This manifest describes the 2026-11-07 source package and its build-container evidence. The 2026-11-08 package contents and current verification results are recorded in [`../PACKAGE_MANIFEST_2026-11-08.md`](../PACKAGE_MANIFEST_2026-11-08.md) and [`implementation/BUILD_AND_TEST_STATUS_2026-11-08.md`](implementation/BUILD_AND_TEST_STATUS_2026-11-08.md).

**Package:** `CDCMS_First_Slice`  
**Implementation version:** 0.1.1 (first-slice pilot source)  
**Prepared:** 2026-11-07  
**Purpose:** Runnable source foundation for the first integrated office-review slice.  
**Release status:** Local development source package; not a production release and not approved for public publication yet.

## 1. Project authority and approval

| Artifact | Version | Status | Authority / notes |
|---|---|---|---|
| Requirements Baseline | 0.1 applied through CHG-001 and CHG-002 | Authoritative project requirements; original 18 files preserved | Unchanged. No CHG-003 is created or implied. |
| MVP Requirements Specification | 0.3 | Owner-approved working MVP foundation (2026-11-07) | Elaborates the baseline; does not replace it. |
| MVP Traceability Crosswalk and Issue Register | 0.3 | Owner-approved working traceability aid | Maps MVP requirements and scenarios to baseline/MAC criteria; mappings remain subject to evidence and refinement. |
| MVP Scope Decision and Team Execution Plan | 0.3 | Owner-approved working execution plan | Defines P0–P7 product stages. |
| First-Slice Technical Contract | Draft 0.3 | Proposed technical contract | Specific implementation choices below are provisional pilot choices where noted. |
| M3 Environment Readiness Checklist | v1.1 | Working checklist; no official M3 results entered | M3 remains In Progress. |
| Node-to-PostgreSQL Probe Addendum | v1.2 proposed | Supplemental proposed check | Prior owner-run probe was reported PASS; this is not the official M3 checklist or application integration test. |
| First-Slice Implementation Pilot Notes | 0.1.1 | Implementation record | Describes included behavior, provisional choices, and deferred scope. |
| Build and Test Status | 2026-11-07 | Evidence record | Distinguishes checks run here from tests requiring the developer workstation. |

Owner approval applies to MVP v0.3, its crosswalk, and its execution plan as the working project foundation. It does not approve institutional policies, close technical decisions, amend the baseline, or authorize public publication.

## 2. Application components

| Component | Location | Implemented scope | Status |
|---|---|---|---|
| Backend API | `backend/` | Express API, PostgreSQL schema, migration/seed scripts, authentication, office authorization, applicability assignment, review decisions, processing history, derived completion | Source prepared; runtime/integration verification outstanding |
| Staff web portal | `web/` | React/Vite login, office review queue, status filters, approve/reject and remarks; student dashboard also available in browser | Source prepared; Vite build/browser integration not run in this build container |
| Student Android app | `android/` | Native Java login, own clearance view, statuses, remarks, derived progress, refresh/sign-out | Source prepared; Android Studio/Gradle build and emulator launch not run in this build container |
| PostgreSQL | `backend/src/schema.sql` | Role/account/assignment, academic, office, template, student clearance, history, and session tables | Schema source prepared; migration/seed against PostgreSQL not run in this build container |
| Automated tests | `backend/test/` | Domain tests and PostgreSQL integration suite | 14 dependency-free domain/auth/database-safety tests passed; PostgreSQL suite not executed here |

### First-slice boundaries

This is not the complete MVP. It implements the first office-review vertical slice. Admin configuration endpoints/screens are deferred (MAC-004 is not demonstrated). Instructor workflow is deferred (full MAC-006 is not demonstrated). There is no final sign-off, reopening, revocation, or cancellation workflow.

## 3. Provisional implementation decisions

These choices were made to produce a concrete pilot and must not be mistaken for completed baseline decision records:

- TD-R01: server-managed opaque session token in an HttpOnly, SameSite=Lax cookie; token digest stored in PostgreSQL. Provisional pilot choice only.
- TD-R11 / TD-010: `pg` query client, direct parameterized SQL, `schema.sql` initial migration, Node built-in test runner, `argon2`, Express, React, Vite, and platform Android networking/JSON. Dependency choices require the established TD-010 review and TD-R11 disposition.
- TD-R09: physical historical snapshot/versioning strategy remains open. This pilot stores individual processing history but does not claim to settle the full historical-preservation design.
- Processing history: normal `UPDATE`, `DELETE`, and `TRUNCATE` operations are rejected by database triggers; deleting a request or requirement record cannot cascade into history. A privileged database owner can still alter schema protections, so database-owner credentials must not be used as ordinary application credentials in a future hardened deployment.
- TD-R14: Android application ID `com.samplecollege.cdcms` is provisional.
- TD-011: “Evaluate the compatibility and suitability of the established stack before implementation starts.” It is not complete merely because some component checks succeeded.

Login lockout and rate limiting are deferred. The Android network-security configuration permits cleartext HTTP only to the emulator bridge by default; a physical-device pilot requires an exact LAN-IP entry. Do not deploy this HTTP configuration. Production/public use requires HTTPS and a separate security review.

## 4. Fictional data

Seed accounts: `admin`, `reviewer-a`, `reviewer-b`, `student-a`, `student-b`. The seed command generates a password only for newly created demo accounts and prints it once if it generated one. It requires explicit opt-in, a loopback PostgreSQL host, and a `_dev` database. Existing accounts and inactive flags are never overwritten or reactivated. The seed calls the backend assignment service to calculate student-specific applicable requirements. Requirement A is mandatory, Program A-only, and uses `REQUIRED`; Requirement B is mandatory, Program B-only, and uses `OPTIONAL`.

The data uses `Sample College` and fictional names only. No actual student or institutional records are included.

## 5. Verification record

Checks performed in the isolated build container for implementation revision 0.1.1:

| Check | Result |
|---|---|
| Backend JavaScript syntax: `backend/src/*.js`, `backend/test/*.js`, `backend/scripts/*.js` | PASS |
| Dependency-free Node tests | PASS — 14 passed, 0 failed |
| Integration suite discovery without a dedicated test database | SKIPPED as expected; no PostgreSQL integration was executed |
| React JSX syntax transpilation for `web/src/App.jsx` and `web/src/main.jsx` | PASS |
| Linux Gradle launcher shell syntax (`sh -n` and `bash -n`) | PASS |
| Java parser check | Partial only: no common syntax errors reported, but Android SDK classes unavailable and no Android build occurred |
| Local Markdown links | PASS — no broken local links found |
| Applied baseline archive | PASS — all 18 Markdown files match extracted copies byte-for-byte; archive SHA-256 `83694e54a8be90f623f82f2a04cdfbb0773491e42041ec52005ae241c91c54c3` |
| SHA-256 inventory | Generated for all package files other than `docs/SHA256SUMS.txt`; includes this manifest |

Not run in the build container: npm dependency installation, PostgreSQL migration/seed, API integration, React/Vite production build, Android Gradle build/install, and integrated office-review-to-Android workflow. The package registry could not be reached from that container; PostgreSQL and Android SDK/Studio were unavailable there. Do not mark these items Passed until they are run on the developer's Ubuntu machine.

## 6. Important files

| File | Purpose |
|---|---|
| `README.md` | Local setup, run, and test instructions |
| `docs/README.md` | Documentation navigation and authority |
| `docs/requirements/README.md` | Baseline entry point |
| `docs/mvp/CDCMS_MVP_Requirements_Specification_v0.3.md` | Working MVP specification |
| `docs/mvp/CDCMS_MVP_Traceability_Crosswalk_and_Issue_Register_v0.3.md` | Traceability and issue register |
| `docs/planning/CDCMS_MVP_Scope_Decision_and_Team_Execution_Plan_v0.3.md` | P0–P7 execution plan |
| `docs/implementation/First-Slice_Technical_Contract_Draft_0.3.md` | First-slice contract |
| `docs/implementation/FIRST_SLICE_IMPLEMENTATION_PILOT.md` | Implementation decisions and limitations |
| `docs/implementation/BUILD_AND_TEST_STATUS_2026-11-07.md` | Build/test evidence and outstanding checks |
| `docs/environment/M3_Environment_Readiness_Checklist_Ubuntu_Windows_v1.1.md` | M3 per-machine checklist |
| `docs/environment/M3_v1.2_Proposed_Node_PostgreSQL_Connection_Smoke_Check.md` | Supplemental Node-to-PostgreSQL probe instructions |
| `docs/reviews/First-Slice_Contract_Review_Clarifications.md` | Disposition of contract review notes |
| `docs/source-archives/clearance-requirements-baseline-0.1-CHG-001-CHG-002.zip` | Original applied baseline ZIP |
| `docs/SHA256SUMS.txt` | SHA-256 file inventory (includes this manifest; excludes only itself) |

## 7. Publication and license

Do not make the repository public until TD-R15 (repository ownership), TD-R17 (school publication/IP/ownership/naming/licensing rules), and TD-020 (full repository and commit-history safety review) are resolved. Keep `.env`, credentials, real personal/student data, confidential institutional material, and private machine details out of Git. No license is provided or implied.

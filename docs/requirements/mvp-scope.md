# MVP Scope (MVP, MAC)

Prefix `MVP` (scope) and `MAC` (acceptance criteria) · Baseline 0.1 · Last reviewed 2026-11-04
Related: every other module. MVP content is only as accurate as the institutional information it depends on.
Legend and conventions: [README.md](README.md).

## A. Goal and essential features

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| MVP-001 | Deliver an initial working application that demonstrates a complete digital clearance workflow end to end and can be demonstrated and tested by representative users. | CONFIRMED | REQUIRED | SRC-01 §1, §12 | 2026-11-04 | |
| MVP-002 | Essential feature 1: user account and role management. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | See RP. |
| MVP-003 | Essential feature 2: student academic information management. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | See AS-008. |
| MVP-004 | Essential feature 3: academic program and department management. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | See AS-005. |
| MVP-005 | Essential feature 4: administrative office management. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | See OF-001. |
| MVP-006 | Essential feature 5: clearance requirement configuration. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | See CR-001. |
| MVP-007 | Essential feature 6: requirement assignment. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | See CR-009. |
| MVP-008 | Essential feature 7: instructor approval processing. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | See IR-001. |
| MVP-009 | Essential feature 8: administrative office approval processing. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | See OF-002. |
| MVP-010 | Essential feature 9: student clearance monitoring. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | See RP-M02 to RP-M04. |
| MVP-011 | Essential feature 10: overall clearance completion tracking. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | See AW-004. |
| MVP-012 | Essential feature 11: Argon2id password hashing and verification. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | See TD-006, NFR-001. |
| MVP-013 | Essential feature 12: basic role-based access control. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | See RP-004. |
| MVP-014 | The MVP demonstrates: a functional Android application, a functional web application, a working Node.js backend, a connected PostgreSQL database, Argon2id authentication, communication between both clients and the backend, consistent statuses across clients, and at least one complete end-to-end workflow. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | |
| MVP-015 | Sample data and test accounts are used. Real sensitive student information is not used in development or demonstrations. | CONFIRMED | REQUIRED | SRC-01 §12, §20 | 2026-11-04 | Revisit only after AP-I06 is answered. |
| MVP-016 | Initial sample data: one program (BSIT as a development example), a few students including regular and irregular, one or two instructors, two representative offices, one department, one academic year and semester, one administrator. | PROVISIONAL | REQUIRED | SRC-01 §12 | 2026-11-04 | Fictional development data. Not confirmed college data and not a permanent limit. Real values replace it after FD-001 and FD-013. |
| MVP-017 | Optional enhancements are not implemented while essential functionality is incomplete. | CONFIRMED | REQUIRED | SRC-01 §13 | 2026-11-04 | |

## B. Proposed prioritization beyond the essentials

Must Have is MVP-002 to MVP-014. The items below are Claude's proposals (SRC-05), not decisions.

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| MVP-018 | Department head supervision view. | PROVISIONAL | OPTIONAL | SRC-05 | 2026-11-04 | Proposed **Should Have**. Depends on RP-I01 and RP-I02. |
| MVP-019 | Search and filtering of students and requirements. | PROVISIONAL | OPTIONAL | SRC-05 | 2026-11-04 | Proposed **Should Have**. |
| MVP-020 | Bulk approval. | PROVISIONAL | OPTIONAL | SRC-05 | 2026-11-04 | Proposed **Should Have**. See AW-014. |
| MVP-021 | Activity-history screen. | PROVISIONAL | OPTIONAL | SRC-05 | 2026-11-04 | Proposed **Should Have**. See RP-M16. |
| MVP-022 | Notifications. | PROVISIONAL | OPTIONAL | SRC-05 | 2026-11-04 | Proposed **Could Have**. |
| MVP-023 | Report export. | PROVISIONAL | OPTIONAL | SRC-05 | 2026-11-04 | Proposed **Could Have**. |
| MVP-024 | File or proof uploads. | PROVISIONAL | OPTIONAL | SRC-05 | 2026-11-04 | Proposed **Could Have**. See CR-010. |
| MVP-025 | Self-service password reset. | PROVISIONAL | OPTIONAL | SRC-05 | 2026-11-04 | Proposed **Could Have**. Depends on RP-I04. |

## C. Exclusions

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| MVP-026 | Functions of a complete Student Information System beyond what clearance needs. | NOT APPLICABLE | OPTIONAL | SRC-01 §1 | 2026-11-04 | Out of scope. See AS-010. |
| MVP-027 | Enterprise-level security architecture, advanced monitoring systems and excessive security frameworks. | NOT APPLICABLE | OPTIONAL | SRC-01 §20 | 2026-11-04 | Excluded for the MVP. Required basic safeguards remain: see NFR. |

## D. MVP acceptance criteria

The MVP is not complete because screens exist. The major workflow must actually work (SRC-01 §12).

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| MAC-001 | All three developers can set up and run the project using documented instructions (Ubuntu and Windows). | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | |
| MAC-002 | Authorized users can access the appropriate application functions. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | |
| MAC-003 | User passwords are hashed and verified using Argon2id. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | |
| MAC-004 | The administrator can configure academic and clearance information. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | |
| MAC-005 | A student can view their assigned clearance requirements. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | |
| MAC-006 | An instructor or office representative can process an assigned requirement. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | |
| MAC-007 | The backend successfully updates PostgreSQL. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | |
| MAC-008 | The student can see the updated status through Android. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | |
| MAC-009 | Overall clearance completion is calculated correctly. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | "Correctly" is defined by AW-004 and AW-I06 once known. |
| MAC-010 | The system handles basic invalid inputs and unauthorized actions appropriately. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | |
| MAC-011 | The complete workflow can be demonstrated and tested. | CONFIRMED | REQUIRED | SRC-01 §12 | 2026-11-04 | |

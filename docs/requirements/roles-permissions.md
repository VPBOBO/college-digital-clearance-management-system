# Roles and Permissions (RP)

Prefix `RP` · Baseline 0.1 · Last reviewed 2026-11-04
Related: [offices.md](offices.md), [instructor-responsibilities.md](instructor-responsibilities.md), [approval-workflow.md](approval-workflow.md)
Legend and conventions: [README.md](README.md).

## A. System requirements

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| RP-001 | Baseline role list: student, instructor/faculty member, administrative office personnel, department personnel, department head, system administrator. | CONFIRMED | REQUIRED | SRC-01 §6 | 2026-11-04 | Starting list from the brief. Whether the college has every one of these roles is RP-I01. |
| RP-002 | Roles and permissions are configurable. | CONFIRMED | REQUIRED | SRC-01 §6, §12 (MVP feature 12) | 2026-11-04 | Depth of configurability in the MVP is RP-003. |
| RP-003 | MVP configurability depth: a fixed set of roles with permissions assigned per role; no custom permission editor. | PROVISIONAL | UNDECIDED | SRC-05; SRC-02 §7 | 2026-11-04 | Recommendation. See TD-R07. |
| RP-004 | The backend verifies permissions on every protected action. Hiding buttons in a client is not authorization. | CONFIRMED | REQUIRED | SRC-01 §9, §20 | 2026-11-04 | |
| RP-005 | No user is assumed to have administrative privileges. | CONFIRMED | REQUIRED | SRC-01 §6 | 2026-11-04 | |
| RP-006 | For each role, the permitted actions and the records it may access are defined in a role matrix. | CONFIRMED | REQUIRED | SRC-01 §6, §14 Stage 3 | 2026-11-04 | Draft matrix below. It is a design aid, not a schema. |

### Draft role matrix

Legend: **Y** permitted · **C** conditional (see Notes) · **?** undecided, not assumed · **–** not permitted or not applicable.

This matrix is Claude's consolidation of the role descriptions in SRC-01 §6, so every row is PROVISIONAL until reviewed. Cells marked `?` are explicitly **not** assumed.

| ID | Capability | Student | Instructor | Office | Dept. Personnel | Dept. Head | Admin | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RP-M01 | Log in and view own account | Y | Y | Y | Y | Y | Y | PROVISIONAL | REQUIRED | SRC-01 §6, §9 | 2026-11-04 | |
| RP-M02 | View own assigned requirements and their statuses | Y | – | – | – | – | – | PROVISIONAL | REQUIRED | SRC-01 §6A | 2026-11-04 | |
| RP-M03 | View own remarks and rejection reasons | Y | – | – | – | – | – | PROVISIONAL | REQUIRED | SRC-01 §6A | 2026-11-04 | |
| RP-M04 | View own overall clearance progress and completion | Y | – | – | – | – | – | PROVISIONAL | REQUIRED | SRC-01 §6A | 2026-11-04 | |
| RP-M05 | View students and requirements assigned to the user | – | Y | Y | C | C | C | PROVISIONAL | REQUIRED | SRC-01 §6B-F | 2026-11-04 | Dept. roles: "relevant students" only. Admin: monitoring view only. Scope rules `[RECORD_ACCESS_SCOPE]`. |
| RP-M06 | Approve or reject an assigned requirement, with remarks | – | Y | Y | C | C | ? | PROVISIONAL | REQUIRED | SRC-01 §6B-F | 2026-11-04 | Dept. Personnel "when authorized"; Dept. Head "when required by institutional policy" (RP-I02). Whether Admin may approve is undecided. |
| RP-M07 | Monitor own pending and completed tasks | – | Y | Y | Y | Y | – | PROVISIONAL | REQUIRED | SRC-01 §6B-E | 2026-11-04 | |
| RP-M08 | Monitor department-level clearance progress | – | – | – | Y | Y | Y | PROVISIONAL | CONDITIONAL | SRC-01 §6D-F | 2026-11-04 | Condition: department roles exist at the college (RP-I01). |
| RP-M09 | Supervise department personnel's clearance activity | – | – | – | – | Y | – | PROVISIONAL | CONDITIONAL | SRC-01 §6E | 2026-11-04 | Condition: the department head role exists (RP-I01). |
| RP-M10 | Manage user accounts | – | – | – | – | – | Y | PROVISIONAL | REQUIRED | SRC-01 §6F | 2026-11-04 | Who creates accounts in practice: RP-I04. |
| RP-M11 | Manage roles and permissions | – | – | – | – | – | Y | PROVISIONAL | REQUIRED | SRC-01 §6F | 2026-11-04 | |
| RP-M12 | Manage academic information (programs, departments, terms and similar) | – | – | – | – | – | Y | PROVISIONAL | REQUIRED | SRC-01 §6F | 2026-11-04 | |
| RP-M13 | Manage administrative offices | – | – | – | – | – | Y | PROVISIONAL | REQUIRED | SRC-01 §6F | 2026-11-04 | |
| RP-M14 | Create or configure requirement templates | – | ? | ? | ? | ? | Y | PROVISIONAL | REQUIRED | SRC-01 §6F, §10 | 2026-11-04 | The brief lets requirements "come from" several parties but says administrators configure them. Who may create them is RP-I07. |
| RP-M15 | Assign requirements to students | – | ? | ? | ? | ? | Y | PROVISIONAL | REQUIRED | SRC-01 §6F, §11 | 2026-11-04 | Same open point as RP-M14. |
| RP-M16 | View system-wide activity and processing history | – | – | – | – | ? | Y | PROVISIONAL | OPTIONAL | SRC-01 §6F | 2026-11-04 | Activity-history screen is a proposed Should Have (MVP-021). |

## B. Institutional information register

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| RP-I01 | Which of the baseline roles actually exist at the college, and under what titles. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[ROLE_TITLES]` |
| RP-I02 | Whether the department head (or department personnel) must approve any requirement, and which. | UNKNOWN | UNDECIDED | SRC-FORM (pending) | 2026-11-04 | `[DEPT_APPROVAL_POLICY]` |
| RP-I03 | Whether one person may hold several roles (for example instructor and department head). | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[MULTI_ROLE_POLICY]` |
| RP-I04 | Who creates accounts and sets or resets initial passwords. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[ACCOUNT_PROVISIONING]` |
| RP-I05 | What identifier students log in with (student number, email, other). | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[STUDENT_LOGIN_ID]` |
| RP-I06 | Whether one office may see another office's decisions and remarks. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[CROSS_OFFICE_VISIBILITY]` |
| RP-I07 | Who may create or change requirement templates: administrators only, or also offices, departments, instructors. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[REQUIREMENT_OWNERSHIP_POLICY]` |

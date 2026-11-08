# Administrative Offices (OF)

Prefix `OF` · Baseline 0.1 · Last reviewed 2026-11-04
Related: [clearance-requirements.md](clearance-requirements.md), [approval-workflow.md](approval-workflow.md), [roles-permissions.md](roles-permissions.md)
Legend and conventions: [README.md](README.md).

## A. System requirements

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| OF-001 | Administrative offices are managed as data (add, rename, disable) through the system. | CONFIRMED | REQUIRED | SRC-01 §6C; SRC-02 §5 | 2026-11-04 | MVP feature 4. |
| OF-002 | Office personnel can view their assigned students, review office-specific requirements, approve or reject them with remarks, and monitor pending and completed clearances. | CONFIRMED | REQUIRED | SRC-01 §6C, §12 (MVP feature 8) | 2026-11-04 | What each office actually checks is OF-I03. |
| OF-003 | The MVP demonstration includes two representative offices as sample data. | PROVISIONAL | REQUIRED | SRC-01 §12 | 2026-11-04 | Development sample only. Which offices stand in for them is `[MVP_SAMPLE_OFFICES]` (UNDECIDED). See MVP-016. |
| OF-004 | The system does not assume every student needs approval from every office. | CONFIRMED | REQUIRED | SRC-01 §10 | 2026-11-04 | Applicability: OF-I04 and CR-005. |

## B. Institutional information register

All items are unverified. Offices listed in Notes are **examples from SRC-01, not confirmed**.

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| OF-I01 | Which offices take part in clearance. | UNKNOWN | UNDECIDED | SRC-FORM (pending) | 2026-11-04 | `[OFFICE_LIST]`. Examples only: Library, Registrar, Accounting, Laboratory, Guidance Office, Property Office. |
| OF-I02 | For each office, the signatory title or role and how many signatories it has. | UNKNOWN | UNDECIDED | SRC-FORM (pending) | 2026-11-04 | `[OFFICE_SIGNATORIES]` |
| OF-I03 | For each office, what the office verifies before it clears a student. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[OFFICE_CRITERIA]` |
| OF-I04 | Which offices apply to which students (by program, year level, classification, other). | UNKNOWN | UNDECIDED | SRC-FORM (pending) | 2026-11-04 | `[OFFICE_APPLICABILITY]` |
| OF-I05 | Whether an office has several branches, campuses or sub-units that sign separately. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[OFFICE_SUBUNITS]` |

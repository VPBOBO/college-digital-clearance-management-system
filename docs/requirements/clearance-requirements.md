# Clearance Requirements (CR)

Prefix `CR` · Baseline 0.1 · Last reviewed 2026-11-04
Related: [offices.md](offices.md), [instructor-responsibilities.md](instructor-responsibilities.md), [approval-workflow.md](approval-workflow.md), [records-and-history.md](records-and-history.md), [form-integration-checklist.md](form-integration-checklist.md)
Legend and conventions: [README.md](README.md).

## A. System requirements

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| CR-001 | Administrators can configure clearance requirements according to the college's actual procedures, without changing source code. | CONFIRMED | REQUIRED | SRC-01 §10, §12 (MVP feature 5); SRC-02 §5 | 2026-11-04 | |
| CR-002 | Reusable requirement definitions (templates) are kept separate from individual students' clearance records. | CONFIRMED | REQUIRED | SRC-01 §8; SRC-02 §5 | 2026-11-04 | How the separation is implemented is not decided: see TD-R09. Preservation rules: RH-001. |
| CR-003 | Requirements can be owned by instructors and by administrative offices. | CONFIRMED | REQUIRED | SRC-01 §10, §12 (MVP features 7 and 8) | 2026-11-04 | |
| CR-004 | Requirements can also be owned by academic departments and other authorized personnel. | PROVISIONAL | CONDITIONAL | SRC-01 §10 | 2026-11-04 | Whether the MVP includes department-owned requirements depends on the form (CR-I02, RP-I02). |
| CR-005 | Candidate applicability conditions: academic program, department, year level, academic year, semester, student classification, enrolled subjects, other institution-defined conditions. | CONFIRMED | CONDITIONAL | SRC-01 §10 | 2026-11-04 | These are conditions the system may support. Which are actually needed is CR-I03. |
| CR-006 | MVP applicability is limited to a small fixed set of conditions, not a general rule engine. | PROVISIONAL | UNDECIDED | SRC-05; SRC-02 §7 | 2026-11-04 | Recommendation only. Final set waits for FD-004. See TD-R06. |
| CR-007 | Requirements are not automatically assigned identically to every student. | CONFIRMED | REQUIRED | SRC-01 §10 | 2026-11-04 | |
| CR-008 | Each requirement can be flagged mandatory or non-mandatory for overall completion. | CONFIRMED | REQUIRED | SRC-01 §11 ("applicable mandatory requirement") | 2026-11-04 | Which real requirements are mandatory is CR-I04. Not the same as the documentation class (see README §3). |
| CR-009 | Applicable requirements are assigned to students by the system once the term and requirements are configured. | CONFIRMED | REQUIRED | SRC-01 §11 step 3, §12 (MVP feature 6) | 2026-11-04 | |
| CR-010 | Attaching proof files (uploads) to a requirement. | PROVISIONAL | OPTIONAL | SRC-05 | 2026-11-04 | Not in the brief. Proposed for deferral until after the MVP (MVP-024). |

## B. Institutional information register

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| CR-I01 | The complete list of requirements on the actual clearance form. | UNKNOWN | UNDECIDED | SRC-FORM (pending) | 2026-11-04 | `[REQUIREMENT_LIST]`. Use section C below. |
| CR-I02 | For each requirement, the responsible signatory (instructor, office, department, other). | UNKNOWN | UNDECIDED | SRC-FORM (pending) | 2026-11-04 | `[REQUIREMENT_SIGNATORIES]` |
| CR-I03 | For each requirement, which students it applies to. | UNKNOWN | UNDECIDED | SRC-FORM (pending) | 2026-11-04 | `[REQUIREMENT_APPLICABILITY]` |
| CR-I04 | For each requirement, whether it is mandatory, optional or conditional. | UNKNOWN | UNDECIDED | SRC-FORM (pending) | 2026-11-04 | `[REQUIREMENT_MANDATORY_FLAGS]` |
| CR-I05 | For each requirement, what counts as satisfied and what evidence is needed. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[REQUIREMENT_COMPLETION_CONDITIONS]`. A signature alone may not be the whole story; ask. |
| CR-I06 | Whether the requirement set is the same every term or changes. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[REQUIREMENT_STABILITY]` |

## C. Requirement register (populate from the clearance form)

One row per requirement on the form. The row below is a placeholder, **not** a real requirement. Copy it for each requirement and use IDs `CR-P002`, `CR-P003`, and so on.

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| CR-P001 | `[REQUIREMENT_NAME]`: signatory `[SIGNATORY]`; applies to `[APPLICABILITY]`; completion condition `[COMPLETION_CONDITION]`. | UNKNOWN | UNDECIDED | SRC-FORM (pending) | 2026-11-04 | Placeholder row. Replace on form review and log in the change-log. |

# Academic Structure (AS)

Prefix `AS` · Baseline 0.1 · Last reviewed 2026-11-04
Related: [student-classifications.md](student-classifications.md), [clearance-requirements.md](clearance-requirements.md), [records-and-history.md](records-and-history.md), [../decisions.md](../decisions.md)
Legend and conventions: [README.md](README.md). Names used below are **working labels** until the college's own terms are confirmed (AS-003).

## A. System requirements

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| AS-001 | The system can represent a college-level academic structure with these entity types: college, department, academic program, year level, subject, section, academic year, semester, student classification, instructor. | CONFIRMED | REQUIRED | SRC-01 §5 | 2026-11-04 | These are design entity types. Whether the college uses each one is in section B. |
| AS-002 | The system keeps these distinctions: a program is not a subject; a subject is not a section; a student's program is not necessarily determined by their enrolled subjects. | CONFIRMED | REQUIRED | SRC-01 §5 | 2026-11-04 | |
| AS-003 | The college's own terminology takes precedence over the working labels in this documentation. | CONFIRMED | REQUIRED | SRC-01 §5 | 2026-11-04 | Rename labels across modules when AS-I01 to AS-I06 are confirmed; log it. |
| AS-004 | Programs, subjects, year levels and student classifications are not hardcoded. They are managed as data through the system where appropriate. | CONFIRMED | REQUIRED | SRC-01 §5; SRC-02 §5 | 2026-11-04 | |
| AS-005 | Administrators can manage departments and academic programs through the system. | CONFIRMED | REQUIRED | SRC-01 §12 (MVP feature 3) | 2026-11-04 | |
| AS-006 | Administrators can manage academic years and semesters (academic terms) through the system. | CONFIRMED | REQUIRED | SRC-01 §6F, §11 step 1 | 2026-11-04 | Term structure itself is AS-I05. |
| AS-007 | Year levels, subjects and sections are configurable where practical. | CONFIRMED | CONDITIONAL | SRC-02 §5 | 2026-11-04 | Condition: needed only as far as requirement applicability (CR-005) or instructor assignment (IR-003) uses them. |
| AS-008 | Student academic information (program, year level, classification, section) is stored to the extent needed to decide which requirements apply. | CONFIRMED | REQUIRED | SRC-01 §12 (MVP feature 2) | 2026-11-04 | Limited by AS-010. |
| AS-009 | Whether the system stores enrollment records (which student takes which subject in which section). | UNKNOWN | UNDECIDED | SRC-01 §8 ("when necessary") | 2026-11-04 | `[ENROLLMENT_DATA_NEEDED]`. Depends on IR-I01, IR-I03 and CR-I03. |
| AS-010 | The system does not become a complete Student Information System. Academic data is limited to what the clearance process needs. | CONFIRMED | REQUIRED | SRC-01 §1 | 2026-11-04 | |

## B. Institutional information register

All items are unverified. Examples in Notes come from SRC-01 and are **not confirmed college data**.

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| AS-I01 | Official name of the college and any grouping above departments. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[COLLEGE_NAME]`. Example only: "College of Computer Studies". |
| AS-I02 | Departments that take part in clearance. | UNKNOWN | UNDECIDED | SRC-FORM (pending) | 2026-11-04 | `[DEPARTMENT_LIST]`. Example only: "Information Technology Department". |
| AS-I03 | Academic programs that take part in clearance. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[PROGRAM_LIST]`. Examples only: BSIT, BSCS, BSIS. BSIT as MVP sample data is covered by MVP-016. |
| AS-I04 | Year-level names and how many exist. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[YEAR_LEVEL_LIST]`. Examples only: First Year, Second Year. |
| AS-I05 | Academic-year format and the number and names of terms per year. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[TERM_STRUCTURE]`. Examples only: "2026–2027", "First Semester". |
| AS-I06 | Naming and coding conventions for subjects and sections. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[SUBJECT_SECTION_CONVENTIONS]`. Example only: "BSIT 2-A". |
| AS-I07 | Whether a student's program or section can differ from their enrolled subjects (for example an irregular load) and how the college treats that. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[PROGRAM_VS_SUBJECT_POLICY]`. Links to SC-I02. |
| AS-I08 | Who maintains academic master data and how it reaches the system (manual entry, file import, other). | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[MASTER_DATA_SOURCE]`. Links to TD-R10. |

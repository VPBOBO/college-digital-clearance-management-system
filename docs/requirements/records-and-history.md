# Records and History Preservation (RH)

Prefix `RH` · Baseline 0.1 · Last reviewed 2026-11-04
Related: [clearance-requirements.md](clearance-requirements.md) (CR-002), [approval-workflow.md](approval-workflow.md), [roles-permissions.md](roles-permissions.md), [../decisions.md](../decisions.md) (TD-R09)
Legend and conventions: [README.md](README.md).

**Principle (owner rule):** changing a requirement template, an academic configuration or an approval assignment must never rewrite a historical clearance record.

This module states *what must hold*. It deliberately does **not** choose *how* (snapshot versus versioned templates and similar). That is TD-R09, decided at the database-design stage.

## A. System requirements

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| RH-001 | Historical clearance records are preserved when a **requirement template** changes. | CONFIRMED | REQUIRED | SRC-04 rule 6; SRC-01 §8; SRC-02 §5 | 2026-11-04 | |
| RH-002 | Historical clearance records are preserved when an **academic configuration** changes (programs, departments, year levels, terms, subjects, sections, classifications renamed, changed or retired). | CONFIRMED | REQUIRED | SRC-04 rule 6; SRC-02 §5 | 2026-11-04 | |
| RH-003 | Historical clearance records are preserved when an **approval assignment** changes (an instructor, office or person is reassigned or replaced). | CONFIRMED | REQUIRED | SRC-04 rule 6; SRC-02 §5 | 2026-11-04 | Relates to IR-I05. |
| RH-004 | By default, a configuration change applies to future assignments only. Applying it to existing records, if ever allowed, is a deliberate and logged action. | PROVISIONAL | UNDECIDED | SRC-05; SRC-02 §5 | 2026-11-04 | Interprets "must not *unintentionally* modify". Confirm whether intentional retroactive change is ever wanted. |
| RH-005 | After later configuration changes, a student's record can still show which requirement applied, who was responsible then, and what was decided, by whom, when, and with what remarks. | PROVISIONAL | REQUIRED | SRC-05; SRC-01 §11 (who and when) | 2026-11-04 | Consequence of RH-001 to RH-003 and AW-005. |
| RH-006 | Configuration items and user accounts that clearance records refer to are deactivated or retired, not deleted, while records depend on them. | PROVISIONAL | REQUIRED | SRC-05 | 2026-11-04 | Prevents records from losing their referents. |
| RH-007 | Earlier decisions (including rejections later followed by another outcome) are kept in the processing history, not overwritten. | PROVISIONAL | REQUIRED | SRC-05; SRC-01 §6 ("relevant processing history") | 2026-11-04 | Holds whatever the answer to AW-012 turns out to be. |
| RH-008 | How long historical records are kept. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[RETENTION_PERIOD]`, same value as AP-I05. |
| RH-009 | How data-entry errors in historical records are corrected, and by whom. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[CORRECTION_PROCEDURE]`. Any correction should itself be logged. |

# Decisions That Must Wait for the Clearance Form (FD)

Baseline 0.1 · Last reviewed 2026-11-04
Procedure to follow when the form arrives: [form-integration-checklist.md](form-integration-checklist.md). Source: SRC-FORM (pending).

Until each decision below is made, the affected parts of the system stay configurable or undecided, and **no database schema is finalized and no application code is written** for them.

## 1. Decisions the form should settle

| ID | Decision | Waiting on | Affected items | Affected components | Safe to prepare meanwhile |
|---|---|---|---|---|---|
| FD-001 | Which offices and departments take part, and their signatories. | Form signature blocks | OF-I01 to OF-I05, AS-I02 | Data model, web UI, sample data | Treat offices as configurable data (OF-001). |
| FD-002 | The list of clearance requirements. | Form lines | CR-I01, CR-P001 | Data model, sample data | Requirement templates as data (CR-001). |
| FD-003 | The responsible signatory for each requirement (instructor, office, department). | Form | CR-I02, IR-I01 | Data model, permissions | None needed. |
| FD-004 | The final set of applicability conditions the MVP implements. | Form plus registrar | CR-005, CR-006, CR-I03, SC-I03 | Data model, assignment logic | Keep CR-006 as a recommendation only. |
| FD-005 | Which requirements are mandatory, optional or conditional. | Form | CR-I04, CR-008 | Completion calculation | Mandatory flag exists as a concept (CR-008). |
| FD-006 | Whether approvals need an order, and how much sequencing the MVP supports. | Form | AW-009 to AW-011, AW-I01, TD-R08 | Workflow logic, API, UI | AW-010 temporary default: no order enforced. |
| FD-007 | How instructors take part, and whether enrollment data is stored. | Form plus registrar | IR-I01, IR-I03, IR-I04, AS-009 | Data model, import | None needed. |
| FD-008 | The student classification set and its effects. | Form plus registrar | SC-I01 to SC-I03 | Data model, assignment logic | Classifications as data (SC-001). |
| FD-009 | Whether department head or department personnel approve anything. | Form | RP-I01, RP-I02, RP-M06, RP-M08, RP-M09 | Roles, permissions | Role list kept as the baseline RP-001. |
| FD-010 | The completion condition for each requirement, and so the overall completion rule. | Form plus offices | CR-I05, AW-I06, AW-004, MAC-009 | Completion calculation, tests | AW-004 holds as the general rule. |
| FD-011 | Clearance frequency and which students are cleared. | Form header plus registrar | AP-I01, AP-I02 | Term configuration | Academic terms as data (AS-006). |
| FD-012 | Whether a final sign-off exists and what the completed clearance produces. | Form | AW-I05, AW-I08 | Workflow, UI | None needed. |
| FD-013 | The college's terminology for academic entities. | Form plus registrar | AS-I01 to AS-I06 | Labels across all UIs and docs | Working labels only (AS-003). |

## 2. Decisions the form alone will not settle

These need institutional input beyond the form (an interview or a written policy) but still block parts of the design.

| ID | Decision | Waiting on | Affected items | Affected components |
|---|---|---|---|---|
| FD-014 | The procedure after a rejection. Neutral options for discussion, **none recommended or assumed**: (a) the student resubmits and the same approver reviews again; (b) the approver reverses the decision after the issue is fixed; (c) the rejection stands for the term; (d) another procedure. | Institutional procedure (SRC-INST) | AW-012, AW-013, AW-007, RH-007 | Workflow, status set (AW-003), student role (AW-013), API, UI |
| FD-015 | Whether approvals can be revoked, and whether one requirement can need several approvers. | SRC-INST | AW-I02, AW-I04 | Workflow, history |
| FD-016 | Record retention and the correction procedure. | SRC-INST | AP-I05, RH-008, RH-009 | Data model, administration |
| FD-017 | Account provisioning and the student login identifier. | SRC-INST | RP-I04, RP-I05 | Authentication, administration |

## 3. Work that does **not** wait for the form

Safe to proceed without institutional information (none of it creates schema or application code):

- Review of this baseline by all three developers.
- Evaluation of the established technology stack (TD-011).
- Explanation and decision of the authentication approach (TD-R01).
- Repository setup and Ubuntu/Windows environment instructions, once the team agrees (Stage 4 of the brief).

# Approval Workflow (AW)

Prefix `AW` · Baseline 0.1 · Last reviewed 2026-11-04
Related: [clearance-requirements.md](clearance-requirements.md), [roles-permissions.md](roles-permissions.md), [records-and-history.md](records-and-history.md), [form-dependent-decisions.md](form-dependent-decisions.md)
Legend and conventions: [README.md](README.md).

**Two things are deliberately left open in this module:**

1. **Approval order.** No order is permanently assumed. AW-009 to AW-011 keep sequencing configurable.
2. **What happens after a rejection.** This is an unresolved workflow decision (AW-012). Nothing here requires resubmission.

## A. System requirements

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| AW-001 | The clearance workflow is configurable rather than fixed. | CONFIRMED | REQUIRED | SRC-01 §11; SRC-02 §5 | 2026-11-04 | |
| AW-002 | The system distinguishes individual clearance status (one requirement) from overall clearance status (all requirements assigned to a student). | CONFIRMED | REQUIRED | SRC-01 §11 | 2026-11-04 | |
| AW-003 | Individual statuses start as Pending, Approved and Rejected. Extra statuses are added only when the actual workflow justifies them. | PROVISIONAL | REQUIRED | SRC-01 §11 ("Consider") | 2026-11-04 | Working set. The rejection decision (AW-012) may require more. |
| AW-004 | A student's overall clearance is marked completed only when every applicable mandatory requirement has satisfied its completion condition. | CONFIRMED | REQUIRED | SRC-01 §11 | 2026-11-04 | "Satisfied" for each requirement is CR-I05 and AW-I06. |
| AW-005 | The system records who processed each requirement and when. | CONFIRMED | REQUIRED | SRC-01 §11 | 2026-11-04 | History rules: RH-005, RH-007. |
| AW-006 | Remarks can be recorded with a decision, and students can see remarks and rejection reasons. | CONFIRMED | REQUIRED | SRC-01 §6A, §11 | 2026-11-04 | |
| AW-007 | Whether a remark is mandatory when rejecting. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[REMARK_REQUIRED_ON_REJECT]` |
| AW-008 | Status updates and the overall-completion calculation happen in the backend only. The Android and web clients do not implement clearance business logic. | CONFIRMED | REQUIRED | SRC-01 §7 | 2026-11-04 | |
| AW-009 | Approval sequencing is configurable where the college requires it. The system does not hardcode any approval order. | CONFIRMED | CONDITIONAL | SRC-02 §5; SRC-04 rule 4 | 2026-11-04 | Condition: the college actually requires an order (AW-I01). |
| AW-010 | Temporary MVP working default until the form is reviewed: no approval order is enforced. | PROVISIONAL | UNDECIDED | SRC-05; SRC-04 rule 4 | 2026-11-04 | A development placeholder. It is **not** a statement of college procedure. Replace on form review (FD-006). |
| AW-011 | If the college requires an order, the MVP supports only a simple prerequisite (a requirement becomes actionable only after a named earlier requirement is approved). No general workflow engine. | PROVISIONAL | UNDECIDED | SRC-05; SRC-02 §7 | 2026-11-04 | Recommendation to avoid overengineering. See TD-R08. |
| AW-012 | What happens after a requirement is rejected (for example resubmission, re-review, reversal by the same approver, or no recourse within the term). | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[REJECTION_PROCEDURE]`. **Unresolved.** Do not implement any rejection-recovery behavior until established. Options are listed neutrally in FD-014. |
| AW-013 | In the baseline, students can view their clearance but are not assigned any action in the workflow. | PROVISIONAL | UNDECIDED | SRC-01 §6A | 2026-11-04 | If AW-012 turns out to require student action (such as resubmission), this changes. Log it. |
| AW-014 | Approving several students' requirements in one action (bulk approval). | PROVISIONAL | OPTIONAL | SRC-05 | 2026-11-04 | Not in the brief. Proposed Should Have (MVP-020). |

## B. Institutional information register

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| AW-I01 | Whether the college requires approvals in a particular order, and which ones. | UNKNOWN | UNDECIDED | SRC-FORM (pending) | 2026-11-04 | `[SEQUENCE_RULES]` |
| AW-I02 | Whether one requirement can need several approvers. | UNKNOWN | UNDECIDED | SRC-FORM (pending) | 2026-11-04 | `[MULTI_APPROVER_RULES]` |
| AW-I03 | Deadlines or time windows for approving. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[APPROVAL_DEADLINES]` |
| AW-I04 | Whether an approval can be revoked afterwards, and by whom. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[REVOCATION_RULES]`. Any answer must respect RH-007. |
| AW-I05 | Whether a final sign-off step follows the individual requirements. | UNKNOWN | UNDECIDED | SRC-FORM (pending) | 2026-11-04 | `[FINAL_SIGNOFF_RULE]` |
| AW-I06 | The definition of "satisfied completion condition" for each requirement. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[COMPLETION_DEFINITION]`. Links to CR-I05. |
| AW-I07 | Whether partial clearance (some requirements done) has any institutional meaning. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[PARTIAL_CLEARANCE_MEANING]` |
| AW-I08 | What the completed clearance produces (for example a printout, a stamp, a record only) and who receives it. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[CLEARANCE_OUTPUT]` |

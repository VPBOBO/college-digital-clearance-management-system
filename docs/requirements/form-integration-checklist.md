# Clearance Form Integration Checklist

Source procedure: SRC-02 §4. Use this when the actual traditional clearance form (SRC-FORM) arrives. Statuses: `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked.

Rules: preserve the difference between verified information and unresolved questions. Do not redesign unrelated parts of the system.

| Step | Action | Update these | Status |
|---|---|---|---|
| 0 | Add the form to [00-sources.md](00-sources.md) (change SRC-FORM from "NOT YET AVAILABLE" to available, with date and who provided it). Keep the original form and raw interview records only in an institution-approved restricted location outside the public repository. Do not commit original forms, raw interview notes, or real student data to the repository, even temporarily. Record and publish only the minimum sanitized institutional facts needed for the requirements baseline, and only when their publication is authorized by the institution. If a redacted copy is needed for internal analysis, keep it in the approved restricted location unless the institution explicitly authorizes publication. | 00-sources.md | [ ] |
| 1 | Examine the form's contents and signatories. | n/a (reading) | [ ] |
| 2 | Identify every participating office and instructor role. | [offices.md](offices.md), [instructor-responsibilities.md](instructor-responsibilities.md) | [ ] |
| 3 | Identify each clearance requirement. | [clearance-requirements.md](clearance-requirements.md) section C | [ ] |
| 4 | Determine which requirements apply to which students. | CR-I03, OF-I04, SC-I03 | [ ] |
| 5 | Identify approval responsibilities. | CR-I02, IR-I01, RP-I02 | [ ] |
| 6 | Determine whether approvals have a required sequence. | [approval-workflow.md](approval-workflow.md) AW-I01, AW-009 to AW-011 | [ ] |
| 7 | Compare the form against every PROVISIONAL item. | all modules | [ ] |
| 8 | Replace incorrect assumptions with verified information. Items verified from the form become CONFIRMED in section B, with `SRC-FORM` as source and the new date. | affected rows | [ ] |
| 9 | Update the requirements documentation, including [form-dependent-decisions.md](form-dependent-decisions.md) and [open-questions.md](open-questions.md). | those files | [ ] |
| 10 | Evaluate effects on the database, API, interfaces and workflows. Write the findings down. Do not finalize the schema until this is reviewed. | change-log entry | [ ] |
| 11 | Record every change, with previous and new value, reason and source. Suggested ID: the next unused `CHG-NNN`. | [../change-log.md](../change-log.md) | [ ] |

Questions the form will probably **not** answer (FD-014 to FD-017 and OQ-008, OQ-014, OQ-020 to OQ-024) stay open and need an interview or a written policy.

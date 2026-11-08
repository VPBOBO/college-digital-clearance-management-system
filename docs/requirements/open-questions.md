# Open Questions (OQ)

Baseline 0.1 · Last reviewed 2026-11-04
Conventions: [README.md](README.md). Questions that wait for the clearance form are cross-listed in [form-dependent-decisions.md](form-dependent-decisions.md).

When a question is answered, update the items it points to (they hold the answer), log the change in [../change-log.md](../change-log.md), then delete the row here and record that in the log. IDs are not reused.

**Priority:** P1 blocks the requirement list or data model · P2 blocks workflow or interface detail · P3 can wait until after the first working slice.
**Form?** Y = the clearance form should answer it · Partly = the form helps but staff input is needed · N = the form will not answer it.

| ID | Question | Items affected | Priority | Form? | Who can answer |
|---|---|---|---|---|---|
| OQ-001 | Which offices and departments sign the clearance, and who are their signatories? | OF-I01, OF-I02, AS-I02 | P1 | Y | Form, registrar |
| OQ-002 | What is the complete list of clearance requirements, and who is responsible for each? | CR-I01, CR-I02 | P1 | Y | Form |
| OQ-003 | Which instructors sign for which students, and once per student or once per subject? | IR-I01, IR-I03, IR-I04 | P1 | Partly | Form, instructors |
| OQ-004 | Which requirements apply to which students (program, year level, classification, other)? | CR-I03, OF-I04, SC-I03 | P1 | Partly | Form, registrar |
| OQ-005 | Which requirements are mandatory, optional or conditional? | CR-I04 | P1 | Y | Form |
| OQ-006 | What makes each requirement "satisfied", and what evidence is needed? | CR-I05, AW-I06 | P1 | Partly | Offices |
| OQ-007 | Must approvals happen in a particular order? Which ones? | AW-I01 | P1 | Y | Form, registrar |
| OQ-008 | What happens after a requirement is rejected? | AW-012 | P1 | N | Offices, registrar |
| OQ-009 | How often is clearance done, and which students must be cleared? | AP-I01, AP-I02 | P1 | Partly | Registrar |
| OQ-010 | Which student classifications exist, how are they defined, and how do they change requirements? | SC-I01 to SC-I04 | P2 | Partly | Registrar |
| OQ-011 | What are the college's own names for colleges, departments, programs, year levels, terms, subjects and sections? | AS-I01 to AS-I06 | P2 | Partly | Registrar |
| OQ-012 | Do department personnel and department head roles exist, and must they approve anything? | RP-I01, RP-I02 | P2 | Partly | Department heads |
| OQ-013 | Does the system need enrollment data, and where does academic master data come from? | AS-009, AS-I07, AS-I08, IR-I03 | P2 | N | Registrar |
| OQ-014 | Who creates accounts and passwords, and what do students log in with? | RP-I04, RP-I05 | P2 | N | Registrar, IT |
| OQ-015 | Is there a final sign-off, and what does completed clearance produce? | AW-I05, AW-I08 | P2 | Partly | Form, registrar |
| OQ-016 | Session-based or token-based authentication? (team decision after trade-offs are explained) | TD-R01, NFR-014 | P2 | N | Project team |
| OQ-017 | What are the deadline, demo date, demo environment, tester group, Android targets and team skills? | NFR-013, NFR-016, NFR-017, TD-R03 | P2 | N | Project team |
| OQ-018 | May one approver revoke an approval, can one requirement need several approvers, and are there approval deadlines? | AW-I02, AW-I03, AW-I04 | P3 | N | Offices |
| OQ-019 | Is a remark mandatory when rejecting? | AW-007 | P3 | Partly | Offices |
| OQ-020 | What is the re-clearance rule, and how are data-entry errors corrected? | AP-I08, RH-009 | P3 | N | Registrar |
| OQ-021 | What are the record retention period and the privacy obligations for student data? | AP-I05, AP-I06, RH-008 | P3 | N | School administration |
| OQ-022 | What happens when an instructor is absent or replaced? | IR-I05 | P3 | N | Department heads |
| OQ-023 | Who may create requirement templates, and can offices see each other's decisions? | RP-I06, RP-I07 | P3 | N | Registrar, administrators |
| OQ-024 | Does the paper process run in parallel during testing? | AP-I09 | P3 | N | Registrar |
| OQ-025 | Does academic standing or any grade-related condition affect clearance? | AP-I07 | P3 | Partly | Registrar |

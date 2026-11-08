# College Digital Clearance Management System (CDCMS)
## MVP Requirements Specification — Generic, Configurable School-Project MVP

**Document ID:** CDCMS-MVP-SPEC-001  
**Version:** 0.3  
**Prepared:** 2026-11-05  
**Status:** Approved for use as the working MVP specification (owner approval: 2026-11-07; see [Owner Approval Record](OWNER_APPROVAL_RECORD_2026-11-07.md))<br>
**Project type:** Academic prototype / minimum viable product (MVP)  
**Team size:** Three developers  
**Institution label in this public-safe draft:** `Sample College`

> **Authority notice**  
> The project owner approved this v0.3 document on 2026-11-07 for use as the working MVP specification (see the Owner Approval Record linked above). This adoption does **not** amend, replace, or supersede Requirements Baseline 0.1, and it does not turn every proposed feature or demo assumption into a mandatory requirement or resolve open institutional and technical decisions. Baseline identifiers remain authoritative. The `MSPEC-*`, `DA-*`, and `TS-*` identifiers belong only to this specification. Sample offices, sample student classifications, display labels, and demo settings are not verified institutional policy.
>
> **Public-release notice**  
> This version uses `Sample College` and fictional data. Do not insert a real institution's name, branding, official documents, staff names, or policy claims into public files until the applicable publication, intellectual-property, ownership, and naming rules have been checked under TD-020 and TD-R17.

---

# 1. Purpose and MVP outcome

CDCMS is a small academic prototype for configuring and processing a college clearance workflow. An administrator maintains the sample academic and clearance configuration. The system assigns applicable requirements to student records. Instructors or administrative office personnel process the requirements assigned to them. Students use an Android application to view their own requirements and current progress. The backend owns authorization, requirement decisions, and the overall completion calculation.

The system is **not** a full Student Information System. The MVP uses fictional student records and manually maintained sample academic information. It does not connect to real school systems, collect real payments, or make automated disciplinary or financial decisions.

## 1.1 Core demonstration outcome

The team can demonstrate, end to end, that:

1. An administrator configures a sample academic period, program, offices, staff assignments, clearance requirements, and applicability.
2. The backend determines which requirements apply to selected fictional students and creates their clearance records.
3. An instructor or office representative processes a requirement assigned to them.
4. The backend records the result in PostgreSQL and derives the overall completion information.
5. A student sees their own assigned requirements and updated status in Android.
6. The three application components work together and the team can test the baseline acceptance criteria MAC-001 through MAC-011.

A final institutional sign-off step is **not included in the default workflow**. Whether such a step exists is unresolved under AW-I05. The MVP's completion calculation follows AW-004. For the fictional demo only, DA-11 supplies a testable completion condition: an applicable mandatory item is satisfied when its individual status is `Approved`. This does not resolve the real institution-specific completion condition, which remains open under CR-I05/AW-I06.

## 1.2 Guiding design principles

- Represent offices, requirements, applicability, and labels as configurable data rather than hardcoded institution-specific policy.
- Keep business logic and status calculation in the backend (AW-008).
- Preserve the historical meaning of a clearance record (RH-001 to RH-007) without prescribing the unresolved technical implementation method (TD-R09).
- Keep baseline unknowns visibly unknown. A demonstration setting is not proof of an institutional rule.
- Build the smallest integrated workflow that satisfies the essential MVP features before optional enhancements (MVP-017).

## 1.3 Baseline feature coverage

The 12 essential feature areas remain those in MVP-002 through MVP-013: account/role management, student academic information, program/department management, office management, requirement configuration, requirement assignment, instructor processing, office processing, student monitoring, overall completion tracking, Argon2id, and role-based access control. Detailed mappings are in the companion Traceability Crosswalk.

---

# 2. Authority, evidence, and labels

## 2.1 Authority order

1. **Requirements Baseline 0.1 as applied through CHG-001 and CHG-002** — authoritative project requirements and unresolved-question register.
2. **Owner-established project constraints and decisions** — authoritative only within their recorded scope.
3. **This specification v0.3** — owner-approved on 2026-11-07 as the working MVP specification. Its individual Proposed, Conditional, Open, and Deferred items retain those qualifications; adoption is not blanket approval of every behavior.
4. **Demo assumptions and fictional sample data** — temporary test scaffolding only.
5. **External college/university examples** — background illustrations only; not evidence of `Sample College` policy.

## 2.2 Labels used in this document

| Label | Meaning |
|---|---|
| **Baseline-derived** | Directly organizes a topic already covered by a baseline requirement or acceptance criterion. The exact baseline ID is cited. |
| **Owner-established** | A project decision supplied by the owner and recorded in the applied baseline/decision pack. |
| **Proposed** | Product behavior suggested to make the prototype coherent; remains subject to owner/team review where marked Proposed and must not contradict an open baseline item. Adoption of v0.3 as the working foundation does not blanket-approve every proposed behavior. |
| **Demo assumption** | Fictional setting or test fixture used only to demonstrate a flow. It is replaceable and not a statement about institutional practice. |
| **Conditional** | Implement only if the linked baseline question is answered in a way that requires it and the owner/team approves the resulting scope. |
| **Open** | Unresolved in the baseline. This specification does not decide it. |
| **Deferred** | Excluded from the default MVP; reconsider only through explicit scope/change control. |

## 2.3 Project constraints carried forward

| Area | Current project position | Authority / caveat |
|---|---|---|
| Student client | Android, Java, Android Studio | Owner-established stack choice; test on team devices. |
| Staff/admin client | React + Vite | Owner-established stack choice. |
| Backend | Node.js + Express | Owner-established choice; suitability and team compatibility remain subject to TD-011/M3 evidence. |
| Database | PostgreSQL | Owner-established choice. |
| Communication | REST API + JSON | Owner-established starting choice; detailed API contract remains to be designed. |
| Password handling | Argon2id through backend `argon2` package | Baseline-established; runtime/package tests on all team machines still need evidence. |
| Version control | Git + GitHub | Owner-established. |
| Repository visibility | Public repository required per owner's report of instructor requirement | Public release remains gated by TD-020 and TD-R17; no claim that release review is complete. |
| Test data | Fictional/student-demo data only | MVP-015. Do not use real student/personal data or restricted institutional material. |
| Production coding | Team writes and tests production code | AI support is explanation, analysis, planning, review, and documentation unless owner expressly asks otherwise. |
| Institution identity | `Sample College` in this draft | Actual school naming in public artifacts remains unresolved for publication purposes (TD-020, TD-R17); this file intentionally avoids naming a real institution. |

## 2.4 External background examples

The following institutional URLs are retained only as candidate background pointers. The source contents, specific page references, and current validity were **not reverified during this v0.3 correction pass**. Do not rely on the summaries from v0.2 as verified claims until the source itself is checked:

- University of Rizal System, [Academic Manual PDF](https://www.urs.edu.ph/PDF/URSCode/URSAcademicManual.pdf).
- Central Colleges of the Philippines, [College Student Manual 2023 PDF](https://www.ccp.edu.ph/pdf/CCP_College_Student_Manual_2023.pdf).
- University of the Philippines Open University, [Application for University Clearance](https://registrar.upou.edu.ph/application-for-university-clearance/).
- University of the Philippines Manila, [University Clearance Processing](https://osa.upm.edu.ph/node/313).

These links do not establish a national standard or the process of `Sample College`. No claim about the project institution's own clearance policy or the existence/nonexistence of a clearance form is made here. Verify exact page/section details and current validity before using any source-specific statement.

## 2.5 Demo assumptions

All items below are temporary demo settings. Each one must be explicitly accepted by the team before it is treated as a project implementation choice.

| ID | Demo assumption | Baseline relationship / boundary |
|---|---|---|
| DA-01 | Use one fictional clearance cycle associated with one sample academic period. | MVP-016; AS-001 to AS-007. |
| DA-02 | An administrator selects fictional student records for request generation. No SIS import/integration is used. | MVP-015/016; RP-M12; AS-008/AS-I08. |
| DA-03 | Applicability examples use all students, selected program, year level, or sample student classification where configured. | CR-005/007/009; SC-002/003; AS-008. The actual values remain open. |
| DA-04 | The demo begins with no forced approval sequence between requirement owners. | AW-009/010 and AW-I01. This is a provisional demo default, not institutional procedure. |
| DA-05 | For each requirement included in a template, `remarkRequiredOnReject` is stored on that template-requirement association and defaults to `UNSPECIFIED`. In the demo test harness, `UNSPECIFIED` and `OPTIONAL` both permit a rejection with or without a remark; `REQUIRED` blocks rejection without a non-empty remark. | AW-007 placeholder `[REMARK_REQUIRED_ON_REJECT]`. `UNSPECIFIED` means no policy/configuration choice has been made; `OPTIONAL` means the team explicitly selected permissive demo behavior. Their runtime behavior is the same, but their documentary meaning differs. A test setting does not confirm school policy. |
| DA-06 | Each demo student account and staff account has one sample role assignment. | RP-I03 remains open; the demo does not decide whether real users may hold multiple roles. |
| DA-07 | The demo uses the Student, Instructor/Faculty Member, Administrative Office Personnel, and System Administrator roles. | The remaining baseline role values stay in the role catalog; their use depends on RP-I01/RP-I02. |
| DA-08 | Student Regular/Irregular may appear as fictional classification values. | SC-002 supports configurable classification; SC-I01 to SC-I03 leave real classifications and their effects open. |
| DA-09 | Students view their clearance and staff remarks; student submission/recovery actions are not added. | RP-M02 to RP-M04; AW-013; AW-012 remains open. |
| DA-10 | The first demo does not require student file uploads, online payments, email/SMS/push notifications, or external systems. | MVP-017/024/026; CR-010 and NFR unknowns. |
| DA-11 | For fictional demo data only, an applicable mandatory requirement is satisfied when its individual status is `Approved`; `Pending` and `Rejected` are not satisfied. Optional requirements do not affect overall completion. | Makes the AW-004 completion calculation demonstrable for MAC-009 without resolving the actual completion condition in CR-I05/AW-I06. This is not institutional policy. |

---

# 3. Scope and success measures

## 3.1 In scope for the core MVP

- User accounts, fixed role catalog, and backend permission enforcement.
- Minimum student academic data used for clearance applicability.
- Academic periods, departments/programs, and fictional classifications as configurable records.
- Administrative offices and staff-to-office assignments.
- Reusable clearance requirement definitions and templates.
- Simple applicability configuration; preview is optional and may follow the core workflow.
- Generation/assignment of student-specific clearance records.
- Instructor and administrative-office review queues and decisions.
- Student Android view of their own requirements and remarks.
- Backend-derived overall completion information.
- History needed to preserve previous processing outcomes and important context.
- Argon2id password hashing and basic role-based access control.
- Documentation and tests for Ubuntu/Windows setup and the integrated workflow.

## 3.2 Deferred, conditional, or excluded

| Feature | Treatment | Reason / baseline reference |
|---|---|---|
| Department personnel and department head work queues | Conditional; not exercised by default | RP-I01/RP-I02 open; RP-M08/RP-M09 conditional; MVP-018 optional. |
| Final sign-off by registrar or another authority | Not in default workflow; decision pending | AW-I05 open; do not redefine MAC-009. |
| Mandatory rejection remarks | Not assumed; configurable test behavior only, scoped per template-requirement association | AW-007 unknown. |
| Reopening/rejection recovery | Deferred; history requirement retained | AW-012/AW-I04 open; RH-007 provisional. |
| Cancellation of requests | Deferred | Not required by baseline; no default `Cancelled` status. |
| Multiple roles per user | Open, not assumed | RP-I03 unknown. |
| Requirement snapshot implementation | Open technical choice | TD-R09; preserve history per RH-001 to RH-005 without choosing columns/JSON/versioning strategy here. |
| Approval order / prerequisites | No forced sequence in demo unless configured for test; actual order open | AW-009/010; AW-I01 open. |
| Bulk approval | Deferred | MVP-020 and AW-014. |
| Search/filtering of lists | Should, after the core workflow | MVP-019. |
| Activity-history screen | Optional/deferred; history data remains distinct from the screen | MVP-021 and RP-M16. |
| Notifications | Deferred | MVP-022. |
| Report export | Deferred; no export function is included in the current draft | MVP-023 specifically covers report export. |
| Student file/proof uploads | Deferred | MVP-024 and CR-010. |
| In-app progress counters | Optional display convenience only; not report export | No direct baseline requirement is claimed. |
| Real SIS, finance, library, HR, or student system integration | Out of scope | MVP-026 and school-specific data-source questions. |
| Payment processing / automated balance calculation | Out of scope | Staff record the review outcome manually in fictional demo data. |
| Legally binding e-signatures, biometric approval, AI decision-making | Out of scope | Not part of baseline essentials. |
| Performance SLA / 3-second target | Not specified | Baseline NFR-013 is an open load/response question. |
| Accessibility/language target and Android OS minimum | Not specified here | NFR-015 and NFR-016 remain open. |

## 3.3 Demonstration success

The core demonstration succeeds when the team can show a fictional administrator configuring the data, create student requirements through the backend, process assigned items as instructor/office accounts, persist the results in PostgreSQL, display them in Android, calculate the overall completion condition according to the selected demo rule, and demonstrate allowed/denied actions. This should produce evidence for the existing MAC-001 through MAC-011, not new versions of those criteria.

---

# 4. Roles and permission model

## 4.1 Baseline role catalog

Retain the six baseline role values in the conceptual role catalog. Keeping a role value available does **not** assert that the actual institution has that role or uses the associated workflow.

| Baseline role value | Baseline treatment | Default demo treatment |
|---|---|---|
| Student | Baseline role RP-001 | Exercise. Student can view own clearance information. |
| Instructor / Faculty Member | Baseline role RP-001 | Exercise. Instructor handles assigned subject/section/student requirements only where the demo configuration establishes an assignment. |
| Administrative Office Personnel | Baseline role RP-001 | Exercise. Office staff handles requirements assigned to their office/user. |
| Department Personnel | Baseline role RP-001 | Retain value in role catalog; conditional, not exercised unless RP-I01/RP-I02 are answered. |
| Department Head | Baseline role RP-001 | Retain value in role catalog; conditional, not exercised unless RP-I01/RP-I02 are answered. |
| System Administrator | Baseline role RP-001 | Exercise. Manages sample accounts/configuration and assignments. |

The baseline role catalog is not permission for every role to perform every action. The project must define a permission matrix using RP-004 to RP-006. Department permissions must not be fabricated while RP-I01/RP-I02 remain unknown. Instructor responsibilities must remain visible and must not be hidden under a generic `Clearance Officer` role. In particular, retain IR-001 and treat subject/section/student assignment mechanisms as conditional under IR-003/IR-I03 and related academic-structure questions.

## 4.2 Multiple roles per user

Whether one person may hold several roles remains unknown under RP-I03. The data model must not silently lock the product into either single-role or multi-role-per-user policy. For the demo only, each account uses one sample role (DA-06); this is test scaffolding, not an institutional answer.

## 4.3 Default demonstration permission matrix

| Action | Student | Instructor | Office personnel | System administrator | Department roles |
|---|:---:|:---:|:---:|:---:|---|
| Sign in / view own account | Yes | Yes | Yes | Yes | If enabled by configuration |
| View own clearance items/remarks | Yes | No by default | No by default | Administrative view per permission | Not specified |
| View assigned students/requirements | No | Yes, assigned scope only | Yes, assigned office scope only | Administrative configuration/monitoring scope | Conditional |
| Approve/reject assigned requirement | No | Yes, assigned scope | Yes, assigned office scope | Not assumed; requires explicit permission | Conditional |
| Manage user accounts/roles | No | No | No | Yes | No by default |
| Manage academic sample data | No | No | No | Yes | No by default |
| Manage offices/requirements/templates | No | No | No | Yes | No by default |
| Generate/assign student requirement records | No | No by default | No by default | Yes | Conditional only if approved |
| Final sign-off | Not in default workflow | Not in default workflow | Not in default workflow | Not in default workflow | Not in default workflow |

Enforce access on the backend for every protected action (RP-004). Hiding a control in the interface is not authorization. No user receives administrator privileges by assumption (RP-005).

---

# 5. Generic configurable clearance data

## 5.1 Configuration model

The system stores offices, requirement definitions, academic periods, programs, classifications, templates, and applicability settings as data. The application must not hardcode an institution's office names or clearance policies. A clearance template associates reusable requirement definitions with a cycle or academic period. A student-specific clearance record is created from the applicable template entries.

The design must distinguish:

- **Reusable requirement definition:** the configured meaning of a requirement.
- **Template membership/configuration:** where and under what applicability it is used.
- **Student-specific clearance item:** the current processing record for one student.
- **History/audit information:** what was applicable and what happened over time.

The baseline requires historical records to survive changes (RH-001 to RH-005). It does not decide the physical technique. No immutable snapshot schema or serialized snapshot format is selected in this draft; that choice remains subject to TD-R09. The team must design a method that satisfies the history requirements after that decision is resolved.

## 5.2 Fictional sample offices

Use a small, replaceable set in sample data. This list is illustrative, not institutional policy.

| Sample office | Fictional example of what its staff may check |
|---|---|
| Library | Whether an assigned library accountability has been resolved. |
| Laboratory / Shop | Whether assigned equipment/accountability has been resolved for applicable programs. |
| Cashier / Finance | Whether a manually recorded financial-accountability check is satisfied. No payment is processed by the MVP. |
| Student Affairs | Whether a configured student-affairs check has been processed. |
| Class Adviser | Whether a configured class/adviser check has been processed. |
| Registrar | Whether a configured records-related check has been processed. |

Add/remove/rename offices through data configuration. A historical record must not lose its meaning when a referenced office is renamed or retired (RH-001 to RH-006). Exact offices and signatories remain OF-I01 to OF-I05.

## 5.3 Sample requirements

| Sample requirement key | Office | Demo instruction | Applicability example |
|---|---|---|---|
| DEMO-LIB-01 | Library | Review the fictional library-accountability record and record the result. | All demo students |
| DEMO-LAB-01 | Laboratory / Shop | Review the fictional laboratory-accountability record. | Selected sample programs |
| DEMO-FIN-01 | Cashier / Finance | Review a fictional finance-accountability flag; do not process payment. | All demo students |
| DEMO-OSA-01 | Student Affairs | Review the configured sample student-affairs item. | Selected students only if configured |
| DEMO-ADV-01 | Class Adviser | Process the assigned class/adviser item. | Students assigned to the sample instructor |
| DEMO-REG-01 | Registrar | Process a configured records check, not a final sign-off. | All demo students if configured |

No actual fine, balance, disciplinary case, unreturned property, or other personal accountability is implied by these demo rows.

## 5.4 Applicability and student classification

Use a limited data-driven applicability model rather than a general-purpose rules engine. Possible dimensions may include program, department, year level, academic period, student classification, or enrollment status where the baseline supports them (CR-005/007/009; AS-008; SC-002/003). The actual list of dimensions, values, criteria, and responsible data source remains open. Regular/Irregular may appear as fictional sample classifications, but actual labels and effects remain SC-I01 to SC-I03.

## 5.5 Instructor assignment

Instructor review responsibilities must remain distinct from office review. A requirement may be assigned to an instructor for a particular student group, subject, or section where the data model and project evidence support it (IR-001, IR-003). The relationship source, exact rules, and actual subject/section structure remain open (IR-I03 and AS-I06/AS-I07). Do not hardcode a guessed assignment rule.

---

# 6. Core workflows

## 6.1 Administrative setup

1. System Administrator signs in.
2. Administrator creates sample academic period, department/program, and optional student classification values.
3. Administrator creates sample offices and staff accounts/assignments.
4. Administrator creates reusable requirement definitions and a template.
5. Administrator selects requirements and configures simple applicability.
6. If the optional preview feature is implemented, the administrator may inspect which requirements would apply to representative fictional students; otherwise, the team verifies applicability through the generated demo records and test results.
7. Administrator activates the template for the sample cycle.

## 6.2 Requirement generation and assignment

1. Administrator selects a configured template/period and fictional student records.
2. Backend evaluates the configured applicability conditions.
3. Backend creates one clearance record for each selected eligible student and the applicable student-specific requirement records.
4. Backend records enough context and history to meet RH-001 to RH-005.
5. Android and the staff web app retrieve the current record and permitted details from the backend.

The exact strategy for versioning, snapshots, or historical links is not prescribed here. It must be decided under TD-R09 and tested against RH-001 to RH-005 before the physical schema is finalized.

## 6.3 Student monitoring

1. Student signs in through Android.
2. Android requests only that student's permitted clearance record(s).
3. Student sees the current requirement list, overall progress/derived display label, and student-visible remarks.
4. Student opens a requirement for its office, description/instructions, current individual status, and any remarks made visible to the student.
5. Student refreshes to retrieve current backend state.

The default workflow assigns the student no action beyond viewing (AW-013 provisional). Do not add file upload, student resubmission, or other recovery actions without resolving AW-012 and related questions.

## 6.4 Instructor or office personnel processes a requirement

1. Staff member signs in to the web application.
2. Backend returns only requirements and student records that the staff member is authorized to process.
3. Instructor/office representative checks the item according to the demo's defined check instruction.
4. Staff records **Approved** or **Rejected** for a pending item.
5. A remark may be recorded. Whether it is mandatory on rejection depends on the explicit `remarkRequiredOnReject` configuration described below; AW-007 remains open.
6. Backend validates permissions, stores the decision and actor/time information, preserves relevant history, and recalculates overall completion.
7. Student sees the updated state through Android.

## 6.5 Rejection remark setting

The `remarkRequiredOnReject` value is configured **per `TemplateRequirement` association**: it applies to one requirement as included in one clearance template, and therefore to all student records generated from that template inclusion. It is not a global system setting and is not stored on the reusable `ClearanceRequirementDefinition`. The same definition may have a different setting when included in another template.

The demo configuration may expose these values:

| Value | Behavior | Authority status |
|---|---|---|
| `UNSPECIFIED` | No policy/configuration choice has been made. For an executable demo test, the fallback permits a rejection with or without a remark and records any supplied remark. | Default. This permissive fallback is test-harness behavior only, not a rule inferred from AW-007. |
| `OPTIONAL` | A rejection may be recorded with or without a remark. | Explicit demo setting. Runtime behavior matches `UNSPECIFIED`; the difference is documentary: the team has explicitly selected the permissive demo behavior. |
| `REQUIRED` | Backend refuses a rejection unless a non-empty valid remark is supplied. | Explicit demo/test setting only unless institutionally confirmed. |

`UNSPECIFIED` and `OPTIONAL` have the same runtime validation in this prototype; they are retained as separate values solely to distinguish an unresolved choice from an explicit demo choice. A reviewer may test all three values. Do not present any setting as the real school's rule unless AW-007 is answered and approved. Any remark shown to a student should be concise and should not expose unnecessary sensitive information.

## 6.6 Rejection history and later outcomes

The workflow for what happens after rejection remains open under AW-012 and AW-I04. The system's history design must nevertheless avoid overwriting an earlier rejection if another outcome is later recorded through an authorized process (RH-007, provisional). This specification does not prescribe who may reopen a rejected item, whether it returns to Pending, whether the student must act, or whether a decision may be revoked. Those actions are not part of the default demo workflow.

## 6.7 Final sign-off

No final-signoff step is included in the default workflow. AW-I05 remains open. The default demo stops at the system's backend completion calculation under AW-004. Do not add a Final Approver role, final approval queue, `Ready for Final Approval`, `Cleared`, or mandatory final action until an instructor/registrar or other authorized source clarifies AW-I05 and the owner/team explicitly approves the resulting requirement. If a sign-off is confirmed, treat it as a scoped extension and preserve MAC-009's original meaning.

---

# 7. Status and business-rule model

## 7.1 Individual requirement status

The baseline's provisional starting set in AW-003 is retained for demonstration:

| Individual status | Meaning |
|---|---|
| `Pending` | No current decision has been recorded for the applicable requirement. |
| `Approved` | The responsible reviewer recorded that the requirement's configured completion condition is satisfied. |
| `Rejected` | The responsible reviewer recorded that the requirement is not currently satisfied. |

These are item-level statuses. The exact satisfaction condition for each actual requirement remains CR-I05/AW-I06; do not universalize a single real-world criterion for all offices.

## 7.2 Overall completion and display labels

AW-002 requires the system to distinguish individual status from overall status. AW-004 governs completion: overall clearance is complete only when **every applicable mandatory requirement has satisfied its completion condition**. For the fictional demonstration only, DA-11 defines that condition as individual status `Approved`; therefore TS-11 and MAC-009 can be exercised without pretending the institutional rule is known. The actual institution-specific completion predicate remains open under CR-I05/AW-I06.

The labels below are proposed **derived display conveniences**, not baseline-defined status values, and should not be treated as an approved institutional workflow enum:

| Proposed display label | Derived display meaning | Important qualification |
|---|---|---|
| `In Progress` | At least one applicable mandatory item is not yet satisfied and no applicable mandatory item is currently Rejected. | A UI label only; not a baseline status. |
| `Needs Attention` | At least one applicable mandatory item is currently Rejected. | A UI label only; not a baseline status. |
| `Requirements Complete` | Every applicable mandatory item satisfies the configured completion condition; for the default fictional demo, DA-11 means each such item has status `Approved`. | Display wording for AW-004 only. DA-11 is not institutional policy. Do not equate this label with registrar sign-off or issuance of a certificate. |

A progress fraction such as `3 of 5 required items approved` is also a computed display value. Optional requirements should not change the AW-004 mandatory-completion predicate. If configuration produces no applicable mandatory requirements, the system should flag the template/configuration for administrator review rather than assuming automatic completion; this is a proposed validation safeguard, not an institutional rule.

Do not persist `Ready for Final Approval`, `Cleared`, or `Cancelled` as default overall states in the core MVP. Those imply unresolved final sign-off or cancellation semantics. If the UI stores a compact state for technical reasons, distinguish internal implementation fields from baseline-defined policy labels and document the mapping.

## 7.3 Business rules

All rules with an open/conditional baseline dependency are qualified accordingly. The crosswalk provides the exact references.

| ID | Proposed business rule | Status |
|---|---|---|
| MSPEC-BR-01 | Only authenticated and authorized users may access protected operations. | Baseline-derived: RP-004/RP-005. |
| MSPEC-BR-02 | Students may retrieve only their own permitted clearance records and student-visible remarks. | Baseline-derived: RP-M02 to RP-M04; access details remain governed by RP-004. |
| MSPEC-BR-03 | Instructors and office personnel may process only assigned requirements within their approved record scope. | Baseline-derived; assignment detail must align with IR-001/IR-003 and OF-002. |
| MSPEC-BR-04 | Every approval/rejection endpoint checks the authenticated actor and the relevant assignment/permission on the backend. | Baseline-derived: RP-004. |
| MSPEC-BR-05 | Rejection remark validation follows the `remarkRequiredOnReject` value stored on the relevant `TemplateRequirement`; default is `UNSPECIFIED`. `UNSPECIFIED` and `OPTIONAL` permit either outcome in the demo, while `REQUIRED` requires a non-empty remark. | Conditional demo/test behavior; AW-007 remains open. |
| MSPEC-BR-06 | Each processed item records actor, event time, decision, and any remark supplied, subject to the history model approved under TD-R09. | Baseline-derived: AW-005/AW-006/RH-005. |
| MSPEC-BR-07 | The backend is authoritative for item decisions and overall completion calculation. | Baseline-derived: AW-008. |
| MSPEC-BR-08 | Overall completion is true only when every applicable mandatory requirement satisfies its configured completion condition; DA-11 defines `Approved` as satisfied for the fictional demo only. | Baseline-derived: AW-004; real condition remains CR-I05/AW-I06. |
| MSPEC-BR-09 | Completion under AW-004 does not imply a separate final-signoff step. | Required qualification while AW-I05 is open. |
| MSPEC-BR-10 | A student cannot approve or reject a requirement. | Proposed permission boundary derived from role separation/RP-004; verify permissions matrix before implementation. |
| MSPEC-BR-11 | Earlier decisions, including a rejection followed by a later outcome, are not silently overwritten. | Provisional history requirement RH-007; recovery actions remain open under AW-012/AW-I04. |
| MSPEC-BR-12 | Configuration changes must not destroy the historical meaning of existing clearance records. | Baseline-derived: RH-001 to RH-005; implementation approach remains TD-R09. |
| MSPEC-BR-13 | Records that depend on an office, requirement, user, or academic value must retain enough historical reference to remain understandable if that configuration is retired. | Provisional: RH-006; use deactivation/retirement where necessary, but confirm correction/retention policy. |
| MSPEC-BR-14 | The demo should detect accidental duplicate active requests for the same student/template/period, but duplicate resolution policy is not asserted as institutional policy. | Proposed safeguard; no direct baseline rule. |
| MSPEC-BR-15 | Reopen, revoke, cancel, and final-sign-off actions are unavailable in the default workflow until their governing baseline questions are resolved. | Scope guard for AW-I04/AW-I05/AW-012. |
| MSPEC-BR-16 | A decision update and its corresponding history entry must not contradict one another. | Proposed implementation integrity rule; supports AW-005/AW-008/RH-005 and MAC-007/MAC-011. |

---

# 8. Functional requirements

Priorities: **Must** = proposed core-demo need; **Should** = useful but not required to demonstrate the baseline core; **Deferred/Conditional** = do not implement in the default workflow until the linked question is resolved. All detailed requirements below are specification-level identifiers, not new baseline IDs.

## 8.1 Accounts, authentication, and access

| ID | Priority | Requirement |
|---|---|---|
| MSPEC-FR-001 | Must | The system shall allow the authorized System Administrator to create, update, deactivate, and manage user accounts for the demonstration. |
| MSPEC-FR-002 | Must | The backend shall authenticate users and hash/verify passwords using Argon2id. It shall never store plaintext passwords or return password hashes to either client. |
| MSPEC-FR-003 | Must | The backend shall enforce role- and assignment-based authorization on protected operations. Client-side control hiding alone shall not authorize an action. |
| MSPEC-FR-004 | Must | The system shall provide the six baseline role values in its role catalog: Student, Instructor/Faculty Member, Administrative Office Personnel, Department Personnel, Department Head, and System Administrator. The presence of a catalog value shall not imply that the real institution uses that role. |
| MSPEC-FR-005 | Must | Account deactivation shall not erase the actor identity or historical decisions associated with that account. The precise retention/correction treatment remains subject to RH-006/RH-008/RH-009. |

## 8.2 Student and academic records

| ID | Priority | Requirement |
|---|---|---|
| MSPEC-FR-006 | Must | The system shall maintain the minimum fictional student profile fields needed by the configured clearance applicability rules. Candidate fields include student identifier, display name, program, year level, classification, and section where relevant; actual institutional fields remain open. |
| MSPEC-FR-007 | Must | The System Administrator shall be able to create and update fictional student records and associate them with student accounts for the demonstration. |
| MSPEC-FR-008 | Must | The system shall maintain configurable academic periods, departments, and programs used by the clearance configuration. Their real names and structure are not presumed. |
| MSPEC-FR-009 | Should | The system may provide CSV import for fictional sample records after validated manual entry works. This is not SIS integration and must validate rows before saving. |

## 8.3 Offices and requirement configuration

| ID | Priority | Requirement |
|---|---|---|
| MSPEC-FR-010 | Must | The System Administrator shall be able to create, edit, activate, and deactivate sample office records. |
| MSPEC-FR-011 | Must | The System Administrator shall be able to assign authorized staff accounts to offices for the demonstration. Instructor-to-student/subject/section assignment must remain separately represented where applicable. |
| MSPEC-FR-012 | Must | The System Administrator shall be able to create, edit, activate, and deactivate reusable requirement definitions. |
| MSPEC-FR-013 | Must | A requirement definition shall support a display name, instructions/description, responsible office or instructor assignment, and a required/optional flag for the configured demonstration. |
| MSPEC-FR-014 | Must | The System Administrator shall be able to create a clearance template for a configured academic period and select reusable requirement definitions for it. |
| MSPEC-FR-015 | Must | The system shall support only the simple, configured applicability dimensions selected for the demo (for example all students, selected programs, year levels, or sample classifications). It shall not introduce an arbitrary rule-expression language. |
| MSPEC-FR-016 | Should | The web application may preview which configured requirements apply to representative fictional student profiles before generation. This is an optional safeguard, not a core-MVP prerequisite. |
| MSPEC-FR-017 | Must | The backend shall reject incomplete or internally inconsistent configuration needed for request generation and provide a useful validation response. |

## 8.4 Assignment and student-specific records

| ID | Priority | Requirement |
|---|---|---|
| MSPEC-FR-018 | Must | The System Administrator shall be able to select a configured template/period and fictional students for requirement generation. |
| MSPEC-FR-019 | Must | The backend shall evaluate applicability and create student-specific requirement records for the requirements that apply to each selected student. |
| MSPEC-FR-020 | Must | The system shall preserve enough historical context to determine which configured requirement, responsible party, applicability, and decision were associated with an existing student record after later configuration changes. The technical method (versioning, snapshots, references, or another design) remains open under TD-R09 and must be assessed against RH-001 to RH-005. |
| MSPEC-FR-021 | Should | The demo should detect an attempt to create an accidental duplicate active request for the same student/template/period and show a safe validation message. Replacement/cancellation policy is not defined here. |
| MSPEC-FR-022 | Deferred | Request cancellation and cancellation-history workflow are excluded from the default MVP until authority, allowed states, effects on requirements, and history rules are specified and approved. |

## 8.5 Instructor and office review

| ID | Priority | Requirement |
|---|---|---|
| MSPEC-FR-023 | Must | The web application shall show instructors and office personnel the requirements they are authorized to process. |
| MSPEC-FR-024 | Must | An authorized reviewer shall be able to view the student and requirement information needed to perform the assigned check, subject to record-access permissions. |
| MSPEC-FR-025 | Must | An authorized instructor or office representative shall be able to record `Approved` for a pending assigned requirement. |
| MSPEC-FR-026 | Must | An authorized instructor or office representative shall be able to record `Rejected` for a pending assigned requirement. Remark validation shall follow the `remarkRequiredOnReject` value on the relevant `TemplateRequirement`; the default is `UNSPECIFIED` because AW-007 is open. |
| MSPEC-FR-027 | Must | The system shall record the decision result, actor, event time, and any remark supplied, and shall make student-visible remarks available to the student's Android view. |
| MSPEC-FR-028 | Deferred | Reopening, rechecking, or reversing a rejected requirement is not part of the default workflow. Any later outcome must be preserved in history if an authorized process is eventually defined (RH-007). |
| MSPEC-FR-029 | Must | The backend shall reject a review operation when the actor lacks the role, assignment, or record permission required for that requirement. |

## 8.6 Student monitoring and overall completion

| ID | Priority | Requirement |
|---|---|---|
| MSPEC-FR-030 | Must | The Android app shall show a signed-in student their own permitted active clearance record and the derived overall progress information. |
| MSPEC-FR-031 | Must | The Android app shall show each assigned requirement's office/responsible party, instructions/description, individual status, and student-visible remarks. |
| MSPEC-FR-032 | Must | The system shall show a progress count for applicable mandatory requirement items, such as approved/satisfied items out of total applicable mandatory items. The count must use the backend's completion rule. |
| MSPEC-FR-033 | Must | The backend shall calculate overall completion using AW-004: every applicable mandatory requirement must satisfy its configured completion condition. The actual institution-specific completion predicate remains open under CR-I05/AW-I06. |
| MSPEC-FR-034 | Conditional / Deferred | A separate final-signoff eligibility state or queue may be considered only if AW-I05 confirms that the real workflow includes final sign-off. It is not a default status or requirement and is not needed to satisfy MAC-009. |
| MSPEC-FR-035 | Conditional / Deferred | A final approver action to clear/return a request may be specified only after AW-I05 and the authority/return rules are confirmed and owner/team-approved. No such action is required in the default MVP. |
| MSPEC-FR-036 | Conditional / Deferred | A student-facing final `Cleared` label or output may be added only after AW-I05/AW-I08 define the final step and its output. `Requirements Complete` under AW-004 must not be mislabeled as institutional final clearance. |

## 8.7 History and optional reporting

| ID | Priority | Requirement |
|---|---|---|
| MSPEC-FR-037 | Must | The system shall preserve the relevant history of requirement configuration, assignment, processing outcomes, and later outcomes where they occur, consistent with RH-001 to RH-007. The storage/retention/correction method remains subject to TD-R09 and RH-008/RH-009. |
| MSPEC-FR-038 | Must | Processing history shall identify the actor and event time where required by AW-005 and RH-005. |
| MSPEC-FR-039 | Should | The staff/admin web application may provide basic filtering by academic period, program, student, responsible office, and derived display label after the core workflow works. |
| MSPEC-FR-040 | Should | The web application may display counts using derived labels such as `In Progress`, `Needs Attention`, and `Requirements Complete`. These are presentation conveniences derived from current item data, not baseline-defined overall status values. |

---

# 9. Quality requirements and constraints

The following specification identifiers are deliberately separate from baseline `NFR-001…NFR-017`. Do not copy these IDs into the baseline. The related baseline rows remain authoritative, including all open values.

| ID | Quality area | Specification-level requirement | Baseline relation |
|---|---|---|---|
| MSPEC-NFR-001 | Password security | Hash/verify with Argon2id in backend only; do not store plaintext passwords or expose hashes. | NFR-001 to NFR-004; TD-006. |
| MSPEC-NFR-002 | Authorization | Check role, assignment, and record access on the server for every protected action. | RP-004 to RP-006. |
| MSPEC-NFR-003 | Demo data protection | Use fictional data and accounts; do not commit real student data or restricted school material. | MVP-015; TD-020. |
| MSPEC-NFR-004 | Secret handling | Keep database/API credentials out of source control; use environment variables and safe `.env.example` placeholders. | NFR-007/NFR-008; TD-017. |
| MSPEC-NFR-005 | Input validation | Validate identifiers, required fields, allowed individual decisions, remark configuration, and input length/format on the backend. | NFR-005; supports MAC-010. |
| MSPEC-NFR-006 | Database access | Use parameterized queries or a safe data-access layer; do not concatenate untrusted input into SQL. | NFR-006. |
| MSPEC-NFR-007 | History integrity | Preserve relevant processing/configuration history and do not log secrets or password data. | RH-001 to RH-009; NFR-002/NFR-008. |
| MSPEC-NFR-008 | Status consistency | Backend/PostgreSQL are authoritative; Android and web display values returned by backend rather than implementing separate business calculations. | AW-008; NFR-010; MAC-007/008/009. |
| MSPEC-NFR-009 | Repository structure | Organize the combined project under the approved `android/`, `backend/`, `web/`, and `docs/` areas. | TD-012/TD-013. |
| MSPEC-NFR-010 | Configuration | Store offices, requirements, templates, and applicability as data rather than hardcoded office-specific branches in client logic. | CR-001/CR-005/CR-009; NFR-010. |
| MSPEC-NFR-011 | Portability | Provide separately labeled setup instructions for Ubuntu and Windows and verify on all three team machines before claiming compatibility. | NFR-009; MAC-001; TD-011. |
| MSPEC-NFR-012 | Maintainability/API clarity | Use readable names, consistent API response conventions, and a single backend source for clearance business logic. | NFR-010; TD-014. |
| MSPEC-NFR-013 | Documentation integrity | Documents must distinguish proposed, implemented, tested, verified, and approved states; do not claim results without recorded evidence. | NFR-011/NFR-012; TD-019. |
| MSPEC-NFR-014 | Status communication | Use clear item status and explanatory student-visible remarks; label overall status strings as derived display labels unless baseline policy defines them. | AW-002/AW-003/AW-006; NFR-015 remains open for accessibility/language needs. |

**Explicitly not specified:** concurrent-user/load expectations and response-time targets (baseline NFR-013); accessibility and language needs (baseline NFR-015); minimum Android version/device targets (baseline NFR-016); demonstration hosting environment (baseline NFR-017). No 3-second target or other invented performance threshold is adopted here.

---

# 10. Conceptual data model (not a finalized schema)

This section describes concepts and relationships only. It does not select a snapshot implementation or resolve open cardinalities.

| Conceptual entity | Purpose | Open/conditional points |
|---|---|---|
| UserAccount | Login identity, credential hash, account state. | Account creation details RP-I04; authentication mechanism TD-R01. |
| RoleCatalog | Six baseline role values and their permissions. | Actual roles in use RP-I01; department role activity RP-I02; multiple roles per user RP-I03. |
| StudentProfile | Minimum student information used for clearance. | Actual fields and source AS-008/AS-I08. |
| Department / Program | Academic structure used for applicability. | Names/hierarchy AS-I01 to AS-I03; not presuming one department model. |
| AcademicPeriod | Academic year/semester or another configured period. | Term structure AS-I05. |
| StudentClassification | Configurable values such as fictional Regular/Irregular. | Actual list and effect SC-I01 to SC-I03. |
| Office | Configurable administrative office/unit. | Real list/signatories OF-I01 to OF-I05. |
| StaffOfficeAssignment | Connects authorized staff to offices and allowed processing scope. | Exact staff/office assignments and instructor mapping remain subject to IR-I01 to IR-I05. |
| ClearanceRequirementDefinition | Reusable definition of one check. | Requirement owner and completion condition CR-I01 to CR-I05. |
| ClearanceTemplate | Selected reusable requirements and applicability for a cycle. | Template/versioning method and history implementation TD-R09. |
| TemplateRequirement | Connects a definition to a template, required flag, applicability settings, and the per-template-inclusion `remarkRequiredOnReject` value. | The reject-remark value is not global and not stored on the reusable definition; applicability dimensions CR-005; history approach open. |
| ClearanceRequest | One student's participation in one clearance cycle/template. | Overall display labels are derived; final sign-off unknown AW-I05. |
| ClearanceRequirementRecord | Student-specific processing item for a requirement. | How historical context is retained is open TD-R09; no prescribed immutable snapshot. |
| ProcessingHistoryEvent | Stores item outcomes and actor/time/remarks over time. | Reopen/revocation process open AW-I04/AW-012; RH-007 history expectation provisional. |
| AuditEvent | Records relevant administrative/security activity without secrets. | Retention/correction unknown RH-008/RH-009. |

## 10.1 Relationships to discuss during design

- A program may be linked to a department or another configured academic grouping.
- A student profile may reference program/year/classification/section fields only when applicable.
- An office can own many reusable requirement definitions.
- A template includes multiple requirements with applicability settings.
- A student can have more than one clearance request over time.
- A clearance request has one or more student-specific requirement records.
- A requirement record may have multiple processing history events.
- The implementation must retain enough information to satisfy RH-001 to RH-007, but the exact reference/version/snapshot technique is an open design decision (TD-R09).

---

# 11. Application architecture and API responsibilities

## 11.1 High-level architecture

```text
+----------------------------+       +-----------------------------+
| Android Student App        |       | React + Vite Staff/Admin Web |
| Java / Android Studio      |       | Browser                     |
+--------------+-------------+       +--------------+--------------+
               | REST + JSON                         | REST + JSON
               +--------------------+----------------+
                                    |
                         +----------v----------+
                         | Node.js + Express   |
                         | Backend API         |
                         | - Authentication    |
                         | - Authorization     |
                         | - Clearance rules   |
                         | - Status calculation|
                         | - History recording |
                         +----------+----------+
                                    |
                         +----------v----------+
                         | PostgreSQL          |
                         +---------------------+
```

## 11.2 Responsibility boundaries

**Android student client** presents only the signed-in student's permitted data, current individual statuses, progress, and remarks. It does not calculate policy or authorize decisions.

**React/Vite staff/admin client** presents role-aware configuration and review screens. It does not independently determine whether a clearance is complete.

**Node/Express backend** authenticates users, enforces access rules, validates input, assigns applicable items, processes decisions, derives overall completion, and records history.

**PostgreSQL** stores accounts, role values/assignments, academic sample records, offices, requirements/templates, student-specific clearance records, and history. The physical schema remains to be designed after the open decisions and data model review.

## 11.3 API groups (design outline only)

- `/auth` — sign-in/sign-out and session/token operations after TD-R01 is decided.
- `/users` and `/roles` — account/role configuration, restricted to authorized admin.
- `/students`, `/programs`, `/departments`, `/academic-periods` — academic sample records.
- `/offices` and `/staff-assignments` — office configuration and assignment.
- `/requirements` and `/templates` — reusable requirement definitions and templates.
- `/clearance-requests` — generate and retrieve student-specific clearance records.
- `/review-items` — assigned instructor/office work queues and decision submissions.
- `/history` — permitted history retrieval.

Exact endpoint paths, methods, payloads, error format, pagination, and token/session mechanism are not approved in this specification. Business logic stays in backend services/controllers, not duplicated into Android and React components.

## 11.4 Authentication remains open

Argon2id hashing is established, but whether the two clients use session-based or token-based authentication remains TD-R01/NFR-014. Do not implement the final authentication protocol until the team has compared browser and Android needs and recorded the decision.

---

# 12. Screen and page inventory

This is a proposed UI inventory to support discussion; it is not a binding design system.

## 12.1 Android student app

| Screen | Purpose | Minimum content |
|---|---|---|
| Sign in | Authenticate a student | Credential inputs and generic error handling. |
| Student home | Summary of own clearance | Academic period, derived overall progress label, count of mandatory items satisfied/total. |
| Requirement list | Show assigned applicable items | Responsible office/instructor, requirement name, individual status, mandatory/optional marker. |
| Requirement detail | Explain an item | Instructions, current status, student-visible remark, permitted history summary. |
| Account/sign out | Manage current app session | Account display and sign out. |

## 12.2 Staff/admin web app

| Page | Purpose | Minimum content |
|---|---|---|
| Sign in | Authenticate staff/admin | Credential inputs and safe error feedback. |
| Dashboard | Role-aware summary | Assigned work and configuration links; display counts derived from current records. |
| User/role management | Maintain sample accounts | Create/update/deactivate users and assign approved role values. |
| Student management | Maintain fictional profiles | Search, add/edit, program/year/classification fields where configured. |
| Academic setup | Maintain periods/programs/departments | Configurable records, no assumed real data. |
| Office management | Maintain office records | Create/edit/activate/deactivate and staff assignment. |
| Requirement management | Maintain reusable checks | Display name, instructions, responsible office/instructor, required flag. Rejection-remark behavior is configured on the template's inclusion of a requirement, not on the reusable definition. |
| Template management | Assemble a clearance cycle | Select period/requirements, applicability, optional preview, and the rejection-remark setting for each included requirement. |
| Request generation | Assign requirements | Select sample students, optionally preview applicability if that feature is implemented, confirm generation. |
| Instructor queue | Process assigned student items | Subject/section/student assignment scope where configured. |
| Office queue | Process office items | Authorized office work only. |
| Review detail | Record decision | Approve/reject, remarks according to configured reject flag, history view. |
| History view | Inspect recorded outcomes | Actor, event time, outcome, remarks, contextual identifiers. |
| Dashboard progress summary (Should) | View in-app progress counts | Derived display labels and counts only; no report export and no final-approval state unless later approved. |

There is no default Final Approval Queue in this draft.

---

# 13. Acceptance-oriented test scenarios

These `TS-*` scenarios supplement the original acceptance criteria. They do not redefine or replace MAC-001 through MAC-011. The companion crosswalk maps each scenario to relevant baseline requirements and MAC criteria. Scenarios that rely on open decisions are marked conditional or limited to history verification.

| Scenario ID | Scenario | Expected result / boundary |
|---|---|---|
| TS-01 | Account sign-in and password security | Correct account can sign in; Argon2id is used by backend; passwords/hashes are not exposed. |
| TS-02 | Unauthorized record/action access | Student cannot read another student's clearance; unassigned staff cannot process an item; backend returns an authorization failure and leaves data unchanged. |
| TS-03 | Office configuration | Administrator creates/activates a fictional office; it becomes available for future requirement setup. |
| TS-04 | Requirement/template configuration | Administrator creates a reusable requirement and adds it to a template with required/optional setting. |
| TS-05 | Optional applicability-preview test | If the optional preview feature is implemented, it shows different eligible requirement sets for fictional student profiles according to explicitly configured demo conditions. This is not a required MAC acceptance test. |
| TS-06 | Requirement assignment and storage | Backend creates student-specific requirement records, writes to PostgreSQL, and exposes the assigned requirements to permitted clients. Test only the history result, not a chosen snapshot architecture. |
| TS-07 | Instructor/office processing | Authorized instructor and office personnel can approve assigned items; actor/time/result are recorded. |
| TS-08 | Per-template-inclusion rejection remark configuration | Set the value on a `TemplateRequirement`. `REQUIRED` blocks a reject without a non-empty remark; `OPTIONAL` permits either; `UNSPECIFIED` also permits either in the demo test harness. The latter two have the same runtime behavior but different documentary meaning. Record the selected test config. |
| TS-09 | Student sees updated state | After a staff decision, student Android retrieves and displays updated individual status and any student-visible remark. |
| TS-10 | History representation of rejection followed by a later outcome (seeded-fixture test) | This is a supplemental backend/database history test, not an application workflow test. After the technical history representation is selected under TD-R09, seed a test database fixture containing an earlier `Rejected` event and a later outcome event, then inspect the persisted history through the approved test query or data inspection. No app action creates the later outcome in the default MVP. Do not infer or test a reopen/recheck mechanism. This test is not a core P4 exit gate. |
| TS-11 | Overall completion calculation | With DA-11 applied to fictional demo data, the backend reports completion only when every applicable mandatory item is `Approved`; any applicable mandatory `Pending` or `Rejected` item prevents completion. Optional requirements do not affect the calculation. No final sign-off is implied. |
| TS-12 | Final sign-off extension | **Not executable in default MVP.** Revisit only after AW-I05 is answered and the extension is separately approved. |
| TS-13 | Unauthorized final sign-off | **Not executable in default MVP.** Revisit only if TS-12 and final authority are approved. |
| TS-14 | Historical context after configuration change | Changing a template/office does not destroy the meaning of existing records. Verify observable history; do not prescribe snapshot implementation. |
| TS-15 | Duplicate generation guard | If implemented as a demo safeguard, duplicate generation is detected and a clear message is shown. This is a proposed behavior, not a baseline policy. |
| TS-16 | Derived overall labels | `In Progress`, `Needs Attention`, and `Requirements Complete` are derived from backend item data; they are not persisted as institutionally mandated states. |
| TS-17 | Cross-client/backend consistency | PostgreSQL/backend state, staff web display, and Android display agree after a decision. |
| TS-18 | Public repository safety | Before public push, review repository files and reachable history for credentials, personal data, restricted college files, unredacted interview notes, and private machine details. |

## 13.1 Minimum fictional test data

- Institution display label: `Sample College`.
- Academic period: `AY 2026–2027 / First Semester` (fictional; replaceable).
- Programs: `BS Information Technology`, `BS Business Administration` (fictional examples).
- Offices: Library, Laboratory/Shop, Cashier, Student Affairs, Registrar (fictional examples).
- Students: `STU-DEMO-001`, `STU-DEMO-002`, `STU-DEMO-003` with invented names.
- Staff: `STAFF-INST-01`, `STAFF-LIB-01`, `STAFF-LAB-01`, `STAFF-ADMIN-01`.
- Use separate fictional records for a regular and irregular student if useful to test configured applicability. These are not asserted to be the institution's classification rules.

Never use real names, student numbers, emails, account balances, discipline information, personal phone numbers, or actual institutional clearance records in the public repository.

---

# 14. Risks and controls

| Risk | Control |
|---|---|
| Demo assumptions mistaken for school policy | Label `DA-*` assumptions; use Sample College; record later owner/institution evidence before changing them. |
| Role model erases instructor responsibilities | Retain all six baseline role values; implement instructor queue distinctly; keep department roles conditional. |
| Open AW-I05 silently becomes mandatory sign-off | No final role, queue, status, or step in default MVP; ask instructor/registrar before extending. |
| AW-007 remark rule is invented | Default `UNSPECIFIED`; demonstrate OPTIONAL/REQUIRED only as explicit test settings. |
| AW-012 reopen process is invented | Defer action; preserve history of previous and later outcomes without specifying how recovery occurs. |
| TD-R09 technical history method is prematurely locked | Preserve required historical meaning; postpone physical design choice until decision is recorded. |
| Derived labels look like policy statuses | Label them as computed UI conveniences; show the item-level facts and progress count. |
| Actual school name/material is published without permission | Keep public files generic; complete TD-020/TD-R17 check before using identity, logo, manual, or staff references. |
| Public repository exposes secrets or real student data | Use fictional data, review files and full Git history, keep local credentials out of commits. |
| Cross-client status differs | Backend is authoritative; both clients retrieve the same API result and TS-17 tests consistency. |
| Stack fails on a team machine | Complete M3 Environment Readiness Checklist and TD-011 package/runtime checks on each machine. |
| Team treats unrun tests as passed | Record actual test evidence; use the progress labels and controls under TD-019. |

---

# 15. Proposed development sequence

The project already reserves **M3** for the Environment Readiness Checklist. This document therefore uses `P` prefixes for proposed product-development stages to avoid confusion.

| Stage | Objective | Exit evidence |
|---|---|---|
| P0 — Requirements agreement | Review this draft, identify accepted demo assumptions, preserve open baseline questions. | Dated owner/team review record; no baseline amendments implied. |
| P1 — Safe repository skeleton | Establish repository structure and app shells; perform publication-safety review before any public push. | Android/web/backend shells start or build on relevant machines; public visibility only after TD-020/TD-R17 gates. |
| P2 — Data and API design | Review conceptual data model and API contract after TD-R01/TD-R09 and relevant academic data decisions are addressed. | Approved design records, data migration plan, API contract. |
| P3 — Administrative configuration and assignment | Configure academic data/offices/requirements/templates and generate fictional student records; optional preview may be added after the core assignment path. | TS-03, TS-04, and TS-06 pass with sample data; TS-05 is optional and does not gate P3. |
| P4 — Instructor and office processing | Implement assigned queues, approve/reject, remark configuration, and the history behavior required by the approved technical design. | TS-07 and TS-08 pass. TS-10 is a supplemental seeded-fixture data-layer test, deferred until TD-R09 selects a history representation; it is not a P4 exit gate. |
| P5 — Student app and progress | Connect Android to API; display assigned requirements and derived progress. | TS-09, TS-11, TS-16, TS-17 pass. |
| P6 — End-to-end acceptance | Run all applicable baseline acceptance tests; exclude conditional scenarios until approved. | Evidence for MAC-001 to MAC-011 and known-issues report. |
| P7 — Handover and presentation | Document setup, limitations, test data, and public-safe demo. | Reproducible team demo; each developer can explain integrated workflow. |

Environment readiness remains its own **M3 Environment Readiness Checklist**. The M3 checklist, TD-011 stack evaluation, TD-R01 authentication decision, and team compatibility tests must not be represented as complete without evidence. Requirements refinement can proceed alongside these checks; it need not block every documentation task.

---

# 16. Feature Definition of Done

A feature is Done only when:

1. Its specification-level requirement is mapped to the relevant baseline requirements and test scenario.
2. The team understands the behavior and open decisions it depends on.
3. Backend validation and authorization are implemented where applicable.
4. Android/web use the backend API rather than duplicate business logic.
5. Relevant positive, negative, and permission tests are run and recorded.
6. Loading, empty, invalid-input, and error states are handled.
7. Required history is preserved without claiming an unapproved storage strategy.
8. Documentation matches actual implementation and test status.
9. Code is reviewed by a teammate and merged through the approved team workflow.
10. No secrets, real student data, restricted documents, or private machine details are included in a public change.
11. Team members can explain the implementation; generated code is not treated as tested until the team has run it.

---

# 17. MVP Definition of Done

The MVP is demonstrably complete when the applicable baseline conditions are satisfied, including:

- All 12 essential baseline feature areas are represented.
- Android student app, React/Vite web app, Node/Express backend, and PostgreSQL work together.
- Admin can configure sample academic data, offices, requirements, and applicability.
- Requirements are assigned to the correct fictional students using backend rules.
- Authorized instructors and office personnel can process assigned items.
- Students can view their own assigned requirements and updated status in Android.
- Backend calculates overall completion according to AW-004 and the explicitly defined demo completion conditions.
- Argon2id and backend permission enforcement are implemented and tested.
- MAC-001 to MAC-011 remain unchanged and each has recorded test evidence.
- Unauthorized and invalid operations are tested.
- Three developers have recorded their own setup/build evidence; one developer's machine is not treated as proof for all.
- The public repository passed publication-safety review before release.
- Final sign-off, reopening, cancellation, and other conditional features are excluded unless separately resolved and approved.

---

# 18. Open decisions and questions

The following are not resolved by this document:

| Baseline item | What remains open | Specification treatment |
|---|---|---|
| AW-I05 | Whether a final sign-off follows individual requirements | No default final approver or final status. Seek instructor/registrar clarification before deciding. |
| AW-I06 / CR-I05 | What counts as a satisfied completion condition for each requirement | Use explicit fictional test criteria for demo only; actual conditions require evidence. |
| AW-007 | Whether rejection requires a remark | `UNSPECIFIED` default; configurable REQUIRED/OPTIONAL only for demo tests. |
| AW-012 | What happens after rejection | No recovery action defined; retain prior outcomes if later outcomes exist. |
| AW-I04 | Whether approval may be revoked/reopened and by whom | No reopen/revoke operation in default MVP. |
| TD-R09 | History/record-preservation mechanism | No snapshot/versioning implementation prescribed. |
| RP-I01 / RP-I02 | Actual role set at the college and department approval responsibilities | Retain six catalog values; demo only four; department roles conditional. |
| RP-I03 | Whether a user may hold multiple roles | Do not prescribe; one role per demo account only. |
| IR-I01 / IR-I03 | Instructor signatory rules and assignment source | Keep instructor queue visible; subject/section assignment remains conditional. |
| AS-I01 to AS-I08 | Real college academic structure, names, program data, and data ownership | Use fictional configurable values only. |
| SC-I01 to SC-I04 | Actual student classifications and effects | Regular/Irregular are demo labels only. |
| OF-I01 to OF-I05 | Actual offices, signatories, scope, applicability, subunits | Sample list only; require official evidence later. |
| TD-R01 / NFR-014 | Session/token authentication mechanism | Open. |
| TD-011 / TD-R12 | Stack readiness and Node version team standard | Candidate/observations are not final standard; require all-machine evidence. |
| TD-R13 to TD-R16 | Windows version manager, Android application ID, repository ownership, PR enforcement | Open/provisional as in decision pack. |
| TD-020 / TD-R17 | Public release review, institutional publication/IP/ownership/licensing rules | Public repo required per owner report; publication must wait for safety/rules review. |
| NFR-013 | Expected load and response time | Not specified. No invented performance target. |
| NFR-015 | Accessibility and language needs | Open. |
| NFR-016 | Minimum Android version/target devices | Open. |
| NFR-017 | Demo hosting environment | Open. |
| SRC-01 | Original project brief location | Listed as Available in baseline but not included in the supplied 18-file archive; locate authoritative copy for complete traceability. |

---

# 19. Glossary

| Term | Plain-language meaning |
|---|---|
| Academic period | A configured school period such as academic year/semester. |
| Applicability | A condition that determines whether a requirement applies to a student. |
| Clearance record | A student's record for a particular clearance cycle. |
| Requirement definition | The reusable description of a check that may be included in a template. |
| Student-specific requirement | One applicable check assigned to one student's clearance record. |
| Derived display label | A UI-friendly description computed from underlying item data; not necessarily an official system status. |
| History/audit event | A record of an important action, outcome, actor, and time. |
| MVP | Minimum Viable Product: the smallest integrated version that demonstrates the essential value. |
| RBAC | Role-Based Access Control: permissions based on assigned roles. |
| REST API | A defined web interface through which applications request or update data. |
| SIS | Student Information System, a broader student/academic administration platform. |
| Template | A reusable configuration of requirements and applicability for a clearance cycle. |

---

# 20. Change control and revision history

The project owner approved this v0.3 specification on 2026-11-07 for use as the working MVP foundation. This adoption does not amend Requirements Baseline 0.1, resolve open institutional or technical questions, or convert every Proposed, Conditional, Open, or Deferred item into an approved requirement. Do not modify the baseline merely to align it with this specification.

For implementation and ongoing review:

1. Review the companion Traceability Crosswalk and Issue Register.
2. Obtain instructor/registrar clarification for AW-I05 and resolve other blockers that affect the first integrated slice.
3. Decide which demo assumptions the owner/team explicitly accepts as prototype-only behavior.
4. Resolve dependencies on TD-R01, TD-R09, and the relevant data/role questions before finalizing authentication or physical schema.
5. Verify each mapping and scenario with the team; the crosswalk is a working traceability aid, not an independent formal verification report.
6. Any future amendment to Requirements Baseline 0.1 must be separately authorized and recorded through the baseline's change-control process, with the exact previous and new text. The existing CHG-003 entry in `docs/change-log.md` records the local demo password convention (`test123`, SRC-20) only; it does not amend the baseline. Add source-register rows for other sources only when they have been obtained, checked, and accepted as relevant, and allocate the next available ID at that time. Do not reserve or preassign source IDs.

| Version | Date | Summary | Status |
|---|---|---|---|
| 0.1 | 2026-11-05 | Initial generic, configurable working specification. | Superseded by later revisions; not separately adopted. |
| 0.2 | 2026-11-05 | Separated identifier namespaces; qualified roles; removed default final sign-off, mandatory rejection remark, reopening, cancellation, and snapshot prescription; added configurable reject remark; renamed product stages; added baseline traceability companion. | Historical review draft; superseded by v0.3. |
| 0.3 | 2026-11-05 | Added demo-only completion condition DA-11; made TS-10 a seeded-fixture backend/database test; scoped reject-remark setting to each TemplateRequirement; clarified UNSPECIFIED/OPTIONAL semantics; downgraded applicability preview to Should; corrected minor traceability, reporting, and source-ID wording. | Approved by the project owner on 2026-11-07 for use as the working MVP specification; individual qualifications and open decisions remain in force. |

**End of document.**

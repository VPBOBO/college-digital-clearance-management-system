# College Digital Clearance Management System (CDCMS)
## MVP Scope Decision and Team Execution Plan

**Document ID:** CDCMS-EXEC-001  
**Version:** 0.3  
**Prepared:** 2026-11-06  
**Status:** Proposed working execution plan; requires team review  
**Project type:** Academic prototype / MVP  
**Team size:** Three developers  
**Public-safe institution label:** `Sample College`

> **Authority and change notice**  
> This plan uses the proposed MVP Requirements Specification v0.3 and its Traceability Crosswalk and Issue Register v0.3 as its only normative specification planning references. The optional final-sign-off variant v0.4 is set aside for this MVP and must not be used as an implementation source. It does not adopt those documents, amend Requirements Baseline 0.1, change `docs/decisions.md`, change `docs/requirements/00-sources.md`, change `docs/change-log.md`, or create or authorize CHG-003. Where this plan recommends a working direction, it is a planning recommendation for owner/team review—not evidence of institutional policy or approval by the college.

---

## 1. Recommended MVP scope decision

### 1.1 Final sign-off is outside the current MVP

The current MVP will demonstrate the core clearance workflow through the backend's completion calculation under AW-004. It will **not** implement a separate institutional final-sign-off stage.

For the current MVP:

- Do not add a `finalSignOffMode` setting to clearance templates.
- Do not add a final-sign-off state machine, final-approver queue, approver assignment, endpoint, or screen.
- Do not add final-sign-off approval, rejection, return, revocation, or reassignment actions.
- Do not add a final `Cleared` label that implies a separate institutional decision.
- Keep MAC-009 unchanged. `Requirements Complete` means only what AW-004 defines; it must not be presented as proof of an additional institutional sign-off.
- Keep TS-12 and TS-13 deferred and outside MVP acceptance. They are not required to pass MAC-001 through MAC-011.

This is a scope decision for the school-project MVP, not a claim that no college uses final sign-off. It avoids implementing an unconfirmed process and keeps the team focused on the required integrated workflow.

### 1.2 Restore AW-I05 as a non-blocking validation to-do

AW-I05 remains open. Ask the instructor or registrar when a suitable opportunity arises:

> After all applicable clearance requirements have been approved by the assigned instructors/offices, is there a separate final sign-off by a Registrar, Dean, department head, or another authorized person before the student is officially considered cleared? If yes, which role performs it, what do they check, and what record or output confirms completion?

The answer is relevant to a future institutional configuration or extension. It is **not a prerequisite** for building or demonstrating the generic fictional workflow. Record the answer as confirmed only when it comes from an appropriate source; otherwise leave AW-I05 unresolved.

### 1.3 Preserve the other open decisions

This scope choice does not resolve the following baseline questions or provisional recommendations. Their status must remain visible in the decision register and project progress file:

| Decision | Current status / required handling |
|---|---|
| **TD-R01** — shared authentication/session strategy | Open / unknown. Decide session-based versus token-based before implementing the production authentication flow. |
| **TD-R09** — template-versus-record history method | Open / unknown. Define the required observable history behavior, then select the technical method before finalizing the physical schema. |
| **TD-011** — stack compatibility and suitability | Established requirement to evaluate, but not yet verified. M3 v1.1 provides component-level environment evidence: separate Express and `argon2` script checks, plus PostgreSQL client/service/readiness checks. Per the reviewed v1.1 contents, it does **not** test a Node process connecting through a PostgreSQL driver. A Node-to-PostgreSQL `pg` driver smoke check is therefore proposed as a separate addition for a future M3 revision; until that check is accepted and run, driver connectivity remains unverified. TD-011 must be concluded from actual results, not from checklist presence alone. |
| **TD-R12 / TD-018** — Node version policy | TD-018 establishes the policy: each npm project declares its supported major version in `engines.node`; `.nvmrc` records the exact development version selected after compatibility testing. Node.js 26.13.0 entered Active LTS on 2026-10-28, but remains a project candidate—not the selected standard—until the team checks its compatibility with the chosen dependencies on all required environments. Do not create or treat `.nvmrc` as final until the checks pass and the team agrees. |
| **TD-R13** — Windows Node version manager | Open / unknown. Each Windows developer must identify the manager, mode, configuration, and whether it resolves the agreed project version file correctly. |
| **TD-R14** — Android `applicationId` | Open / unknown. Decide before creating the Android project; do not invent a college domain or imply institutional ownership. |
| **TD-R15** — GitHub repository owner | Open / unknown. Decide whether a personal account or organization owns the repository, who administers it, and how access is maintained if a member leaves. Resolve before creating the shared remote. |
| **TD-R16** — enforced GitHub branch rules | Recommended / provisional. TD-016's branch-and-PR review convention is established; whether GitHub technically enforces the proposed ruleset after public release remains a separate team decision. |
| **TD-R17** — school publication, IP, ownership, and licensing rules | Open / unknown. Resolve before public release of school-related names, branding, institutional content, or before selecting a license. Do not assume a license. |
| **AW-007** — rejection remark requirement | Institution-specific fact remains open. Use only the explicitly identified fictional demo setting; do not claim the setting is school policy. |
| **AW-I04 / AW-012** — approval revocation, reopening, and reprocessing | Open / unknown. Do not add these actions to the current MVP without a justified decision and approval. |
| **CR-I05 / AW-I06** — institutional completion condition | Open / unknown. DA-11 is a demo-only condition and does not settle institutional policy. |
| **RP-I01 to RP-I03 and related role questions** | Institution-specific roles and assignments remain open. Preserve the established/fixed-role direction; do not invent a custom permission editor. |
| **OQ-017** — project deadline | Unknown. Obtain the actual submission/demo deadline and instructor deliverables at P0 before converting the relative plan into calendar dates. |

TD-R01 and TD-R09 receive explicit short decision time-boxes in Section 4. If either remains unresolved at the end of its time-box, record the blocker and escalate it; do not silently assume an answer or finalize dependent production design. Other institutional questions remain non-blocking unless a specific implementation item depends on them.

---

## 2. Project outcome and implementation boundary

The MVP is a working, integrated demonstration in which:

1. An administrator configures fictional academic data, offices, staff assignments, clearance requirements, templates, and applicability.
2. The backend creates student-specific clearance records for applicable fictional students.
3. Authorized instructors and office personnel process the requirements assigned to them.
4. The backend records decisions and calculates completion.
5. A student sees only their own requirements and progress in the Android application.
6. The team demonstrates and records evidence for the applicable baseline acceptance criteria MAC-001 through MAC-011.

### Owner-established technology direction

| Component | Current direction | Implementation responsibility |
|---|---|---|
| Student application | Android, Java, Android Studio | Student views and API integration; no independent policy calculation. |
| Staff/admin application | React + Vite | Administrative configuration and staff processing screens. |
| Backend | Node.js + Express | API, authorization, validation, business rules, processing decisions, and completion calculation. |
| Database | PostgreSQL | Persistent project data and history, using a design selected after TD-R09 is resolved. |
| API format | REST + JSON | Contract shared by the Android and web clients. |
| Password storage | Argon2id via `argon2`, backend only | Server-side password hashing and verification. |
| Version control | Git + GitHub | Shared source, review, issue tracking, and instructor-visible progress. |

This table records the owner's chosen direction; it does not claim that TD-011 stack readiness has passed. The team must verify the stack on each developer's machine before treating it as ready.

### Explicit MVP exclusions

The current MVP does not include a full Student Information System, real student data, actual payment processing, live financial decisions, biometric processing, AI-based approval decisions, institutional final sign-off, or unconfirmed reopening/revocation/cancellation workflows.

---

## 3. Proposed responsibility split for three developers

The following is a practical starting split, not a rule about who must do what. The team can exchange responsibilities based on skill and availability, but each person should understand the complete workflow.

| Workstream | Primary lead | Main responsibilities | Required collaboration |
|---|---|---|---|
| Backend and data | Teammate A | Express API, authorization, validation, business logic, PostgreSQL integration, requirement assignment, staff decisions, completion calculation, history behavior. | Agree API/data contracts with B and C; review security-sensitive changes with the team. |
| Staff/admin web | Teammate B (provisional) | React/Vite app, admin configuration screens, staff queues, forms, status display, API integration, web-side error/loading states. | Build against the agreed API contract; do not duplicate backend rules. |
| Android student app | Teammate C only if hardware/environment checks pass; otherwise reassign to a compatible teammate | Java Android app, sign-in integration, student-specific requirement list, progress/status display, API integration, Android error/loading states. | The Android lead must have access to a workstation that passes the applicable M3 Android Studio/build checks. A physical Android device is useful for runtime testing but does not replace a compatible build workstation. Reassign or pair after M3 evidence; do not assume the initial allocation is feasible. |
| Shared responsibilities | All three | Requirements walkthrough, API review, test design, code review, integration, setup documentation, acceptance evidence, public-repository safety review, presentation. | Each teammate builds/runs their component and participates in end-to-end testing. |

Avoid making one teammate the only person who understands deployment, integration, or the database. Rotate review and integration duties where practical.


### Production-code ownership agreement

The three-person project team writes, owns, tests, and maintains all production application code. ChatGPT or another AI assistant may support explanation, requirements analysis, documentation, review, troubleshooting, and small examples when requested, but AI-generated production code is not the default and must not be treated as team-owned implementation without explicit owner authorization and team review.

---


## 4. Timeline, deadline gate, and time-boxes

OQ-017 is unresolved, so this plan deliberately does not invent a calendar deadline. At P0, obtain the instructor-confirmed submission date, any demonstration date, required deliverables, and any intermediate review dates. Record these in the team's private planning record; publish only non-sensitive project schedule information if appropriate.

The following are **provisional maximum time-boxes from the team's agreed kickoff (T0)**, not estimates that the entire project will necessarily finish within a fixed number of days:

| Time-box | Focus | Required result / stop rule |
|---|---|---|
| **P0 — one meeting or up to 0.5 working day** | Confirm deadline, deliverables, team availability, MVP scope, and demo assumptions. | Record OQ-017's answer or mark it still blocked and identify who will obtain it. Do not spend multiple days polishing documents before the deadline is known. |
| **P1 — up to 2 working days** | Repository ownership/publication gates, M3 v1.1 checks, the separately identified Node-to-PostgreSQL driver probe proposed for the next M3 revision, minimal project shells, and initial documentation tracking. | Record per-machine results and TD-011 evidence. Do not describe the proposed driver probe as part of M3 v1.1 unless it is formally incorporated in a later M3 version. If public-release permission/safety is unresolved, do not make the remote public; continue only in a controlled local or private staging workspace and mark public release blocked. |
| **P2 — up to 2 working days** | Resolve or recommend decisions for TD-R01 and TD-R09; agree the minimum data/API contracts. | Hold one focused alternatives-and-trade-offs session and one decision/review session. If either decision remains unresolved, document the blocker and explicitly defer its dependent production work rather than silently choosing a design. |
| **First vertical slice — begin no later than the end of P2** | Build the narrow admin → assigned requirement → staff decision → backend completion → Android student view path. | Start implementation promptly. Do not require every possible requirement, office, policy question, or UI screen to be documented before the first running slice. |
| **P3–P5 — iterative slices** | Expand configuration, processing, and student status one end-to-end increment at a time. | At the end of each short iteration, demonstrate a running increment and update tests/progress statuses. Keep optional features out of the critical path. |
| **Final 15–20% of available project time** | Integration, MAC acceptance evidence, defect correction, setup/handover, and presentation. | Freeze feature expansion except for essential acceptance defects. Reserve time for a clean setup and repeatable demonstration. |

After the deadline is known, convert these relative time-boxes into actual dates. If the available time is shorter than the team's initial estimate, reduce breadth (for example, number of sample offices and optional screens) and preserve the core end-to-end workflow, authorization, data integrity, and acceptance evidence. Do not remove publication-safety checks or claim unrun tests as passed merely to meet a date.

**Do not describe M3 v1.1 as a combined Express + PostgreSQL + `argon2` compatibility test.** The reviewed v1.1 checklist contains separate Express and `argon2` script checks, and PostgreSQL checks for the client version, service, and server readiness. Those checks do not prove that the Node runtime can connect to PostgreSQL through the driver the backend will use. A separate Node-to-PostgreSQL `pg` connection and temporary-write smoke check is proposed in the companion document `M3_v1.2_Proposed_Node_PostgreSQL_Connection_Smoke_Check.md`. Run it during P1 if the owner/team accepts the proposal; record its result separately from M3 v1.1. It is a low-cost component compatibility probe, not proof that the finished Express application satisfies MAC-007.

## 5. Execution stages P0–P7

These product stages retain the P0–P7 naming in the v0.3 specification. They do not replace the separate M3 Environment Readiness Checklist.

### P0 — Requirements and scope agreement

**Objective:** Establish a shared understanding of what the team is building before implementation expands.

**Work items:**
- Obtain and record the actual submission/demo deadline, instructor deliverables, and any intermediate review dates (OQ-017). This is the first P0 action.
- Read the applied baseline, MVP Specification v0.3, and Traceability Crosswalk v0.3.
- Record whether the owner/team accepts the fictional demo assumptions needed for a testable prototype, especially DA-11.
- Confirm the MVP boundary in Section 1 of this plan: no final-sign-off capability in the current MVP. Explicitly set v0.4 aside so no teammate implements from that variant by accident.
- Identify which open decisions affect the first integrated slice; do not attempt to close every institutional question.
- Keep the AW-I05 question as a non-blocking to-do.
- Agree the first end-to-end demonstration scenario using fictional data.

**Exit evidence:** Dated owner/team scope-review record, actual deadline/deliverables or a recorded deadline blocker with an owner to obtain it, accepted demo assumptions, and a short list of decisions that must be resolved before the dependent technical work begins.

**Does not mean:** institutional policy has been verified or the baseline has been amended.

### P1 — Repository, application shells, and environment readiness

**Objective:** Give all three developers a safe, repeatable starting point and establish evidence for the stack-readiness decision before dependent implementation expands.

**Work items:**
- **Resolve repository ownership first (TD-R15).** Decide whether a personal GitHub account or an organization owns the repository, who administers it, and how access/recovery will work if a member leaves. Do not create a shared remote under an accidental or temporary owner.
- **Apply the publication gate.** TD-015 establishes that the instructor must be able to view the repository publicly. However, do not make it public until TD-R17 (school publication/IP/ownership/licensing rules) and the full TD-020 publication-safety review are addressed and recorded. Until then, work locally or in a controlled private staging repository; private staging is not a substitute for reviewing the complete history before eventual public release. Do not add a license, real college name/branding, official documents, or school policy claims without the necessary confirmation.
- Review current files and the full reachable Git history for secrets, credentials, personal/student information, confidential school material, private machine details, commit metadata, workflows, artifacts, issues/PR templates, and other restricted content before public release. Use `Sample College` and fictional data in public-safe material until permission is established.
- **Use the established repository layout from TD-013 exactly:**

```text
<repository-root>/
  android/                 # Separate Gradle project
  backend/                 # Independent npm project
  web/                     # Independent npm project
  docs/
    README.md              # Overall documentation index (TD-021)
    development-progress.md # Progress tracker (TD-019)
    requirements/          # Preserve baseline paths and requirements README
  .gitignore
  .gitattributes
  README.md
  # Add .nvmrc only after TD-R12 compatibility checks and team selection
```

  Do not put these directories under a `cdcms/` wrapper, `apps/`, or `services/`; TD-013 fixes the four top-level application/documentation directories. Preserve existing baseline paths relative to the repository root so internal relative links continue to work. Add other `docs/` subdirectories only when their first real document is ready; do not create empty placeholders.
- Apply TD-014: `backend/` and `web/` are separate npm projects, each with its own `package.json` and `package-lock.json`. Do not introduce npm workspaces initially. `android/` is a separate Gradle project and does not use npm.
- Include `.gitignore` and `.gitattributes` from the first repository commit (TD-017). Review their contents for secrets, private local configuration, generated files, SDK paths, dependency directories, build output, personal settings, and consistent Ubuntu/Windows line endings.
- Apply TD-018: once the Node version is selected after compatibility testing, set the supported major range in both npm projects' `engines.node` fields and put the agreed exact development version in the repository-root `.nvmrc`. Node.js 26.13.0 under TD-R12 is only a provisional candidate. Do not record it as selected before the M3 checks and team decision.
- Resolve TD-R13 by checking the actual version manager, operating mode, configuration, and version-file detection on each Windows developer's machine. Do not assume Windows behavior from the Ubuntu setup.
- Resolve TD-R14 before creating the Android project. Choose an `applicationId` with the team and check applicable naming/ownership restrictions; do not invent a college domain.
- **Run M3 Environment Readiness Checklist v1.1 on all three team environments** and record the actual outputs/results for the checks it really contains: separate Express and `argon2` script checks, PostgreSQL client-version/service/server-readiness checks, and the relevant Node/npm, Vite, Git, operating-system, and Android build-environment checks. Do not label these as an Express-to-PostgreSQL integration test.
- Review and, if accepted, run the separate Node-to-PostgreSQL `pg` driver connection and temporary-write probe in `M3_v1.2_Proposed_Node_PostgreSQL_Connection_Smoke_Check.md` on each environment intended to run the backend. Record the exact Node, npm, `pg` package, and PostgreSQL server versions, plus connection and query results. Keep its result separate from the M3 v1.1 checklist results. If the proposal is not accepted or the probe is not run, explicitly leave Node-driver connectivity unverified; do not silently mark TD-011 complete.
- Remember that this probe verifies a driver connection and reversible temporary-table write/read cycle only. It does not prove that the final Express application writes to its actual project schema; MAC-007 still requires an application-level database write/update test during implementation and acceptance.
- Record TD-011's conclusion only after the relevant results are reviewed. Keep environment outputs and private machine details out of the public repository; publish only sanitized summaries that do not expose usernames, home paths, device identifiers, or other private details.
- **Make Android ownership conditional on M3 evidence.** The Android lead must have access to a workstation that passes the required Android Studio/SDK/Gradle build checks. Teammate C is only the initial candidate; reassign or pair the work based on the actual M3 results. A physical Android device supports runtime testing but does not replace a compatible build workstation.
- Create minimal project shells only after the relevant toolchains are available. Keep setup instructions short and reproducible.
- Create and maintain `docs/development-progress.md` with the five TD-019 labels: `Suggested`, `In Progress`, `Implemented`, `Verified`, and `Blocked`. A `Verified` status requires recorded evidence; do not use it merely because code exists or a command is planned.
- Create `docs/README.md` as the overall documentation index (TD-021). Keep `docs/requirements/README.md` as the index/usage guide for the modular requirements baseline; do not create a duplicate documentation index or empty placeholder files.
- Apply TD-016's established team convention: feature branches and pull requests for changes intended for `main`, with review by another team member. Decide separately whether to enforce the additional GitHub ruleset under TD-R16; do not describe that enforcement as established.

**Exit evidence:** Repository ownership and publication status are recorded; the repository uses the exact TD-013 layout; TD-014 project separation is respected; `.gitignore`/`.gitattributes` are reviewed; M3 v1.1 results exist for all applicable checks on all three environments; the proposed Node-to-PostgreSQL probe is either run and recorded separately or explicitly left unverified/not adopted; TD-011 has an evidence-based disposition that does not overstate the checks; TD-R12/R13/R14/R15/R16/R17 statuses are accurately recorded; `docs/README.md` and `docs/development-progress.md` exist and are used; each teammate can clone the available working repository and build/start the relevant shell. Public visibility is confirmed only after TD-R17 and TD-020 release gates pass.

**Gate rule:** If TD-R15 ownership or TD-R17/TD-020 publication approval is unresolved, public publication remains **Blocked**. The team may continue safe local/private development after the owner is selected, but it must not bypass the public-release gate. If a developer's machine fails a required M3 check, record the failure and arrange a compatible environment or revise the component assignment before marking the environment ready.

### P2 — Data model, permissions, authentication, and API contract

**Objective:** Agree on the shared technical contracts before the three clients/workstreams develop incompatible assumptions. This stage is limited to the P2 time-box in Section 4; it must not become an open-ended design phase.

**Work items:**
- Resolve TD-R01 before selecting the final browser/Android authentication and session/token approach. Compare the simplest suitable session-based and token-based options, document the trade-offs for both clients, and record the owner's/team's decision.
- Resolve TD-R09 before finalizing the physical history/configuration schema. Define the required observable historical behavior first; do not prematurely mandate snapshots, JSON copies, version tables, or another mechanism. Before this design decision, P1 should have gathered the actual M3 v1.1 component checks and, if accepted, the separate Node-to-PostgreSQL driver probe. Neither test chooses the TD-R09 history mechanism.
- Review the role/permission matrix using the baseline's fixed role model. Do not introduce a custom permission editor or assume all catalog roles exist at the actual institution.
- Define the conceptual entities and their relationships, including users, roles, students, academic periods, programs/departments, offices, requirement definitions, templates, applicability, student clearance records, requirement instances, decisions, and audit/history events as justified by the baseline.
- Define API operations, request/response shapes, validation errors, authorization failures, and pagination needs for the actual MVP screens.
- Define which statuses are persisted versus derived for display. Keep the backend authoritative for decisions and completion.
- Define a migration/seed-data approach for fictional demo data.

**Exit evidence:** Team-reviewed logical data model, role/permission matrix, authentication decision record, API contract, and selected TD-R09 history design with rationale and test implications—or a clearly recorded blocker and an explicit scope cut for dependent implementation if a decision cannot responsibly be made within the time-box.

**Dependency note:** Some shell and mock-screen work can proceed earlier, but do not lock the physical database schema or production authentication protocol while their governing decisions remain open.

### P3 — Backend configuration and clearance assignment

**Objective:** Create the configurable foundation and generate student-specific requirements. The team writes and owns all production code under the working agreement in Section 3.

**Work items:**
- Implement the agreed admin operations for fictional academic periods, programs/departments, offices, accounts/role assignments, requirement definitions, templates, and applicability.
- Implement backend validation and authorization for every protected operation.
- Implement requirement selection/applicability and generate student-specific clearance records for the chosen fictional period/template.
- Ensure changes to reusable definitions do not silently rewrite the meaning of earlier student records; follow the behavior selected under TD-R09 and RH-001 through RH-005.
- Build the minimum web screens needed to configure and generate the demo records.
- Keep optional applicability preview out of the critical path unless the core assignment flow is already complete.

**Primary checks:** TS-03, TS-04, and TS-06. TS-05 remains optional and is not a gate for MAC-004/MAC-005.

**Exit evidence:** The team can configure a template and generate the correct requirement records for a small fictional student set; negative and unauthorized cases are tested.

### P4 — Instructor and office processing

**Objective:** Allow authorized staff to process the requirements assigned to them.

**Work items:**
- Keep instructor processing and office processing distinct where the baseline requires different responsibility paths.
- Show each staff user only the work authorized for their role and assignment.
- Implement the allowed approve/reject action and the configured rejection-remark behavior for the fictional demo.
- Record actor, time, decision, and any remark in the history representation selected under TD-R09.
- Do not add reopen, revoke, return, cancel, final-sign-off, or reassignment actions without resolving their governing baseline questions and approving the scope.
- Build the minimum React/Vite queues and decision forms.

**Primary checks:** TS-07 and TS-08. TS-10 is a supplemental seeded-fixture history test after TD-R09 is resolved; it is not an application recovery workflow and should not block the initial staff-processing slice unless the selected history design requires it for acceptance.

**Exit evidence:** An authorized instructor/office account can process its assigned fictional item; unauthorized accounts cannot; the backend records and returns the resulting state.

### P5 — Android student view and progress

**Objective:** Let a student securely view their own clearance requirements and backend-calculated progress. Start Android implementation only after the designated lead has access to an M3-verified build-capable environment.

**Work items:**
- Integrate Android sign-in using the selected TD-R01 approach.
- Retrieve only the signed-in student's permitted clearance data.
- Display applicable requirements, individual statuses, and any student-visible remarks.
- Display progress/completion derived by the backend; do not recreate the completion rule in Android.
- Handle loading, empty, network failure, session expiry, and API validation/error responses.

**Primary checks:** TS-09, TS-11, TS-16, and TS-17 as applicable to the v0.3 test definitions.

**Exit evidence:** After a staff decision, the correct student sees the updated backend state on Android; another student cannot access that record.

### P6 — End-to-end integration and acceptance

**Objective:** Demonstrate the core workflow across the web app, backend, database, and Android app.

**Work items:**
- Run the complete fictional scenario from administrative setup to student progress display.
- Execute all applicable tests and map evidence to MAC-001 through MAC-011.
- Include invalid-input and unauthorized-action tests; verify that failed actions do not silently change data.
- Verify the backend's completion calculation using the explicit fictional demo condition DA-11, while clearly labeling it as a demo assumption rather than institutional policy.
- Test the integrated system on each teammate's environment where applicable.
- Record actual results, defects, limitations, and any test that could not be run.
- Keep TS-12 and TS-13 deferred; neither is a P6 requirement or MAC gate.

**Exit evidence:** Reproducible end-to-end demonstration, recorded test results for each applicable MAC criterion, known-issues list, and no claim of passing tests that were not run.

### P7 — Handover and presentation

**Objective:** Make the project understandable, reproducible, and presentable to the instructor.

**Work items:**
- Complete the README and setup guide for all three components.
- Document the architecture, API contract, demo roles/accounts, fictional data, and the end-to-end workflow.
- Prepare a short demonstration script and reset/seed procedure.
- Document unresolved institutional questions and technical decisions honestly.
- Ensure each teammate can explain the workflow and their own component.
- Re-run the public repository safety review, including the full Git history, before final presentation/submission.

**Exit evidence:** A clean clone can be set up using the guide; the demo can be repeated; the team can explain its own implementation and known limitations.

---

## 6. First integrated vertical slice

Build a deliberately small but complete path before expanding the sample institution configuration:

1. One fictional academic period.
2. One fictional program or student group.
3. One fictional student.
4. One office and one authorized staff account.
5. One mandatory clearance requirement.
6. One generated student-specific requirement record.
7. One staff approval or rejection action.
8. One backend completion calculation using DA-11 for the demo.
9. One Android screen showing that student's updated requirement and progress.

This proves that the main layers communicate. Add more offices, roles, requirement types, and applicability only after this path works. The initial slice must not include final sign-off.

---

## 7. Cross-cutting rules for implementation

- **Backend authority:** authorization, validation, decisions, applicability evaluation, and overall completion belong in the backend.
- **No policy duplication:** Android and React render backend results; they do not independently determine whether a student is complete.
- **Configuration over hardcoding:** offices, requirements, academic periods, and applicability should be data-driven to the extent supported by the baseline and approved design.
- **History before storage technique:** agree on required historical behavior, then choose the TD-R09 implementation method; do not confuse a required outcome with one specific schema.
- **Least privilege:** backend checks every protected operation; hiding a button is not authorization.
- **Fictional data:** do not place real student/person data or confidential school records in the demo database or public repository. Public release also remains subject to TD-R17 and TD-020.
- **Approved repository shape:** use the exact TD-013 top-level `android/`, `backend/`, `web/`, and `docs/` layout; do not reopen this established decision in team discussion.
- **Environment evidence:** use M3 v1.1 for the checks it actually contains and record per-machine results. Record the proposed Node-to-PostgreSQL driver probe separately if accepted and run. Neither one developer's machine nor a `psql` readiness check alone proves driver connectivity or overall TD-011 readiness.
- **AI/code ownership:** the team authors and owns production code; AI support does not transfer implementation ownership or replace review and testing.
- **No silent scope growth:** conditional capabilities remain out of scope until their baseline questions and owner/team approval are addressed.
- **Evidence-based completion:** a feature is not done merely because code exists; the team must run and record relevant tests.

---

## 8. Team Definition of Done

A feature is complete only when:

1. The team can explain the requirement and its baseline/specification references.
2. Dependencies and unresolved decisions are identified.
3. Backend validation and authorization exist wherever the action is protected.
4. Web and Android clients use the agreed backend contract.
5. Relevant positive, negative, and permission tests have actually been run and recorded.
6. Loading, empty, invalid-input, and error states are handled at the relevant interface.
7. Required history behavior is verified against the selected TD-R09 design.
8. Documentation matches the actual implementation and current test status.
9. A teammate has reviewed the change and it has been integrated through the team's Git workflow.
10. No secret, real personal/student data, restricted school material, or private machine details are committed.
11. `docs/development-progress.md` uses the TD-019 labels `Suggested`, `In Progress`, `Implemented`, `Verified`, and `Blocked`; `Verified` includes recorded evidence. These labels describe project-work status and do not redefine baseline decision/requirement statuses.
12. `docs/README.md` is maintained as the overall documentation index, while `docs/requirements/README.md` remains the modular baseline index (TD-021).
13. The responsible teammate can explain the behavior and the team can reproduce it.

---

## 9. Immediate next actions

1. **Obtain the deadline first (P0 / OQ-017).** Ask the instructor for the exact submission and demonstration dates, required deliverables, and any checkpoints. Do not invent dates.
2. **Hold the owner/team scope review.** Use v0.3 and this plan; record acceptance of the no-final-sign-off MVP boundary and fictional demo assumptions. Explicitly set v0.4 aside for this MVP. Keep AW-I05 as a non-blocking validation question.
3. **Resolve repository ownership and release constraints (P1).** Decide TD-R15. Review TD-R17 and complete TD-020 before making the repository public as required by TD-015. Do not assume a license or publish restricted material.
4. **Run the actual P1 environment checks.** Run M3 v1.1 across the team and record its separate Express, `argon2`, and PostgreSQL client/service/readiness results accurately. Review the proposed Node-to-PostgreSQL driver probe and, if accepted, run it on each backend development environment; record the result separately. Do not call it part of v1.1 or a completed MAC-007 test. Resolve TD-R12, TD-R13, and TD-R14 only after their relevant checks/constraints; record TD-R16 as recommended/provisional unless the team decides and tests enforcement.
5. **Start the minimum working slice promptly.** Within the P1/P2 time-boxes, settle TD-R01 and TD-R09 or explicitly block only the dependent implementation. Begin the vertical slice no later than the end of P2; do not keep extending documentation work.
6. **Implement and demonstrate in thin increments.** Follow P3–P5, using the exact TD-013 repository layout, separate npm projects, the team production-code ownership agreement, and the hardware-qualified Android assignment.
7. **Verify against MAC-001 through MAC-011.** Run applicable tests, record results and limitations, and reserve the final 15–20% of available project time for integration, acceptance evidence, handover, and presentation.

The AW-I05 answer is useful for a real-school deployment or a future extension, but it does not block the generic prototype. Do not implement final sign-off from v0.4 unless the owner later makes a separate, explicit scope decision.

---

## 10. Source documents and limitations

Planning references for this version:

- `CDCMS_MVP_Requirements_Specification_v0.3.md` — current MVP planning reference.
- `CDCMS_MVP_Traceability_Crosswalk_and_Issue_Register_v0.3.md` — traceability and issue reference.
- Requirements Baseline 0.1 as applied through CHG-001 and CHG-002 — authoritative baseline reference.
- `M3_Environment_Readiness_Checklist_Ubuntu_Windows_v1.1.md` — companion checklist for its documented environment checks. According to the reviewed v1.1 contents, it has separate Express and `argon2` script checks and PostgreSQL client/service/server-readiness checks; it does not test Node-to-PostgreSQL driver connectivity.
- `M3_v1.2_Proposed_Node_PostgreSQL_Connection_Smoke_Check.md` — proposed addendum for the next M3 revision. It is not part of v1.1 and is not an adopted project dependency decision. The proposal uses the `pg` driver as a test candidate; if another driver is later selected, the corresponding check must be adapted.

The optional final-sign-off variant v0.4 is set aside for the current MVP and is not an implementation source. This plan expands the v0.3 P0–P7 sequence into suggested tasks, decision gates, and relative time-boxes. It is not a substitute for reviewing the full baseline, resolving the relevant technical decisions, obtaining publication/IP clearance, or running tests. It does not report that any implementation, environment check, repository publication review, or acceptance test has been completed.

The calendar schedule cannot be completed until OQ-017's actual deadline and deliverables are confirmed. Time-boxes in Section 4 are planning limits to prevent analysis from delaying the first working slice; revise them against the real deadline without silently changing MVP scope or skipping mandatory release/security gates. M3 v1.1 has not been rewritten or replaced by this plan. The proposed Node-to-PostgreSQL test remains a draft until the owner/team accepts it for the next M3 revision.

## 11. Revision history

| Version | Date | Summary | Status |
|---|---|---|---|
| 0.1 | 2026-11-06 | Initial scope decision and P0–P7 team execution plan. Recommends no final-sign-off capability in the current MVP and restores AW-I05 as a non-blocking validation item. | Superseded by v0.2 for planning use. |
| 0.2 | 2026-11-06 | Corrects repository layout to TD-013; adds TD-R12–TD-R17 and TD-018/019/021 handling; makes M3 v1.1 the TD-011 evidence gate; adds deadline-first relative time-boxes, hardware-dependent Android assignment, and the team production-code ownership agreement. Explicitly sets v0.4 aside. | Superseded by v0.3 for planning use. |
| 0.3 | 2026-11-06 | Corrects the description of M3 v1.1; separates its existing Express, `argon2`, and PostgreSQL readiness checks from a proposed Node-to-PostgreSQL `pg` driver smoke check; clarifies that this probe does not prove the finished backend satisfies MAC-007; records Node 26.13.0's current LTS status without treating it as the selected project version. | Proposed working plan; owner/team review required. |

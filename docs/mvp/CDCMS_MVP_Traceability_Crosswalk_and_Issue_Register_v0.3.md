# CDCMS MVP Traceability Crosswalk and Issue Register
## Review companion for MVP Requirements Specification v0.3

**Document ID:** CDCMS-MVP-TRACE-001  
**Version:** 0.3  
**Prepared:** 2026-11-05  
**Status:** Review input only — not approved for adoption  
**Baseline compared:** Requirements Baseline 0.1 as applied through CHG-001 and CHG-002

> **Authority and change-control notice**  
> This document is a working crosswalk for reviewing the proposed MVP specification. It does not amend the baseline, approve any open decision, add a source-register entry, or authorize CHG-003. Baseline identifiers retain their original meaning. Specification-only identifiers use separate namespaces: `MSPEC-FR-*`, `MSPEC-BR-*`, `MSPEC-NFR-*`, `DA-*`, and `TS-*`. This crosswalk is a reasoned mapping aid; the owner/team must review mappings and test evidence before adoption.

## 1. Review scope and method

**v0.3 correction scope:** adds demo assumption DA-11 for the fictional completion predicate; reclassifies TS-10 as a seeded-fixture backend/database test; scopes `remarkRequiredOnReject` to each `TemplateRequirement`; changes optional applicability preview MSPEC-FR-016 to Should; and corrects the minor baseline-reference, reporting, source-ID, and external-page-verification notes raised in review.

The applied 18-file baseline archive was inspected locally. The prior v0.1 specification was reviewed and revised to address identifier collisions, unresolved decisions presented as mandatory behavior, role-model overreach, status semantics, history strategy, and test traceability. The reviewer previously spot-checked selected mappings and did not claim a full row-by-row review of every FR. This v0.3 crosswalk therefore makes each mapping explicit for owner/team verification; it must not be described as a completed independent verification of all requirements. It incorporates four reviewer corrections and related minor traceability clarifications; it is still not a completed independent semantic verification of every mapping.

The 12 essential feature areas and MAC-001 to MAC-011 remain unchanged. The baseline's unknowns remain unknown unless an authorized source and owner decision resolve them.

## 2. Important baseline interpretation

| Topic | Baseline authority | Treatment in v0.3 |
|---|---|---|
| Role values | RP-001 confirms six baseline values. RP-I01/RP-I02 are unknown; RP-M08/RP-M09 conditional. | Keep all six catalog values, demo only Student, Instructor, Administrative Office Personnel, System Administrator. Do not invent department responsibilities. |
| Instructor work | IR-001; IR-003 conditional, with IR-I01/IR-I03 open. | Keep instructor processing distinct from office processing; subject/section assignment configurable and conditional. |
| Multiple roles/user | RP-I03 unknown. | No schema/cardinality decision. One role per demo account only as test fixture. |
| Individual vs overall status | AW-002 confirmed; AW-003 provisional individual set. | Distinguish levels. Keep Pending/Approved/Rejected as provisional starting individual values. |
| Overall completion | AW-004 confirmed; CR-I05/AW-I06 open. | Completion depends on every applicable mandatory requirement satisfying its defined condition. |
| Overall status labels | AW-002 does not prescribe overall labels. | In Progress/Needs Attention/Requirements Complete are proposed derived display labels only, not baseline enums. |
| Rejection remarks | AW-006 confirmed; AW-007 unknown placeholder. | `remarkRequiredOnReject=UNSPECIFIED` default; OPTIONAL/REQUIRED only explicit test/demo settings. |
| Recovery after rejection | AW-012 and AW-I04 unknown; RH-007 provisionally expects prior/later outcomes preserved. | No reopen/resubmit/revoke action in default workflow; history scenario only. |
| Final sign-off | AW-I05 unknown; AW-I08 output unknown. | No default final approver role, queue, final status, or required step. Ask instructor/registrar. |
| History implementation | CR-002 separates reusable requirements and student clearance records; RH-001–RH-005 require historical preservation; TD-R09 remains open. | Specify observable preservation, not snapshot columns/JSON/immutable snapshot method. |
| Performance/accessibility/device targets | NFR-013, NFR-015, NFR-016 remain unknown. | No 3-second target, accessibility target, or Android minimum invented. |
| Product milestone naming | M3 is reserved for Environment Readiness Checklist. | Product build sequence uses P0–P7; environment checklist retains M3. |

## 3. Namespace map

| Item type | v0.1 namespace | v0.3 namespace | Baseline collisions avoided |
|---|---|---|---|
| Functional requirements | FR-001…FR-040 | MSPEC-FR-001…MSPEC-FR-040 | Baseline may have other `FR` terms; unique specification prefix avoids ambiguity. |
| Business rules | BR-01…BR-16 | MSPEC-BR-01…MSPEC-BR-16 | Keeps the rules clearly local to this spec. |
| Non-functional requirements | NFR-001…NFR-016 | MSPEC-NFR-001…MSPEC-NFR-014 | Baseline NFR-001…NFR-017 remain untouched. |
| Demo assumptions | AS-01…AS-10 plus DA-11 added in v0.3 | DA-01…DA-11 | Avoids baseline academic-structure AS-001… and other AS identifiers. DA-11 defines a fictional demo-only completion condition. |
| Test scenarios | SC-01…SC-18 | TS-01…TS-18 | Avoids baseline student-classification SC-001… and related identifiers. |

No baseline identifier is repurposed. Reference baseline IDs as source/traceability only.

## 4. Functional requirement crosswalk

The MAC column indicates direct or supporting evidence alignment, not a claim that the requirement alone closes the acceptance criterion. A single MAC often needs multiple requirements and an integrated test.

|Spec ID|Requirement focus|Baseline trace|MAC trace|Qualification / verification note|
|---|---|---|---|---|
|MSPEC-FR-001|Admin account lifecycle|RP-001, RP-M10|MAC-002|Core account operations for prototype; exact account creation authority in RP-I04.|
|MSPEC-FR-002|Argon2id authentication|MVP-012, NFR-001–NFR-004, TD-006|MAC-002, MAC-003|Hashing choice is baseline-established; auth session/token mechanism remains TD-R01 open.|
|MSPEC-FR-003|Backend authorization on protected actions|RP-004, RP-005, RP-006|MAC-002, MAC-010|Server-side authorization; no client-only checks.|
|MSPEC-FR-004|Six-value baseline role catalog|RP-001, RP-003, RP-I01, RP-I02, RP-I03, TD-R07|MAC-002|Catalog values retained; does not assert all roles exist or multi-role users are supported.|
|MSPEC-FR-005|Deactivate account without losing historical attribution|RP-M10, RH-005, RH-006, RH-008, RH-009|MAC-002, MAC-011|Retention/correction mechanics remain open; preserve actor reference.|
|MSPEC-FR-006|Minimum configurable student profile|MVP-003, AS-008, AS-I01–AS-I08, SC-001–SC-003|MAC-004, MAC-005|Only fields needed by configured applicability; actual fields/source open.|
|MSPEC-FR-007|Admin maintains fictional student records|RP-M12, MVP-015, MVP-016, AS-008|MAC-004|Manual demo records, not a real SIS integration.|
|MSPEC-FR-008|Academic periods/programs/departments|MVP-004, AS-001–AS-007, AS-I01–AS-I08|MAC-004|Names and exact structure remain unknown.|
|MSPEC-FR-009|Optional CSV import for fictional data|MVP-003, MVP-016, MVP-017; MVP-026 is an exclusion boundary only|MAC-004 (supporting only)|Should only; student academic-information management/sample data are context; MVP-026 does not support CSV import and is cited only as the SIS boundary.|
|MSPEC-FR-010|Office configuration|MVP-005, OF-001, OF-I01–OF-I05|MAC-004|Sample offices only until official list is available.|
|MSPEC-FR-011|Staff-to-office assignments; retain instructor assignment separately|OF-002–OF-004, IR-001–IR-003, IR-I01–IR-I05, RP-M05–RP-M07|MAC-004, MAC-006|Instructor subject/section relation remains conditional; do not collapse instructor into office personnel.|
|MSPEC-FR-012|Reusable requirement definitions|MVP-006, CR-001–CR-004|MAC-004|Requirement owners may include instructors/offices; department roles conditional.|
|MSPEC-FR-013|Requirement fields and mandatory flag|CR-001, CR-003, CR-008, CR-I01–CR-I05|MAC-004|Actual requiredness and definition of satisfied remain open.|
|MSPEC-FR-014|Template connects period and selected requirements|CR-001, CR-002, CR-009, TD-R09|MAC-004, MAC-005|Preserve reusable definition vs student record; version/history technique undecided.|
|MSPEC-FR-015|Limited configurable applicability|CR-005, CR-007, CR-009, AS-008, SC-002, SC-003, SC-I01–SC-I04|MAC-004, MAC-005|No arbitrary expression engine; actual dimensions/values open.|
|MSPEC-FR-016|Optional applicability preview|CR-005, CR-007, CR-009|— (optional support only; not a MAC acceptance gate)|Priority is Should. It can help inspect configured applicability but is not essential to MAC-004/005.|
|MSPEC-FR-017|Validate template/request configuration|CR-001, CR-005, CR-009, NFR-005|MAC-004, MAC-010|Proposed technical validation supports baseline behavior.|
|MSPEC-FR-018|Admin selects students and template for generation|MVP-007, CR-009, RP-M15|MAC-004, MAC-005, MAC-007, MAC-011|No real SIS integration.|
|MSPEC-FR-019|Backend assigns applicable requirements|MVP-007, CR-009, CR-005, CR-007, AW-008|MAC-005, MAC-007|Applicability rules configured as data.|
|MSPEC-FR-020|Historical context preserved without prescribing mechanism|CR-002, RH-001–RH-005, TD-R09|MAC-007, MAC-011|Do not prescribe snapshot columns, JSON, or immutable snapshot architecture.|
|MSPEC-FR-021|Optional duplicate-generation warning/guard|— (no direct supporting baseline requirement)|MAC-011 (proposed supporting test only)|Proposed demo safeguard; MVP-001/MVP-017 are not a specific duplicate-policy basis. Keep Should and do not present as a baseline requirement.|
|MSPEC-FR-022|Request cancellation workflow|AW-I04, AW-012, RH-007|No direct MAC closure|Deferred; not in default workflow.|
|MSPEC-FR-023|Assigned instructor and office queues|MVP-008, MVP-009, IR-001, OF-002, RP-M05, RP-M07|MAC-006|Keep instructor and office scopes distinct.|
|MSPEC-FR-024|Reviewer sees necessary student/requirement details|IR-001, OF-002, RP-M05, RP-006|MAC-006, MAC-010|Only relevant data within reviewer permission scope.|
|MSPEC-FR-025|Authorized reviewer approves assigned item|IR-001, OF-002, AW-003, AW-005|MAC-006, MAC-007|Individual `Approved` is provisional starting status under AW-003.|
|MSPEC-FR-026|Authorized reviewer rejects; remark setting configurable per TemplateRequirement|AW-003, AW-006, AW-007|MAC-006, MAC-010|UNSPECIFIED/OPTIONAL permit either at runtime in the demo; REQUIRED blocks missing remarks. This does not resolve AW-007.|
|MSPEC-FR-027|Decision outcome, actor, time, and remark history|AW-005, AW-006, RH-005, RH-007|MAC-006, MAC-007, MAC-011|History implementation still TD-R09.|
|MSPEC-FR-028|Reopen/recheck action|AW-012, AW-I04, RH-007|No direct default-MVP MAC closure|Deferred. History of later outcome retained; no recovery mechanism prescribed.|
|MSPEC-FR-029|Backend enforces staff assignment permissions|RP-004–RP-006, IR-001, OF-002|MAC-002, MAC-006, MAC-010|Role/access scope needs owner/team design.|
|MSPEC-FR-030|Android displays student's own current clearance|MVP-010, RP-M02, RP-M04|MAC-005, MAC-008|Student-only visibility.|
|MSPEC-FR-031|Android shows assigned item details/status/remarks|RP-M02, RP-M03, AW-002, AW-006|MAC-005, MAC-008|No student action/recovery added.|
|MSPEC-FR-032|Backend-derived progress count|AW-002, AW-004, AW-006, AW-I06, DA-11|MAC-009|Count uses applicable mandatory items; DA-11 defines Approved for fictional demo data only; actual condition remains open.|
|MSPEC-FR-033|Backend calculates completion using AW-004|MVP-011, AW-002, AW-004, AW-008, CR-I05, AW-I06, DA-11|MAC-007, MAC-009|DA-11 makes the fictional demo calculable; real condition remains open. Does not imply final sign-off.|
|MSPEC-FR-034|Final-signoff eligibility extension|AW-I05|No direct MAC closure; MAC-009 remains AW-004|Conditional/deferred; not in default MVP.|
|MSPEC-FR-035|Final approver action extension|AW-I05, AW-I08, RP-I01|No direct MAC closure|Conditional/deferred; requires confirmed authority and approved scope.|
|MSPEC-FR-036|Final Cleared/output label|AW-I05, AW-I08, AW-004|No direct MAC closure|Do not equate Requirements Complete with final institutional clearance.|
|MSPEC-FR-037|Preserve relevant processing and configuration history|RH-001–RH-009, AW-005, AW-006, AW-012|MAC-011 (and MAC-006 for decisions)|History expectations exist; technical storage, retention, correction and recovery open.|
|MSPEC-FR-038|Record actor and event time|AW-005, RH-005, RP-006|MAC-006, MAC-011|Relevant processing event attribution.|
|MSPEC-FR-039|Optional request-list filtering|MVP-019, RP-M16|MAC-011 (supporting only)|Filtering only; not report export. MVP-021 is the optional activity-history screen and is not used to support this filter requirement.|
|MSPEC-FR-040|In-app counts of derived UI labels|AW-002, AW-004, AW-007|MAC-009 (supporting only)|Optional display convenience; no direct MVP requirement is claimed and it is not report export under MVP-023.|

## 5. Business-rule crosswalk

|Spec ID|Rule focus|Baseline trace|MAC trace|Qualification / verification note|
|---|---|---|---|---|
|MSPEC-BR-01|Authenticated/authorized users only|RP-004, RP-005|MAC-002, MAC-010|Core access safeguard.|
|MSPEC-BR-02|Students see only own permitted records|RP-M02–RP-M04, RP-004|MAC-002, MAC-005|Student visibility boundary.|
|MSPEC-BR-03|Instructor/office reviewers process only assigned items|IR-001–IR-003, OF-002, RP-M05–RP-M07|MAC-006|Preserve separate instructor and office assignment models.|
|MSPEC-BR-04|Server checks actor role and assignment|RP-004–RP-006|MAC-002, MAC-006, MAC-010|No UI-only authorization.|
|MSPEC-BR-05|Reject remarks follow per-TemplateRequirement flag; default UNSPECIFIED|AW-006, AW-007|MAC-006, MAC-010|UNSPECIFIED and OPTIONAL both permit either at runtime in the demo; distinction is documentary/provenance only. Test configuration does not confirm policy.|
|MSPEC-BR-06|Record outcome, actor, time and any remark|AW-005, AW-006, RH-005|MAC-006, MAC-007, MAC-011|Subject to TD-R09 history design.|
|MSPEC-BR-07|Backend is authoritative for item and overall status|AW-008, NFR-010|MAC-007, MAC-008, MAC-009|Clients display backend results.|
|MSPEC-BR-08|Completion requires all applicable mandatory items to satisfy their completion conditions; DA-11 says Approved for demo only|AW-004, CR-I05, AW-I06, DA-11|MAC-009|DA-11 makes the fictional demo testable; CR-I05/AW-I06 remain open for the real institution.|
|MSPEC-BR-09|AW-004 completion does not imply final sign-off|AW-I05|MAC-009|Preserve original MAC-009; final sign-off unresolved.|
|MSPEC-BR-10|Student cannot approve or reject a requirement|RP-001, RP-004–RP-006, RP-M02–RP-M04|MAC-002, MAC-010|Proposed permission boundary; verify role matrix.|
|MSPEC-BR-11|Earlier rejection/later outcome history is not silently overwritten|RH-007, AW-012, AW-I04|MAC-011|History requirement provisional; recovery procedure remains open.|
|MSPEC-BR-12|Config changes cannot destroy historical context|RH-001–RH-005, TD-R09|MAC-011|Storage method remains undecided.|
|MSPEC-BR-13|Referenced records retain meaning if config/user retired|RH-006, RH-008, RH-009|MAC-011|Provisional retention/correction treatment.|
|MSPEC-BR-14|Optional duplicate request detection for demo|— (no direct supporting baseline requirement)|MAC-011 (proposed supporting test only)|No direct duplicate-policy basis in MVP-001/MVP-017; safeguard remains optional and non-policy.|
|MSPEC-BR-15|No reopen/revoke/cancel/final action in default workflow|AW-I04, AW-I05, AW-012|No added MAC criterion|Scope guard pending clarification.|
|MSPEC-BR-16|Decision and history update remain consistent|AW-005, AW-008, RH-005, NFR-010|MAC-007, MAC-011|Proposed integrity rule.|

## 6. Non-functional requirement crosswalk

|Spec ID|Quality focus|Baseline trace|MAC trace|Qualification / verification note|
|---|---|---|---|---|
|MSPEC-NFR-001|Argon2id password security|NFR-001–NFR-004, TD-006|MAC-002, MAC-003|Baseline requirement carried forward.|
|MSPEC-NFR-002|Backend authorization|RP-004–RP-006|MAC-002, MAC-010|Role/assignment check on every protected operation.|
|MSPEC-NFR-003|Fictional data and publication safety|MVP-015, TD-020, TD-R17|MAC-011 supporting only|Publication rules remain a release gate.|
|MSPEC-NFR-004|Secrets excluded from source control|NFR-007, NFR-008, TD-017|MAC-001, MAC-011 supporting only|Use local env configuration and safe example values.|
|MSPEC-NFR-005|Server-side input validation|NFR-005|MAC-010|Validate status, identifiers and user-supplied remarks.|
|MSPEC-NFR-006|Safe parameterized database access|NFR-006|MAC-007|Database access quality constraint.|
|MSPEC-NFR-007|History and safe logging|NFR-002, NFR-008, RH-001–RH-009|MAC-011|Do not log passwords, hashes, credentials or unnecessary private data.|
|MSPEC-NFR-008|Cross-client/backend status consistency|AW-008, NFR-010|MAC-007, MAC-008, MAC-009|Backend owns calculation.|
|MSPEC-NFR-009|Approved repository structure|TD-012, TD-013|MAC-001|Single repository layout decision.|
|MSPEC-NFR-010|Configurable office/requirement data|CR-001, CR-005, CR-009, NFR-010|MAC-004|Avoid hardcoded institution names/rules.|
|MSPEC-NFR-011|Ubuntu/Windows documented portability|NFR-009, TD-011|MAC-001|Requires actual evidence on all three machines.|
|MSPEC-NFR-012|Readable code and consistent API boundaries|NFR-010, TD-014|MAC-007, MAC-011 supporting only|Business logic not duplicated across clients.|
|MSPEC-NFR-013|Documentation and status integrity|NFR-011, NFR-012, TD-019|MAC-011|Do not claim implementation/testing/verification without evidence.|
|MSPEC-NFR-014|Clear display of item status and derived labels|AW-002, AW-003, AW-006; NFR-015 open|MAC-005, MAC-008, MAC-009|No accessibility/language target invented.|

## 7. Test-scenario crosswalk

These scenarios supplement the MAC criteria. Conditional scenarios do not become default acceptance gates.

|Scenario ID|Test focus|Baseline trace|MAC trace|Qualification / verification note|
|---|---|---|---|---|
|TS-01|Sign-in and password security|RP-001, RP-004, MVP-012, NFR-001–NFR-004|MAC-002, MAC-003|Exercise Argon2id and safe credential handling.|
|TS-02|Unauthorized read/write access|RP-004–RP-006, RP-M02–RP-M06|MAC-002, MAC-010|Unauthorized request denied; record unchanged.|
|TS-03|Office configuration|MVP-005, OF-001|MAC-004|Fictional office becomes selectable for later demo setup.|
|TS-04|Requirement and template configuration|MVP-006, CR-001–CR-004, CR-008|MAC-004|Required/optional setting is demo data; not policy confirmation.|
|TS-05|Optional applicability-preview test|CR-005, CR-007, CR-009, AS-008, SC-002/SC-003|— (not a MAC acceptance gate)|Run only if optional MSPEC-FR-016 is implemented; not required to pass MAC-004/005.|
|TS-06|Assignment and persistence|MVP-007, CR-009, AW-008, TD-R09, RH-001–RH-005|MAC-004, MAC-005, MAC-007, MAC-011|Verify observable behavior and preservation; no snapshot method assumed.|
|TS-07|Instructor/office processes assigned item|MVP-008, MVP-009, IR-001, OF-002, AW-003–AW-006|MAC-006, MAC-007|Run at least one instructor and one office example.|
|TS-08|Per-template-inclusion reject remark flag|AW-006, AW-007|MAC-006, MAC-010|Test at TemplateRequirement scope. UNSPECIFIED and OPTIONAL have identical permissive runtime behavior; difference is documentary only. Not school policy.|
|TS-09|Student Android sees updated status|MVP-010, RP-M02–RP-M04, AW-008|MAC-005, MAC-008|Android retrieves backend state for student's own record.|
|TS-10|Seeded-fixture history representation test|RH-005, RH-007, AW-005, AW-012, AW-I04, TD-R09|MAC-011 (supplemental history-design test only)|After TD-R09 selects a history representation, seed earlier Rejected and later outcome events and inspect stored history. Not executable through the app; not a core P4 gate; it does not test or imply a recovery operation.|
|TS-11|Overall completion calculation|MVP-011, AW-002, AW-004, AW-008, CR-I05, AW-I06, DA-11|MAC-007, MAC-009|DA-11 makes Approved the satisfaction condition for fictional demo data only; CR-I05/AW-I06 remain open institutionally. No final sign-off condition.|
|TS-12|Final sign-off extension|AW-I05, AW-I08|No default MAC mapping; MAC-009 remains AW-004|Blocked until final sign-off is confirmed and separately approved.|
|TS-13|Unauthorized final sign-off|AW-I05, RP-004–RP-006|No default MAC mapping|Not executable unless TS-12 is approved.|
|TS-14|Historical context survives configuration change|RH-001–RH-005, TD-R09|MAC-011|Test outcome, not specific snapshot architecture.|
|TS-15|Duplicate request detection|— (no direct supporting baseline requirement)|MAC-011 supporting only|Optional demo safeguard; not an institutional policy.|
|TS-16|Overall display labels are derived|AW-002, AW-004, AW-007|MAC-008, MAC-009|Labels not treated as canonical baseline status values.|
|TS-17|Cross-client/backend/DB consistency|AW-008, NFR-010, MVP-014|MAC-007, MAC-008, MAC-011|Compare persisted result and both client displays.|
|TS-18|Public repository safety review|MVP-015, TD-020, TD-R17, NFR-007/NFR-008|MAC-001/MAC-011 supporting only|Repository is public. A limited history/file scan and first-commit cleanup are recorded; full TD-020 review and TD-R17 school-rule checks remain open.|

## 8. MAC coverage summary

| Baseline acceptance criterion | Main specification coverage | Minimum evidence expected |
|---|---|---|
| MAC-001 — all three developers can set up/run from Ubuntu/Windows docs | MSPEC-NFR-004, MSPEC-NFR-009, MSPEC-NFR-011, TS-01/TS-18 as supporting | Separate recorded setup/build evidence for Ubuntu and both Windows developers; do not infer success from one machine. |
| MAC-002 — authorized users access appropriate functions | MSPEC-FR-001 to 005, MSPEC-FR-029, MSPEC-BR-01 to 04/10, TS-01/TS-02 | Role/assignment positive and negative authorization tests. |
| MAC-003 — Argon2id password hashing/verification | MSPEC-FR-002, MSPEC-NFR-001, TS-01 | Runtime tests demonstrate hash/verify and no plaintext/hash leakage. |
| MAC-004 — administrator configures academic/clearance information | MSPEC-FR-007/008/010/012–015/017/018, TS-03/TS-04/TS-06 | Admin configuration, validation, and requirement setup with fictional data. Optional TS-05 preview is not a MAC gate. |
| MAC-005 — student views assigned requirements | MSPEC-FR-006/015/019/030/031, TS-06/TS-09 | Correct assignment and student-only visibility. Optional TS-05 preview is not required. |
| MAC-006 — instructor/office representative processes assigned item | MSPEC-FR-011/023–029, MSPEC-BR-03–06, TS-07/TS-08 | Instructor and office roles each process assigned item; unauthorized processing denied. TS-10 is not an app workflow test. |
| MAC-007 — backend successfully updates PostgreSQL | MSPEC-FR-018–020/025–027/033/037/038, MSPEC-NFR-006/008, TS-06/TS-07/TS-17 | Database state reflects processing outcome and history; no false test claims. |
| MAC-008 — student sees updated status on Android | MSPEC-FR-030–032, MSPEC-NFR-008/014, TS-09/TS-16/TS-17 | Android retrieves changed backend status and remarks. |
| MAC-009 — overall completion calculated correctly | MSPEC-FR-032/033, MSPEC-BR-07/08/09, DA-11, TS-11/TS-16 | Completion follows AW-004; DA-11 supplies the Approved condition for fictional demo data only. No final sign-off required by implication. |
| MAC-010 — invalid inputs/unauthorized actions handled | MSPEC-FR-017/026/029, MSPEC-NFR-002/005, TS-02/TS-08 | Invalid configuration/input and denied action produce safe response without changing state. |
| MAC-011 — complete workflow demonstrated/tested | All core workflow requirements; MSPEC-NFR-003/007/013; TS-03/04/06–09/11/14/17/18; TS-10 as supplemental seeded-fixture history test | Integrated demo with fictional data, recorded tests, documented limitations, and publication-safety gate. TS-10 does not add an in-app recovery flow. |

## 9. Issue register

| Issue ID | Finding | Baseline reference | Required correction / current disposition | Approval gate |
|---|---|---|---|---|
| ISSUE-001 | Spec-only identifiers collided with baseline namespaces. | Baseline NFR-001…NFR-017; AS-001…; SC-001… | Renamed to MSPEC-FR/BR/NFR, DA, TS. | Verify no remaining local-ID collision before approval. |
| ISSUE-002 | Final-approver step was invented and mandatory. | AW-I05; AW-I08; AW-004; MAC-009 | Removed from default workflow; conditional extension only. | Ask instructor/registrar AW-I05; owner/team must explicitly approve any extension. |
| ISSUE-003 | Snapshot-at-assignment method was prescribed while TD-R09 open. | TD-R09; CR-002; RH-001–RH-005 | Replaced with implementation-neutral history requirement. | Resolve TD-R09 before final schema design. |
| ISSUE-004 | Mandatory rejection reason assumed. | AW-006/AW-007 placeholder `[REMARK_REQUIRED_ON_REJECT]` | Default UNSPECIFIED; OPTIONAL/REQUIRED as explicit demo/test config. | Resolve AW-007 from authorized source before policy is asserted. |
| ISSUE-005 | Reopen/recheck flow was mandatory although recovery unknown. | AW-012; AW-I04; RH-007 | Removed operation from default MVP; retain prior/later history. | Resolve AW-012/AW-I04 before implementing recovery. |
| ISSUE-006 | Six roles were treated as if all real responsibilities are confirmed; generic officer collapsed instructor. | RP-001, RP-I01, RP-I02, RP-I03, RP-M08/RP-M09, IR-001/IR-003 | Retain six catalog values; demo four; instructor and office reviewer flows are separate; department roles conditional. | Confirm actual roles and department responsibilities; do not infer. |
| ISSUE-007 | Overall status labels were treated as baseline-defined states. | AW-002/AW-004; CR-I05/AW-I06 | Keep display labels as derived conveniences only; completion predicate is AW-004. | Confirm exact requirement completion conditions. |
| ISSUE-008 | Product M3 collided with environment readiness M3. | M3 Environment Readiness Checklist | Renamed product stages to P0–P7. | No additional gate. |
| ISSUE-009 | MAC-009 was altered to require final sign-off. | MAC-009; AW-I05 | MAC-009 remains unchanged; completion test follows AW-004 only. | AW-I05 needed only for optional extension, not for core calculation. |
| ISSUE-010 | 3-second performance target and accessibility expectations filled baseline unknowns. | NFR-013, NFR-015, NFR-016 | Removed invented targets; leave open. | Do not add targets without evidence/decision. |
| ISSUE-011 | FR/BR/scenario rows were not mapped to baseline/MAC. | MVP-001…MVP-027; MAC-001…MAC-011 and requirement modules | Added row-level tables in §§4–7 of this crosswalk. | Team review still needed; this is not independent formal verification. |
| ISSUE-012 | Actual school name appeared in draft despite publication/IP/naming unknown. | TD-020; TD-R17; AS-I01 | Use `Sample College`; no real institution name/logo/policy assertion in public-safe files. | Confirm institutional permission/rules before naming in public material. |
| ISSUE-013 | External examples could be read as local policy; page-specific claims require verification. | External URLs in §2.4; source register currently through SRC-19 | Retained only as candidate background links. Exact page locators and source details are not claimed as reverified in v0.3. | Verify source content/page locators before relying on them; add a source row only through approved change. |
| ISSUE-014 | Prior draft commentary about school website checks could be mistaken for verified evidence. | TD-R17; AS-I01; OF-I01… | v0.3 relies on no claim about the institution's website contents and makes no claim that a clearance form does or does not exist. | Record exact page/URL/date and scope if website evidence is gathered later; obtain official form/policy or authorized written answer for clearance rules. |
| ISSUE-015 | Source IDs were tentatively reserved/assigned before an approved change. | `00-sources.md`; SRC-07 | No future source ID is assigned in v0.3. SRC-07 continues to cover AI-generated review input; any new source rows are allocated sequentially when explicitly approved and prepared. | Explicit owner approval and CHG entry before changing source register. |
| ISSUE-016 | The existing original project brief is listed available but absent from applied archive. | SRC-01 | Crosswalk maps against the 18-file applied baseline; source completeness still limited by absent brief. | Locate authoritative brief before final traceability sign-off. |
| ISSUE-017 | The demo lacked an explicit completion condition for MAC-009. | AW-004; CR-I05; AW-I06; MAC-009 | Added DA-11: for fictional demo data only, an applicable mandatory item is satisfied when its individual status is Approved. | Owner must accept DA-11 as a demo assumption; CR-I05/AW-I06 remain unresolved institutionally. |
| ISSUE-018 | TS-10 described a later outcome without an in-app operation to create it. | RH-007; AW-012; AW-I04 | Reframed as a seeded-fixture backend/database history test; explicitly not an application workflow test. | Owner/team to accept test scope; do not infer a reopen/recheck workflow. |
| ISSUE-019 | `remarkRequiredOnReject` scope and enum semantics were unclear. | AW-007; TemplateRequirement conceptual entity; TD-R09 remains open for physical schema | Defined as per-template-requirement association. `UNSPECIFIED` and `OPTIONAL` permit either at runtime in demo; difference is provenance/documentary meaning. | Owner/team must approve the conceptual scope before schema finalization; AW-007 remains open. |
| ISSUE-020 | Applicability preview was marked Must despite being an optional enhancement. | MVP-017; CR-005; CR-007 | MSPEC-FR-016 changed to Should; TS-05 is optional and not a MAC-004/005 gate. | Implement only after baseline essentials are complete or if separately prioritized. |
| ISSUE-021 | FR-009 cited MVP-026 as support, although it is an SIS exclusion. | MVP-003; MVP-016; MVP-017; MVP-026 | Corrected: MVP-003/MVP-016 give context; MVP-026 is labeled as boundary only. | No further action. |
| ISSUE-022 | FR-021/BR-14/TS-15 relied on generic MVP-001/MVP-017 references for a duplicate-request safeguard. | MVP-001; MVP-017 | Removed those as supporting baseline references; duplicate detection remains an optional proposed safeguard with no direct baseline basis. | Owner/team can omit it from the MVP. |
| ISSUE-023 | In-app progress counts/list filtering could be confused with MVP-023 report export. | MVP-019; MVP-023 | Separated list filtering and in-app display conveniences from report export; MVP-023 is stated as export only. | No export feature in current draft. |
| ISSUE-024 | Tentative SRC-20/SRC-21 allocation introduced a source-ID gap before approval. | `00-sources.md`; SRC-07; current source sequence | Removed tentative source IDs; allocate next IDs sequentially only when the source-register change is actually approved/prepared. | Recheck the source register at the time of CHG preparation. |

## 10. Proposed external source handling (not yet source-register changes)

This section does not assign or reserve source IDs and is not an instruction to edit `00-sources.md` now. If the owner later approves one or more sources for registration, allocate the next available IDs sequentially at that time, after rechecking the live source register:

| Source-row status | Source bundle | Potential use | Limitation | Current treatment |
|---|---|---|---|---|
| No source ID assigned in this draft | `CDCMS-MVP-SPEC-001 v0.3` | The proposed specification itself, only if the owner later approves it as an authoritative project source. | It is not currently an approved baseline source. | Do not add until explicit approval. |
| No source ID assigned in this draft | URS Academic Manual, CCP College Student Manual 2023, UPOU clearance page, UPM clearance page | Candidate background links illustrating that institutions may use different offices, purposes, and clearance steps. | Contents/page locators have not been reverified in this v0.3 correction pass; they do not establish a universal standard or `Sample College` policy. | Background only; verify details before adding a source row. |

Source-specific notes:

- **URS Academic Manual:** an earlier draft identified a clearance-form example and several signatory labels. Its precise page locator, current effectivity/version, and details are not reverified here; check the PDF before citing them.
- **Central Colleges 2023 Student Manual:** an earlier draft identified a graduation/Transcript process and signatory offices. Its precise page locator and details are not reverified here; check the manual before citing them.
- **UPOU:** the earlier draft summarized a particular workflow; the page contents and final-approver detail are not reverified in v0.3.
- **UP Manila:** the earlier draft summarized OSA checks; the page contents and approval detail are not reverified in v0.3.

No claim about the project institution's website contents is relied on in this crosswalk. No conclusion is made about whether an official clearance form exists. If a website is reviewed later, record the exact page, URL, access date, and the limited claim it supports; public identity/staff listings do not establish a clearance procedure.

## 11. AW-I05 question to ask before any final-signoff extension

The most useful first question to ask the instructor or registrar is:

> **After all applicable clearance requirements have been approved by the assigned instructors/offices, is there a separate final sign-off by a Registrar, Dean, department head, or another authorized person before the student is officially considered cleared? If yes, which role performs it, what do they check, and what record or output confirms completion?**

Record the answer as an authoritative source or as unresolved if no clear answer is available. Do not turn an informal guess into a confirmed requirement. This question concerns AW-I05/AW-I08 and does not block implementing the backend completion calculation in MAC-009 using AW-004, provided the demo completion condition is explicitly stated.

## 12. Owner/team review checklist

- [ ] Confirm `MSPEC-*`, `DA-*`, and `TS-*` namespaces are distinct from baseline identifiers.
- [ ] Confirm all six baseline role values remain visible and department responsibilities remain conditional.
- [ ] Confirm instructor processing is separately represented from office processing.
- [ ] Confirm multiple-role-per-user cardinality is not prescribed.
- [ ] Confirm individual and overall status are separate; display labels are derived only.
- [ ] Confirm `remarkRequiredOnReject` is scoped per `TemplateRequirement`; `UNSPECIFIED` and `OPTIONAL` share permissive demo runtime behavior but differ in documentary meaning; AW-007 stays open.
- [ ] Confirm DA-11 is acceptable as a demo-only completion condition and does not resolve CR-I05/AW-I06 institutionally.
- [ ] Confirm TS-10 is a seeded-fixture backend/database test, not an app workflow test.
- [ ] Confirm MSPEC-FR-016 and TS-05 are optional/Should and do not gate MAC-004/005.
- [ ] Confirm no default reopening/recovery action and TS-10 checks history only.
- [ ] Confirm no snapshot architecture is prescribed while TD-R09 is open.
- [ ] Ask instructor/registrar AW-I05 and record the answer with source/provenance.
- [ ] Confirm `Sample College` is appropriate for public-safe documentation until naming permission is resolved.
- [ ] Review every FR/BR/NFR/TS mapping; earlier spot-checks do not substitute for full owner/team review. Confirm FR-009 uses MVP-026 only as a boundary, FR-021/BR-14/TS-15 have no direct duplicate-policy baseline support, and in-app counters are not confused with MVP-023 report export.
- [ ] Decide whether to add a source row for the specification or external examples only after approval; allocate all IDs sequentially when the change is prepared. Do not reserve any future source ID in advance.
- [ ] Only after explicit approval, prepare CHG-003 with exact previous/new text and source-register updates if needed.

## 13. Change-control statement

No change to Requirements Baseline 0.1, `docs/decisions.md`, `docs/requirements/00-sources.md`, or `docs/change-log.md` is authorized by this review package. No CHG-003 is created or applied. `CDCMS-MVP-SPEC-001 v0.3` remains proposed review input, analogous in authority to the earlier AI-generated review material until accepted by the owner.

| Version | Date | Summary | Status |
|---|---|---|---|
| 0.2 | 2026-11-05 | Initial namespace-separated crosswalk and issue register. | Review input; not approved. |
| 0.3 | 2026-11-05 | Incorporated four main reviewer corrections and minor mapping/report/source-ID clarifications. | Review input; not approved. |


## Appendix A. Row counts

- Functional requirements mapped: **40** (`MSPEC-FR-001` through `MSPEC-FR-040`).
- Demo assumptions in specification: **11** (`DA-01` through `DA-11`); DA rows are listed in the specification, not duplicated as crosswalk mappings.
- Business rules mapped: **16** (`MSPEC-BR-01` through `MSPEC-BR-16`).
- Non-functional requirements mapped: **14** (`MSPEC-NFR-001` through `MSPEC-NFR-014`).
- Test scenarios mapped: **18** (`TS-01` through `TS-18`).
- This row count is a document-structure check, not proof that all baseline semantics have been formally verified.

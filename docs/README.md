# CDCMS Documentation Index

The repository contains the unchanged requirements baseline, the owner-approved working MVP foundation, the implementation plan, the first-slice source code, and environment/readiness materials.

## Authority order

1. **Requirements Baseline 0.1 as applied through CHG-001 and CHG-002** — authoritative requirements and unresolved questions.
2. **Owner-established project decisions** — authoritative within their recorded scope in the baseline decision register.
3. **MVP Specification v0.3, Traceability Crosswalk v0.3, and Execution Plan v0.3** — adopted by the owner on 2026-11-07 as the working MVP foundation. This adoption does not amend the baseline or authorize CHG-003.
4. **First-Slice Technical Contract Draft 0.3** — proposed implementation detail. Provisional pilot choices and review dispositions are separately recorded; the contract itself has not been republished as a new version.
5. **Implementation source code and pilot notes** — demonstrates an implementation attempt; tests/builds are only Verified when execution evidence is recorded.
6. **Fictional demo assumptions and test fixtures** — replaceable scaffolding, not actual institutional policy.
7. **Environment checklists and results** — limited machine/component evidence; they do not establish full M3 verification unless all required evidence and review are present.


## Current implementation evidence — 2026-11-08

- [`implementation/BUILD_AND_TEST_STATUS_2026-11-08.md`](implementation/BUILD_AND_TEST_STATUS_2026-11-08.md) — current owner-machine test/build/runtime evidence, including 17 passing unit tests, 19 passing integration tests, Vite production build, and explicit owner-reported versus screenshot/terminal evidence.
- [`evidence/POSTGRES_INTEGRATION_TEST_OUTPUT_2026-11-08.md`](evidence/POSTGRES_INTEGRATION_TEST_OUTPUT_2026-11-08.md) — sanitized owner-provided integration test output with the `cdcms_test` target confirmation.
- [`implementation/BUILD_AND_TEST_STATUS_2026-11-07.md`](implementation/BUILD_AND_TEST_STATUS_2026-11-07.md) — historical build-container snapshot only.
- [`implementation/FIRST_SLICE_IMPLEMENTATION_PILOT.md`](implementation/FIRST_SLICE_IMPLEMENTATION_PILOT.md) — provisional technology decisions, current runtime disposition, cookie compatibility observation, and carry-forward findings.

## Requirements baseline

- [`requirements/README.md`](requirements/README.md) — original baseline usage guide.
- [`decisions.md`](decisions.md) — established, suggested, recommended, and open technical decisions.
- [`change-log.md`](change-log.md) — baseline change history.
- [`source-archives/clearance-requirements-baseline-0.1-CHG-001-CHG-002.zip`](source-archives/clearance-requirements-baseline-0.1-CHG-001-CHG-002.zip) — exact applied baseline source archive.

## Working MVP foundation — owner-approved

- [`mvp/CDCMS_MVP_Requirements_Specification_v0.3.md`](mvp/CDCMS_MVP_Requirements_Specification_v0.3.md) — product scope, requirements, behavior, and scenarios.
- [`mvp/CDCMS_MVP_Traceability_Crosswalk_and_Issue_Register_v0.3.md`](mvp/CDCMS_MVP_Traceability_Crosswalk_and_Issue_Register_v0.3.md) — links MVP requirements and tests to baseline requirements and MAC criteria.
- [`planning/CDCMS_MVP_Scope_Decision_and_Team_Execution_Plan_v0.3.md`](planning/CDCMS_MVP_Scope_Decision_and_Team_Execution_Plan_v0.3.md) — P0–P7 execution stages.
- [`mvp/OWNER_APPROVAL_RECORD_2026-11-07.md`](mvp/OWNER_APPROVAL_RECORD_2026-11-07.md) — records owner adoption of the working MVP foundation.

## First-slice application source

- `../backend/` — Express API, PostgreSQL schema/migration, fictional seed, assignment service, and tests.
- `../web/` — React + Vite office reviewer portal.
- `../android/` — Java Android student clearance view.
- [`implementation/First-Slice_Technical_Contract_Draft_0.3.md`](implementation/First-Slice_Technical_Contract_Draft_0.3.md) — proposed first-slice contract.
- [`implementation/FIRST_SLICE_IMPLEMENTATION_PILOT.md`](implementation/FIRST_SLICE_IMPLEMENTATION_PILOT.md) — implemented pilot scope, provisional tool choices, and verification limitations.
- [`reviews/First-Slice_Contract_Review_Clarifications.md`](reviews/First-Slice_Contract_Review_Clarifications.md) — implementation dispositions for the 11 review points.

The slice demonstrates backend applicability assignment, one office-review workflow, decision history, derived completion, and a student's own Android view. It does not demonstrate admin configuration (MAC-004) or full instructor-and-office processing (MAC-006).

## Environment and stack readiness

- [`environment/M3_Environment_Readiness_Checklist_Ubuntu_Windows_v1.1.md`](environment/M3_Environment_Readiness_Checklist_Ubuntu_Windows_v1.1.md) — three-machine readiness procedure; official result log is incomplete.
- [`environment/TD-011_Stack_Readiness_Checklist.md`](environment/TD-011_Stack_Readiness_Checklist.md) — evaluates compatibility **and suitability** of the established stack.
- [`environment/M3_v1.2_Proposed_Node_PostgreSQL_Connection_Smoke_Check.md`](environment/M3_v1.2_Proposed_Node_PostgreSQL_Connection_Smoke_Check.md) — supplemental Node-to-PostgreSQL probe proposal; not part of M3 v1.1.
- [`environment/Ubuntu_Pilot_Results_Reported_2026-11-07.md`](environment/Ubuntu_Pilot_Results_Reported_2026-11-07.md) — sanitized summary of prior Ubuntu checks; reported results, not raw terminal transcript or completed M3 record.

## Status discipline

Use `Suggested`, `In Progress`, `Implemented`, `Verified`, and `Blocked`. Source code may be present while its runtime/build is still unverified. Mark a test Passed only when actual output/evidence matches its expected result. Keep test status separate from document approval and technical-decision status.

## Public-release caution

The instructor requires public GitHub repository visibility for progress review. Do not make the remote public until TD-R15 repository ownership, TD-R17 publication/ownership/licensing questions, and TD-020 publication-safety review are complete. Review all files and the full reachable Git history. Keep `Sample College`, fictional data, and secrets-free examples until permission is established. No license is included.

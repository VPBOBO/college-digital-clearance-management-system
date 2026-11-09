# Change Log (CHG)

Every change to a requirement, assumption or technical decision is recorded here. Nothing changes silently (SRC-02 §6). Newest entries go at the top.

## Entry template

```
### CHG-NNN · YYYY-MM-DD · <short title>
- Changed information: <IDs and what changed>
- Previous value: <exact previous text, or "none (new)">
- New value: <exact new text, or "removed">
- Reason: <why>
- Source: <SRC-xx, document, person, date>
- Affected components: <database / API / web / Android / workflow / documentation>
- Implementation consequences: <what must be redone or rechecked>
- Documents updated: <files>
- Checklist updated: <yes / no / not applicable>
```

Rules: IDs are never reused. When a requirement is removed, its row is deleted from the module and the previous text is copied into this log.

## Entries

### CHG-005 · 2026-11-09 · Establish assignment-time snapshots for historical clearance context
- Changed information: TD-R09 in `docs/decisions.md`; the TD-R09 technical design, field groups, and acceptance tests in `docs/planning/P2_Technical_Design_Package_v0.2.md`.
- Previous value: `TD-R09 | How template-versus-record separation preserves history (copy the template into each record at assignment, version the templates, or another method). | OPEN | UNKNOWN | UNDECIDED | SRC-01 §8; SRC-04 rule 6 | 2026-11-04 | Chosen at database design. Must satisfy RH-001 to RH-003.` P2 recommended a hybrid of immutable/versioned configuration and assignment-time snapshots, with owner approval not yet recorded.
- New value: The project owner approved assignment-time snapshots of effective configuration and responsibility values on student-specific clearance records, while retaining stable source references. Processing history remains separate and append-only. Full configuration versioning and a separate assignment-history table are not selected. The current responsibility scope is office-based; instructor responsibility remains conditional under IR-003. No retroactive correction or reassignment feature is approved.
- Reason: Preserve the meaning and responsibility context of existing clearance records after mutable configuration changes, using the smallest approach that fits the existing assignment workflow and avoids an unnecessary version-lifecycle framework.
- Source: SRC-01 §8; SRC-04 rule 6; project owner approval, 2026-11-09.
- Affected components: technical decision records, request/requirement data model, assignment service, historical staff/student read queries, decision validation, schema setup and tests.
- Implementation consequences: Define and implement request-level snapshots for template, academic-period and student-program context; requirement-level snapshots for requirement identity/display, mandatory treatment, rejection-remark policy, applicable-program context and responsible office identity/display; retain the existing source references and processing-history events. Historical reads must use the snapshots rather than mutable active configuration joins. New assignments must capture current effective values in the assignment transaction. Existing records can only be backfilled from the configuration currently linked to them; prior values that were changed before the backfill cannot be reconstructed. The current schema has no requirement description/instructions field, so none is added by this decision. Do not add instructor snapshot fields until IR-003 is resolved. Keep configuration records referenced by historical records; deactivation excludes them from future assignment without hiding past records. Do not add a retroactive correction/reassignment operation. `backend/src/migrate.js` currently reapplies the guarded development `schema.sql`; this is not a versioned migration framework, and TD-R11 tool selection remains separate. Implementation and HIST test results are not yet verified by this documentation change.
- Documents updated: `docs/decisions.md`; `docs/planning/P2_Technical_Design_Package_v0.2.md`; `docs/change-log.md`.
- Checklist updated: not applicable; Requirements Baseline 0.1 and owner-approved MVP Specification v0.3 remain unchanged.

### CHG-004 · 2026-11-09 · Establish server-managed sessions for the academic MVP
- Changed information: TD-R01 in `docs/decisions.md`; P2 technical design package status and authentication section; documentation index.
- Previous value: TD-R01 was listed as OPEN / UNKNOWN / UNDECIDED, asking whether the web and Android clients should use sessions or tokens.
- New value: The project owner approved opaque, server-managed sessions for the academic MVP. The backend issues random session tokens, stores only their SHA-256 digests, validates session expiry and account activity, checks current authorization on protected requests, and invalidates sessions on logout. Argon2id remains governed separately by TD-006.
- Reason: Retain the approach already used by the working pilot, avoid unnecessary authentication migration, and prioritize a usable end-to-end MVP over additional infrastructure.
- Source: Project owner approval, 2026-11-09; SRC-01 §9.
- Affected components: backend authentication, web and Android session use, functional verification, and project documentation.
- Implementation consequences: Keep the existing session approach. Verify the essential sign-in, authenticated-request, logout, expiry, account-activity, authorization, browser and Android flows. Fix only demonstrated problems that prevent the approved MVP workflow from working. Do not introduce JWT migration, token-refresh infrastructure, another authentication framework, or optional hardening by default. The approval does not mark unrun tests as passed.
- Documents updated: `docs/decisions.md`; `docs/planning/P2_Technical_Design_Package_v0.2.md`; `docs/implementation/BUILD_AND_TEST_STATUS_2026-11-09.md`; `docs/development-progress.md`; `docs/README.md`; `docs/change-log.md`.
- Checklist updated: not applicable; Requirements Baseline 0.1 and owner-approved MVP v0.3 remain unchanged. Functional verification remains separate.

### CHG-003 · 2026-11-08 · Choose a simple password for fictional local demo accounts
- Changed information: local demo account credential convention and its supporting documentation; no baseline requirement or institutional policy changed.
- Previous value: the example configuration used the earlier documented demo password, and the reset utility required at least 12 characters.
- New value: the owner selected `test123` as the shared public password for the five fictional local demo accounts; the example configuration uses it, and the guarded reset utility accepts it with a seven-character minimum.
- Reason: make local classroom demonstrations and testing easier for classmates.
- Source: SRC-20.
- Affected components: demo seed configuration, guarded password-reset utility, setup guides, and decision records.
- Implementation consequences: fresh local demo accounts use `test123`; existing accounts keep their current passwords until the guarded local reset is deliberately run. Loopback, development-mode, `_dev` database, and LAN-disabled safeguards remain in place. This value is not for real accounts or hosted/production use.
- Documents updated: `backend/.env.example`; `backend/src/demo-password-reset.js`; `backend/test/demo-password-reset.test.js`; root and component READMEs; `SETUP-WINDOWS.md`; `HOW-TO-USE.md`; `TESTING.md`; `TROUBLESHOOTING.md`; `docs/decisions.md`; `docs/requirements/00-sources.md`; `docs/implementation/First-Slice_Technical_Contract_Draft_0.3.md`.
- Checklist updated: not applicable; Requirements Baseline 0.1 is not amended.


### CHG-002 · 2026-11-05 · Protect original clearance forms and interview records from public publication
- Changed information: Step 0 in `docs/requirements/form-integration-checklist.md`.
- Previous value: `Add the form to [00-sources.md](00-sources.md) (change SRC-FORM from "NOT YET AVAILABLE" to available, with date and who provided it). Keep a copy of the form with the project records, with any real student data removed.`
- New value: `Add the form to [00-sources.md](00-sources.md) (change SRC-FORM from "NOT YET AVAILABLE" to available, with date and who provided it). Keep the original form and raw interview records only in an institution-approved restricted location outside the public repository. Do not commit original forms, raw interview notes, or real student data to the repository, even temporarily. Record and publish only the minimum sanitized institutional facts needed for the requirements baseline, and only when their publication is authorized by the institution. If a redacted copy is needed for internal analysis, keep it in the approved restricted location unless the institution explicitly authorizes publication.`
- Reason: The final repository is intended to be public. Original institutional forms and raw interview records may contain confidential institutional or personal information and must not enter the public repository or its history. This change protects source materials while allowing only minimum, sanitized, authorized facts to be reflected in the requirements baseline.
- Source: SRC-06 (owner-reported public repository requirement); SRC-14 (owner approval to apply this change); SRC-FORM and SRC-INST when received; applicable institutional publication/privacy policy when supplied.
- Affected components: requirements documentation, institutional source handling, publication safety.
- Implementation consequences: store original forms and raw interview records only in an institution-approved restricted location; inform the team where approved restricted source materials are stored; publish only authorized sanitized facts. If no approved restricted location exists, do not receive/store source records in the project repository; resolve handling with the institution before processing them.
- Documents updated: `docs/requirements/form-integration-checklist.md`; `docs/change-log.md`.
- Checklist updated: yes — Step 0 wording changed; status remains `[ ]` because the actual form has not been received and processed.

### CHG-001 · 2026-11-05 · Approve repository foundation decisions and clarify source traceability
- Changed information:
  - `docs/decisions.md`: add owner-established decisions TD-012 through TD-021; remove superseded recommendation TD-R05; add provisional recommendations TD-R12 and TD-R16; add open decisions TD-R13, TD-R14, TD-R15, and TD-R17; add the TD/TD-R identifier-prefix convention; and update the decision-basis wording for `RECOMMENDED`.
  - `docs/requirements/README.md`: generalize the `RECOMMENDED` definition from Claude-only wording to AI-assistant advice, while preserving that recommendations are not decisions.
  - `docs/requirements/00-sources.md`: add SRC-06 through SRC-19 and clarify the location/status limitation for SRC-01 without changing its availability value.
  - `docs/change-log.md`: record this change and CHG-002.
- Previous value:
  - TD-R05: `Repository layout: a single repository holding backend, web, Android and docs folders.` Basis: `RECOMMENDED`; Info status: `PROVISIONAL`; Class: `UNDECIDED`; Source: `SRC-05`; Updated: `2026-11-04`; Notes: `Not created yet.`
  - `docs/decisions.md` decision-basis definition: `ESTABLISHED (owner specified) · SUGGESTED (brief proposed it as a starting point) · RECOMMENDED (Claude proposed it) · OPEN (not decided).`
  - `docs/requirements/README.md` §4 definition: `RECOMMENDED | Proposed by Claude. Not a decision.`
  - `docs/requirements/README.md` §2 note: `Anything proposed by Claude (SRC-05) is at most PROVISIONAL.`
  - SRC-01 source-register row: `| SRC-01 | Project brief: "College Digital Clearance Management System" | Project owner | 2026-11-03 | Authoritative for project goals, system requirements and technology choices. **Not** authoritative for institutional facts: the offices, programs, subjects and sections it names are examples. | Available |`
  - No TD-012 through TD-021, TD-R12, TD-R13, TD-R14, TD-R15, TD-R16, or TD-R17 rows existed in Requirements Baseline 0.1.
- New value:
  - TD-012 through TD-021 are added as owner-established decisions exactly as recorded in `docs/decisions.md`, with approval date `2026-11-05` and source SRC-14, except TD-015 which cites SRC-06 and SRC-14.
  - Exact owner-established decision texts:
    - TD-012: Use one Git repository for the backend, staff/admin web application, student Android application, and project documentation.
    - TD-013: Use top-level `android/`, `backend/`, `web/`, and `docs/` folders; preserve the baseline paths and relative links.
    - TD-014: Keep `backend/` and `web/` as independent npm projects without npm workspaces initially; Android remains a separate Gradle project.
    - TD-015: The GitHub repository must be public so the instructor can review progress, as reported by the owner; public release is subject to TD-020.
    - TD-016: Use feature branches and pull requests for changes to `main`; another team member reviews before merge.
    - TD-017: Include `.gitignore` and `.gitattributes` from the first repository commit; review their contents before creation.
    - TD-018: Declare the supported Node.js major range in each npm project's `engines.node`; record the exact tested development version in `.nvmrc` and change it through a logged maintenance decision.
    - TD-019: Track work in `docs/development-progress.md` with `Suggested`, `In Progress`, `Implemented`, `Verified`, and `Blocked`; `Verified` requires recorded evidence.
    - TD-020: Complete and record a publication-safety review of current repository contents and full reachable Git history before public release.
    - TD-021: Use `docs/README.md` as the overall documentation index while preserving `docs/requirements/README.md` as the modular-baseline index.
  - TD-R05 is removed; its identifier is never reused. The approved repository strategy and folder layout are represented separately by TD-012 and TD-013.
  - TD-R12 and TD-R16 are added as `RECOMMENDED / PROVISIONAL / UNDECIDED`, not as owner-approved decisions. Their exact decision texts are:
    - TD-R12: `Use Node.js 26.13.0 as the current working candidate for compatibility evaluation; do not treat it as the selected project standard until Argon2, Vite, Express, and cross-machine checks are complete.`
    - TD-R16: `After public release, configure a main branch ruleset requiring pull requests, one approval from a different team member with write permission (preferably also requiring approval from someone other than the last pusher), blocking force pushes and deletion, and limiting/documenting bypass permissions.`
  - TD-R13, TD-R14, TD-R15, and TD-R17 are added as `OPEN / UNKNOWN / UNDECIDED`. Their exact open questions are:
    - TD-R13: `Which Node.js version manager and operating mode do the two Windows developers use, and does each configuration resolve the agreed project version file correctly?`
    - TD-R14: `What Android applicationId should the student app use?`
    - TD-R15: `Who should own the GitHub repository: a personal account or a GitHub organization, and who will administer it and maintain access if a member leaves?`
    - TD-R17: `What school/college publication, intellectual-property, ownership, licensing, attribution, or submission rules affect the public repository?`
  - The decision-basis definition becomes `RECOMMENDED (an AI assistant proposed it as advice; not a decision)` in `docs/decisions.md` and `Proposed by an AI assistant as advice. Not a decision.` in `docs/requirements/README.md` §4. The assistant/source provenance remains recorded in source fields and the source register.
  - The §2 provisionality note becomes `Anything proposed by an AI assistant (including items documented in SRC-05 and SRC-07) is at most PROVISIONAL until the project owner or college accepts it.`
  - The following identifier convention is added: `The TD and TD-R prefixes preserve the identifiers originally assigned to technical decisions and recommendations; the prefix does not determine the row's current section or decision basis. Section placement and the Decision basis field determine its current status. IDs are never reused or renumbered.`
  - SRC-06 through SRC-19 are added with the exact source descriptions, authority limits, dates, and availability statements recorded in `docs/requirements/00-sources.md`. SRC-14 records only the approval scope stated in that row.
  - SRC-01 remains `Available`; the source-register note now states that the original file was not included in the supplied 18-file archive and its storage location was not supplied in the reviewed materials.
- Reason: establish a traceable repository and documentation foundation for the baseline and MVP planning without deciding institutional requirements or untested technical details; record the owner-reported public-repository requirement; require a publication-safety review; preserve unresolved compatibility, ownership, naming, and licensing questions; and distinguish owner decisions from AI recommendations.
- Source: SRC-06 (owner report of instructor direction); SRC-07 and SRC-08 (non-authoritative planning/review inputs); SRC-09 through SRC-12 and SRC-15 through SRC-19 (technical documentation sources); SRC-13 (owner-reported Ubuntu environment observations); SRC-14 (owner approval on 2026-11-05).
- Affected components: technical decisions, repository structure, team collaboration, development environment policy, requirements documentation, source traceability, and publication preparation.
- Implementation consequences: repository initialization, folder creation, `.gitignore`, `.gitattributes`, `docs/README.md`, `docs/development-progress.md`, GitHub rulesets, and the publication-safety checklist remain separate tasks. TD-R12 through TD-R17 remain unresolved or provisional as indicated. No database schema, API contract, or application code is created or finalized by this change.
- Documents updated: `docs/decisions.md`; `docs/requirements/README.md`; `docs/requirements/00-sources.md`; `docs/change-log.md`.
- Checklist updated: no — CHG-001 does not change the form-integration checklist; CHG-002 records that separate change.

### CHG-000 · 2026-11-04 · Initial requirements baseline created
- Changed information: all entries in `docs/requirements/*` and `docs/decisions.md` (new).
- Previous value: none (new).
- New value: baseline 0.1. Institutional information is UNKNOWN or PROVISIONAL. Project-owner requirements and technical decisions are CONFIRMED in the sense defined in `requirements/README.md` §2.
- Reason: establish an editable baseline before the actual clearance form is available.
- Source: SRC-01, SRC-02, SRC-03, SRC-04, SRC-05.
- Affected components: documentation only. No database schema and no application code exist or were changed.
- Implementation consequences: none yet.
- Documents updated: all files in this baseline.
- Checklist updated: not applicable (`docs/development-progress.md` does not exist yet).

## 2026-11-08 — First-slice owner-machine verification and documentation reconciliation

- Recorded owner-provided results: backend unit tests 17/17, PostgreSQL integration tests 19/19 against `cdcms_test`, and successful Vite production build.
- Recorded owner-reported production preview/reviewer flows and Android reviewer-to-student status refresh with evidence limitations.
- Updated root and component READMEs for current lockfiles, Gradle Wrapper, Vite preview CORS origin, and physical-phone ADB reverse workflow.
- Added middleware tests for quoted, unquoted, and malformed session cookies; retained the private cookie parser.
- Preserved the 2026-11-07 build-container status as historical and carried forward five open review findings.
- Added project package manifest/checksums; excluded generated Android `.cache` from the cleaned source package.

## 2026-11-08 — Package revision 2: publication-safety and contract reconciliation

- Removed Eclipse/Buildship/Java-language-server metadata from the Android tree after review identified a private local home-directory path in Buildship preferences.
- Added root `.gitignore` patterns for `.project`, `.classpath`, `.settings/`, and `bin/` across the repository.
- Removed the Android sign-in error diagnostic that displayed the saved-cookie count.
- Clarified that Android stores/attaches cookies explicitly per request through `CookieManager`; the cause of the earlier quoted-cookie observation and the source of successful sign-in remain unproven.
- Added the implemented staff review-item detail route to the first-slice technical contract, while preserving the 404/403 disclosure difference as an open policy decision.
- Added sanitized owner-supplied integration test output and regenerated SHA-256 inventory.
- Fresh `npm ci` attempts in the package-preparation environment timed out; clean installs remain outstanding on the owner's machine.

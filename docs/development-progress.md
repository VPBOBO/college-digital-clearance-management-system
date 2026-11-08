# CDCMS Development Progress

**Last updated:** 2026-11-08  
**Authority:** Requirements Baseline 0.1 as applied through CHG-001/CHG-002 and owner-approved working MVP foundation.  
**Current implementation status:** First slice is runnable and has passed the owner-provided backend unit and PostgreSQL integration suites plus the web production build. The complete MVP is not finished.

Use `Suggested`, `In Progress`, `Implemented`, `Verified`, and `Blocked`. Runtime evidence is classified in [`implementation/BUILD_AND_TEST_STATUS_2026-11-08.md`](implementation/BUILD_AND_TEST_STATUS_2026-11-08.md); owner-provided output is not described as an independent execution by the reviewer.

| Work item | Status | Current evidence / note | Next action |
|---|---|---|---|
| Requirements Baseline 0.1 + CHG-001/CHG-002 | Implemented | Applied 18-file baseline retained and archived. | Preserve baseline authority and change control. |
| MVP Specification v0.3 | Implemented | Owner approved it on 2026-11-07 as the working MVP foundation. | Use as product scope authority below baseline. |
| MVP Traceability Crosswalk v0.3 | Implemented | Owner approved it as a working traceability aid; mappings are not proof of MAC passes. | Keep adding actual implementation evidence as features expand. |
| MVP Execution Plan v0.3 | Implemented | Owner approved it as the working execution plan. | Deliver short integrated increments; avoid preparation-only loops. |
| Backend first-slice source | Verified for tested first-slice paths | Owner supplied 17/17 unit tests and 19/19 PostgreSQL integration tests. Includes auth, assignment, office scope, decision/history, completion, rollback, concurrency, and reset guards. | Continue targeted fixes and maintain test evidence. |
| Web first-slice source | Verified for current demo path | Vite production build passed; owner reports production preview, reviewer sign-in, and status filters work. Reviewer B `All` screenshot supports Office B scoping. | Add more UI acceptance evidence if user flows change. |
| Android first-slice source | Implemented; owner-reported runtime success | Owner reports Gradle debug build, installation on physical phone, sign-in and clearance display. ADB reverse is the current physical-phone connection method. | Capture before/after screenshots linked to the exact requirement record. |
| Backend unit tests | Verified (owner output) | 17 passed, 0 failed, 0 skipped on 2026-11-08; includes quoted/unquoted/malformed cookie middleware cases. | Rerun after relevant backend/test changes. |
| PostgreSQL integration tests | Verified (owner output) | 19 passed, 0 failed, 0 skipped on 2026-11-08 using `cdcms_test`, not `cdcms_dev`. | Rerun after schema, service, route, or integration-test changes. |
| Review-to-student workflow | Implemented; owner-reported with partial DB evidence | Owner reports reviewer A approval appeared Approved after Android refresh. SQL output shows `Pending → Approved` by reviewer A; query omitted record ID and phone screenshots were not supplied here. | Capture matching before/after phone screens and history row with requirement record ID. |
| First-Slice Contract Draft 0.3 | In Progress | Remains a draft. Review clarifications have provisional implementation dispositions. | Update traceability with test evidence; do not present provisional choices as permanent decisions. |
| M3 v1.1 environment readiness | In Progress | Current Ubuntu component checks do not complete all M3 evidence and review items. | Complete missing Windows records and formal evidence review. |
| TD-011 compatibility and suitability evaluation | In Progress | Successful component tests exist; broader project-fit/suitability assessment remains incomplete. | Evaluate compatibility and suitability, not only successful installation. |
| TD-R01 authentication decision | In Progress | Cookie session is implemented; Android now explicitly stores/attaches cookies per request through `CookieManager` without a global `CookieHandler`; backend quote tolerance has middleware unit tests. The cause of the earlier quoted value and which change enabled sign-in are unproven. Final browser/mobile mechanism remains open. | Compare cookie sessions and bearer-token transport and record owner decision. |
| TD-R09 history implementation | In Progress | Status update and event insert share a transaction; integration tests cover rollback and append-only/delete restrictions. Full template/configuration history strategy remains open. | Resolve broader history design before claiming it complete. |
| TD-R11 additional tools/libraries | In Progress | Pilot uses Express, `pg`, Argon2, dotenv, direct SQL, one schema script, Node `node:test`, browser fetch, and Android APIs. | Review versions and decide standards for later increments. |
| TD-R12 Node.js standard | In Progress | Node 26.13.0 is tested on the owner's machine but remains a candidate, not an approved team standard. | Verify required team environments and record decision. |
| TD-R14 Android application ID | In Progress | `com.samplecollege.cdcms` used provisionally. | Confirm before distribution/publication. |
| TD-R15 repository owner | Blocked | Repository ownership/admin arrangement remains open. | Resolve before public remote setup. |
| TD-R17 publication/IP/ownership/licensing | Blocked | School publication/IP/ownership/licensing rules are not recorded as resolved. | Resolve before public release and license choice. |
| TD-020 public release review | Blocked | Full file/history publication-safety review is not complete. | Review all files and full reachable Git history before public release. |
| Public repository release | Blocked pending gates | Instructor requires public GitHub visibility, but this source archive omits `.git` history and no remote is configured in this package. | Resolve TD-R15/TD-R17/TD-020, then publish the reviewed project. |

## Carry-forward review findings

1. Failed seed may lose generated password — recovery behavior remains open.
2. `.env.example` sets `ALLOW_*` values to `YES` — confirmed in current sample; deliberate opt-in strength remains under review.
3. Dummy password hash is created lazily — confirmed in `auth.js`; first unknown-user timing remains an evaluation item.
4. Staff detail route returns 404 for another office's item while the decision route returns 403; the detail route is now documented in the draft contract, and the disclosure-policy decision remains open.
5. `HOST` is a generic environment variable name — remains in current source; consider a project-prefixed name in a controlled change.

## Status discipline

- A written plan is not an implemented feature.
- Source code is not proof that dependencies install, builds succeed, or a system runs.
- A successful first slice does not mean the full MVP is complete.
- M3 results are not identical to TD-011's broader compatibility and suitability evaluation.
- Do not mark MAC-001 through MAC-011 passed until their individual required evidence exists.

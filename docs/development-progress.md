# Project Progress

**Last updated:** 2026-11-09

This page is a quick view of the project. Latest authentication/session verification is recorded in [`implementation/BUILD_AND_TEST_STATUS_2026-11-09.md`](implementation/BUILD_AND_TEST_STATUS_2026-11-09.md); earlier build and test results are in [`implementation/BUILD_AND_TEST_STATUS_2026-11-08.md`](implementation/BUILD_AND_TEST_STATUS_2026-11-08.md).

| Area | Current status | Notes / next step |
|---|---|---|
| Requirements Baseline 0.1 | In use | The original baseline and its change history are preserved. The actual clearance form and institutional policies are still unavailable. |
| MVP specification v0.3 | Working project scope | Adopted by the owner as the working MVP foundation on 2026-11-07. It does not replace the baseline. |
| Backend | First working slice implemented | API, sign-in, office review, decisions, history, assignment, and derived completion are present. |
| Backend unit tests | Passed — 28/28 | Owner reran `npm test` on 2026-11-09; 28 passed, 0 failed, 0 skipped. See the 2026-11-09 build/test status report. |
| PostgreSQL integration tests | Passed — 22/22 | Owner reran on 2026-11-09 against the verified local `cdcms_test` database; 22 passed, 0 failed, 0 skipped. Three focused session tests were added: expiry, logout/replay, and inactive account. See the 2026-11-09 build/test status report. |
| Authentication/session verification | Partially verified | TD-R01 is owner-established. AUTH-04, AUTH-05 and AUTH-06 passed dedicated integration tests. Other checks and Android restart behavior are qualified in the 2026-11-09 build/test status report. |
| Staff website | First-slice demo working | The owner reports both reviewer accounts signed in after the password reset and saw their expected office-specific sample records. The production build was also reported successful. |
| Android student app | First-slice demo working | The owner previously reported physical-phone sign-in and sample-record viewing. The session cookie is held in memory; after a full app process restart, the student signs in again. Restart/expiry behavior has not been separately tested on the device. |
| Admin screens | Not implemented | Sample data is configured through the backend seed, not through an admin interface. |
| Instructor workflow | Not implemented | Full instructor clearance processing is still a future task. |
| Windows setup | Not verified | A teammate needs to complete the Windows setup guide and record the outcome. |
| Node.js team version | Open | Node.js 26.13.0 is the owner's working version; the final team standard has not been selected. |
| Repository | Public on GitHub | `main` is on the project owner's personal GitHub account. |
| TD-020 publication review | Partially completed; still in progress | The machine-specific hardware details found in the initial history were removed and the initial commit was rewritten. Other repository, GitHub, and institutional-policy checks remain. See the publication review note. |
| TD-R15 repository ownership | Current account selected in practice | The repository is currently under the owner's personal account. Long-term administrator succession/transfer arrangements are not yet recorded. |
| TD-R17 school publication and licensing rules | Open | Check school rules. No license is included or implied. |
| Full MVP | Not finished | Admin configuration and full instructor processing remain incomplete. Do not describe the project as a finished clearance system. |

## What to work on next

1. Have a Windows teammate follow `SETUP-WINDOWS.md` from a fresh clone and record the actual setup, database, and sign-in results.
2. Continue the public-repository review and check applicable school publication and licensing rules.
3. Continue building the admin and instructor parts of the MVP.

A feature is not complete just because its code or a guide exists. Record what was actually run and what still needs checking.

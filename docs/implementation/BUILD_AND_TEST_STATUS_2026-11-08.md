# CDCMS First-Slice Build, Test, and Runtime Status

**Status date:** 2026-11-08  
**Project workspace:** Owner's Ubuntu machine  
**Evidence basis:** Owner-supplied terminal output, owner-reported interactive checks, and supplied screenshot. The package creator did not execute commands against the owner's workstation or PostgreSQL instance. The dependency-free unit suite and JavaScript syntax checks were rerun against the extracted source copy in an isolated package workspace (Node.js 22.16.0).

After the reset-password validator was changed to accept the local demo password `test123`, the owner reran `npm test` on the Ubuntu project machine. The supplied terminal output reports 28 passed, 0 failed, and 0 skipped. This successful owner-machine run supersedes the incomplete test attempt in the separate packaging environment, where `npm ci` timed out and `argon2` could not be imported. The full 28-test output has not been saved as a separate repository evidence file.

This is the current first-slice implementation status. The separate [`BUILD_AND_TEST_STATUS_2026-11-07.md`](BUILD_AND_TEST_STATUS_2026-11-07.md) remains as a historical build-container snapshot and must not be mistaken for the current owner-machine result.

## 1. Current verification summary

| Area | Result | Evidence class and qualification |
|---|---|---|
| Backend unit tests (`npm test`) | **PASS — 28 passed, 0 failed, 0 skipped** | Owner supplied terminal output after the `test123` validation adjustment on 2026-11-08. The full output is not saved as a separate evidence file. |
| PostgreSQL integration suite (`npm run test:integration`) | **PASS — latest owner rerun: 19 passed, 0 failed, 0 skipped** | Owner supplied terminal output after the `test123` validation update on 2026-11-08; latest output is not saved separately. Target: `cdcms_test`. An earlier run is saved in `docs/evidence/POSTGRES_INTEGRATION_TEST_OUTPUT_2026-11-08_AFTER_PASSWORD_CHANGES.txt`. |
| Integration history protection | **PASS** | The formerly failing append-only/deletion test passed after its assertions were corrected to check the two `RESTRICT` foreign keys and SQLSTATE `23001`. |
| Web production build (`npm run build`) | **PASS** | Owner supplied Vite 8.3.6 output: 17 modules transformed, 210 ms. |
| Web production preview | **PASS — owner-reported** | Owner reported the preview page loaded after `WEB_ORIGINS` included `http://127.0.0.1:4173` and the backend was restarted. |
| Reviewer A sign-in and filters | **PASS — owner-reported** | After the password reset, the owner confirmed reviewer A signed in and saw its expected office-specific sample records. Earlier filter checks are recorded below. |
| Reviewer B sign-in and filters | **PASS — screenshot-supported / owner-reported** | After the password reset, the owner confirmed reviewer B signed in and saw its expected office-specific sample records. The supplied screenshot also shows the earlier `All` filter result with the Office B sample item and no Office A item. |
| Reviewer office isolation | **PASS** | Integration test `FS-03B` verifies reviewer B's list contains only Office B and detail access to Office A returns 404; supplied screenshot supports the production UI list behavior. |
| Android Gradle debug build | **PASS — R2 rebuild** | Owner supplied `BUILD SUCCESSFUL` output: Java 17, Gradle 8.9, 32 tasks, 16 seconds. |
| Android APK installation and sign-in | **PASS — owner-reported** | After the password reset, the owner reports that both `student-a` and `student-b` signed in on a physical Android phone and displayed their own sample records. ADB reverse was configured and the phone reached the backend health endpoint. |
| Reviewer-to-student status refresh | **PASS — owner-reported, with database evidence** | Owner reported that after reviewer A approved the Office A item, refreshing the student app displayed Approved. The supplied SQL output contains `Pending → Approved` by `reviewer-a`; it does not identify the requirement/record ID, so the link between the UI item and exact history row is not independently demonstrated in this report. |
| Processing history query | **PASS — terminal output supplied** | Record 1: DEMO-STU-001 / REQ-A / Office A / Approved by reviewer-a. Record 2: DEMO-STU-002 / REQ-B / Office B / Rejected by reviewer-b. |
| Gradle wrapper JAR checksum | **MATCH** | SHA-256 calculated from the uploaded source archive: `498495120a03b9a6ab5d155f5de3c8f0d986a449153702fb80fc80e134484f17`. It matches Gradle's official Gradle 8.9 wrapper JAR value at <https://gradle.org/release-checksums/>. |
| Gradle 8.9 distribution checksum | **PIN PRESENT; local ZIP hash not available here** | `gradle-wrapper.properties` pins `d725d707bfabd4dfdc958c624003b3c80accc03f7037b5122c4b1d0ef15cecab`, matching Gradle's official page. The distribution ZIP was not part of the uploaded source archive, so no locally calculated ZIP hash is claimed. |
| Package lockfiles | **PRESENT** | Both `backend/package-lock.json` and `web/package-lock.json` are included in the uploaded archive. Fresh `npm ci` was attempted in the package-preparation environment but timed out before completing; see the separate clean-install row below. |
| Clean dependency install (`npm ci`) | **PASS — owner Ubuntu machine** | Backend: 92 packages, 0 vulnerabilities. Web: 18 packages, 0 vulnerabilities. |
| Windows build/test | **NOT RUN** | No Windows evidence supplied. |
| Full M3 environment readiness | **INCOMPLETE** | Current Linux pilot tests do not complete all M3 machine/evidence/review requirements. |
| TD-011 stack suitability | **OPEN** | Successful component tests are not a full stack suitability evaluation. |
| Teammate review | **NOT RECORDED** | No review evidence supplied. |

## 2. Backend unit-test details

**Latest working-tree update (2026-11-08):** The owner subsequently ran 28 unit tests successfully after implementing the demo-password reset utility and independently salted Argon2id hashes. The complete terminal output was supplied in the conversation. The earlier 17-test results below describe the previous source revision and are historical, superseded results.

The latest 28-test suite includes the original domain, authentication, cookie, and database-safety tests, plus demo-password validation, database-target restrictions, account restrictions, and independent password-hash verification.

Historical pre-update details:


The package creator ran `npm test` against the extracted source package using Node.js 22.16.0; it passed 17/17. The owner also ran the suite on the owner workstation and supplied the matching 17/17 terminal summary. The package creator ran `node --check` for all backend source, test, and script `.js` files; all parsed successfully.

The owner ran `node --check test/auth.test.js` with no syntax error and then `npm test` from `backend/`.

The 17 tests passed, including:

- Unknown usernames still execute one Argon2 dummy-hash verification.
- Quoted session cookie is unwrapped before its token digest is queried.
- Unquoted session cookie uses the same token digest.
- An unmatched quote is ignored without setting `req.user` or performing a session query.
- The middleware emits no console output during the tested cases.
- Database safety, completion calculation, remark normalization, and decision validation.

The authentication tests exercise `createAuthMiddleware(pool)` with a fake pool; the private cookie parser was not made public for tests. A malformed cookie causes the auth middleware to call `next()` without a user; `requireAuthentication` later produces the unauthorized response.

## 3. PostgreSQL integration-test details

**Earlier saved owner-machine run (2026-11-08):** After the demo-password and seed-hashing changes, the owner ran the integration suite against `cdcms_test`; the result was 19 passed, 0 failed, 0 skipped. Its saved output is `docs/evidence/POSTGRES_INTEGRATION_TEST_OUTPUT_2026-11-08_AFTER_PASSWORD_CHANGES.txt`. The owner later reran the suite after the reset-password validator was changed to accept `test123`; that latest result is recorded in the summary table above. The latest console output was supplied in the project conversation but is not saved as a separate file.

The launcher confirmed `cdcms_dev` as the source configuration, `cdcms_test` as the integration target, and `cdcms_app` as the database role. The suite reset only the dedicated test database. Two expected `P0001` fault-injection messages appeared; both rollback tests passed.

Historical earlier-run details:


The dedicated `cdcms_test` database was created with owner `cdcms_app`. A read-only ownership query showed both `cdcms_dev` and `cdcms_test` owned by `cdcms_app` at creation time.

Before starting the suite, the supplied launcher checked that the source `.env` database was `cdcms_dev`, that the host was loopback, and that the database user was `cdcms_app`; it derived `TEST_DATABASE_URL` by replacing only the database name with `cdcms_test` and enabled the explicit reset flag for the child process. The actual output stated:

```text
Source configuration checked: cdcms_dev.
Integration target: cdcms_test.
Database owner: cdcms_app.
Starting integration tests...
```

The suite completed **19/19** with no failures or skips. Its tests include FS-01 through FS-17 coverage represented in this first slice, including parallel competing decisions, duplicate assignment, history rollback, history append-only protections, and foreign-key delete restrictions. Two `Unhandled API error: P0001` log lines appeared during intentional database fault-injection cases; both corresponding rollback tests passed.

Do not point this suite at `cdcms_dev`. Every integration test resets the `public` schema in the configured `_test` database.

## 4. Browser and mobile workflow evidence

### Web portal

- Vite `npm run build` completed successfully.
- `npm run preview -- --host 127.0.0.1` served the production build at the local preview origin.
- First login attempt was blocked because the backend's `WEB_ORIGINS` did not include `http://127.0.0.1:4173`.
- Owner added that exact origin to the local backend `.env`, restarted the API, and reported successful staff authentication.
- Reviewer A's Approved/All views and Reviewer B's Rejected/All views behaved as expected according to owner report.
- The supplied Reviewer B screenshot shows the `All` filter containing Sample Requirement B for Sample Student B, Office B, with status Rejected; the Office A item is not listed.

### Physical Android phone

The tested connection uses ADB reverse rather than exposing the backend to the LAN:

```bash
adb -s DEVICE_SERIAL reverse tcp:3000 tcp:3000
```

The Android app uses `http://localhost:3000`; the backend remains bound to `127.0.0.1:3000`. The ADB wireless-debugging serial/port may change after sleep/reconnect, so developers must inspect `adb devices` and use the current serial.

After the password reset, the owner reports that `student-a` and `student-b` both signed in successfully on the physical Android phone and displayed their own sample records. The phone reached the backend through ADB reverse while the API remained bound to loopback. The owner also reports that the student status refresh worked after an office review. The previously supplied history query does not include the requirement record identifier, so a matching before/after screenshot and history row with `requirement_record_id` would provide a stronger trace for FS-12/MAC-008.

## 5. Gradle checksum note

Official Gradle release-checksum reference: <https://gradle.org/release-checksums/>.

| Artifact | Local evidence | Official Gradle value | Result |
|---|---|---|---|
| Gradle 8.9 wrapper JAR | `498495120a03b9a6ab5d155f5de3c8f0d986a449153702fb80fc80e134484f17` (calculated from uploaded archive file) | `498495120a03b9a6ab5d155f5de3c8f0d986a449153702fb80fc80e134484f17` | Match |
| Gradle 8.9 binary ZIP | Not included in uploaded archive; no new local ZIP hash calculated | `d725d707bfabd4dfdc958c624003b3c80accc03f7037b5122c4b1d0ef15cecab` | Official value matches pinned property; local archive comparison unavailable |

A successful Wrapper build with `distributionSha256Sum` configured is evidence that the downloaded distribution was accepted, but this report does not claim a fresh local ZIP hash because the ZIP was not supplied.

## 6. Carry-forward review findings

These five issues from the v0.1.1 review remain in the follow-up register and are not blockers for the currently passing representative workflow:

| Finding | Current disposition |
|---|---|
| If `SEED_PASSWORD` is blank, a failed seed may lose the generated password printed only once. | The checked-in `.env.example` now supplies the fixed local demo password `test123`; this concern applies only when a developer removes that value and uses random generation. |
| `.env.example` pre-sets `ALLOW_*` flags to `YES`. | Confirmed in uploaded template; review whether the example should default to `NO` and require deliberate opt-in. |
| Dummy hash is created lazily. | Confirmed in current `auth.js` (`WeakMap` cache populated on first need); evaluate first unknown-user login latency and initialization choice. |
| Staff detail route returns 404 for another office's item while decision route returns 403. | 404/403 behavior is present in current code/tests; the detail route is now listed in the technical contract, and the disclosure difference remains a policy decision to resolve before production. |
| `HOST` is a generic environment variable name. | Present in current server/config; consider a project-prefixed replacement in a controlled change. |

The backend parser tolerates matching surrounding double quotes and this behavior is covered by three middleware-level unit tests. Source review also found that Android `MainActivity.java` no longer installs a global `CookieHandler`; it explicitly stores and attaches cookies per request through a `CookieManager`. The cause of the earlier quoted cookie value and the contribution of either change to successful sign-in are unproven. Do not describe this as a confirmed Android/JVM defect or claim the parser change alone fixed sign-in.

## 7. Publication-safety corrections in package revision 2

The independent package review found machine-specific Eclipse/Buildship/Java-language-server metadata in the Android project. This revision removes `android/.project`, `android/.settings/`, `android/app/.classpath`, `android/app/.project`, and `android/app/.settings/`. Root `.gitignore` now ignores `.project`, `.classpath`, `.settings/`, and `bin/` at any project depth. The `android/.settings/org.eclipse.buildship.core.prefs` file contained a local home-directory path and is not included.

The Android sign-in error stage no longer displays a saved-cookie count. This avoids exposing a local debugging detail in a user-facing failure message. The Android change is text-only but postdates the last reported Android build; rebuild before relying on a new APK from this exact package revision.

A fresh `npm ci` was attempted against this extracted package in the package-preparation environment (Node.js 22.16.0, npm 10.9.2). The backend attempt exceeded the 120-second command limit; a retry with zero fetch retries and a 15-second fetch timeout also did not complete within the 30-second command limit. The web attempt with the same retry/timeout settings also did not complete within 30 seconds. These are **incomplete/timeout attempts**, not successful clean installs and not a verified dependency defect. Repeat `npm ci` for backend and web on the owner's Ubuntu machine or another environment with working npm registry access.

The package manifest and SHA-256 inventory were regenerated after these changes. The package excludes `.git` history; these safeguards prevent the identified IDE metadata from entering a new archive/commit, but they do not remove any file already present in an existing Git history.

## 8. Remaining work

1. Capture matching before/after Android screenshots and a history query including the relevant requirement record ID to strengthen the FS-12/MAC-008 end-to-end trace.
2. Complete Windows checks and the full M3 v1.1 evidence/review process, including a fresh clone, clean dependency installation, and sign-in.
3. Complete TD-011 stack suitability evaluation, not just component compatibility checks.
4. Obtain teammate review and maintain the FS/MAC traceability evidence.
5. Resolve TD-R01, TD-R11, TD-R12, TD-R14, TD-R15, and TD-R17 as applicable; do not treat pilot selections as permanent decisions.
6. Complete the remaining TD-020 review after publication. The limited 2026-11-08 scan and history cleanup are recorded in `docs/reviews/PUBLICATION_REVIEW_2026-11-08.md`; school rules, complete file/history review, and GitHub settings/metadata remain open.

## 9. Completion statement

The current first slice has passed the owner-reported backend unit and PostgreSQL integration suites and the Vite production build. The owner also reports working production web sign-in/filter flows and the Android student status refresh. This is meaningful integrated-demo progress, but it is **not** a claim that the full MVP, all FS/MAC criteria, M3, TD-011, Windows compatibility, or production readiness are complete.

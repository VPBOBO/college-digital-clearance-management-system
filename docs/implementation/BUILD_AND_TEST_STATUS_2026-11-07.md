# First-Slice Build and Test Status — Historical 2026-11-07 Snapshot

> **Historical snapshot:** This report records only the 2026-11-07 build-container run. Its NOT RUN statements are historical for that environment and are superseded for current owner-machine checks by [`BUILD_AND_TEST_STATUS_2026-11-08.md`](BUILD_AND_TEST_STATUS_2026-11-08.md). Do not use this file alone as the current project status.

**Date:** 2026-11-07  
**Execution environment:** Build container (Node.js v22.16.0, npm 10.9.0), not the owner's Ubuntu workstation.  
**Purpose:** Separate source-level checks run here from checks that still require the owner's application environment.

## Checks run in this build container

| Check | Result | Evidence / qualification |
|---|---|---|
| Backend JavaScript syntax (`node --check` for `backend/src/*.js`, `backend/test/*.js`, and `backend/scripts/*.js`) | PASS | All backend source, test, and utility scripts parsed successfully. |
| Dependency-free tests (`node --test test/domain.test.js test/auth.test.js test/db-safety.test.js`) | PASS | 14 tests passed, 0 failed, 0 skipped. Covers completion, remarks, transitions, unknown-user dummy-hash verification flow, and guarded database targets. |
| Integration test discovery without `TEST_DATABASE_URL` | SKIPPED as expected | Suite correctly reports it needs `TEST_DATABASE_URL`, an `_test` database name, and explicit `ALLOW_TEST_DATABASE_RESET=YES`. No PostgreSQL integration test was executed. |
| Web JSX syntax (`typescript.transpileModule` for `web/src/App.jsx` and `web/src/main.jsx`) | PASS | JSX transpilation reported no syntax diagnostics; this is not a Vite production build. |
| Android Java parser check (`javac` without Android SDK) | PARTIAL | No common Java syntax errors were reported, but compilation stopped because Android SDK classes are unavailable. This is not an Android build. |
| Temporary Gradle launcher-stub shell syntax (`sh -n` and `bash -n android/gradlew`) | PASS | The stubs parse, but they are not the Gradle-generated standard wrapper scripts. The wrapper JAR is absent; generate the standard wrapper before Android Studio sync/build. Windows launcher execution was not tested. |
| Backend/web dependency installation | NOT RUN / BLOCKED | Package registry lookup failed with DNS `EAI_AGAIN`; Express, pg, argon2, React, and Vite were not installed in this container. |
| PostgreSQL migration, seed, and API integration | NOT RUN | `psql`/PostgreSQL server is not available in this container. |
| React/Vite production build | NOT RUN | Vite dependencies could not be installed. |
| Android Gradle build and emulator launch | NOT RUN | Android SDK/Studio and Gradle are not available in this container. |

## Required next verification on the project Ubuntu machine

1. Follow the repository root `README.md` to create/configure the local development database and install backend/web dependencies.
2. Run `npm test` in `backend/` and record the 14 dependency-free tests.
3. Run `npm run db:setup`, save the generated demo password privately, and start the backend.
4. Run `npm install && npm run build` in `web/`; then sign in as `reviewer-a` and process its fictional item.
5. Create a dedicated `cdcms_test` PostgreSQL database and run `ALLOW_TEST_DATABASE_RESET=YES TEST_DATABASE_URL=... npm run test:integration` in `backend/`. Do not point it at `cdcms_dev` or a database containing real data.
6. Open `android/` in Android Studio, sync Gradle, build, install on the booted emulator, sign in as `student-a`, and confirm the updated status appears after office review.
7. Record actual command output and defects. Do not promote any NOT RUN item to PASS without evidence.

This file does not claim that the integrated application has already run successfully. The earlier owner Ubuntu component checks are separately documented as reported prior-session evidence in `Ubuntu_Pilot_Results_Reported_2026-11-07.md`.


## Reviewer security/integrity corrections — patched revision

The following source corrections were made after the independent sandbox review:

- Request/record FKs use `ON DELETE RESTRICT`; processing-history UPDATE, DELETE, and TRUNCATE are rejected by PostgreSQL triggers. The guards protect normal application/database operations; a database owner can still alter or drop schema protections and must be controlled separately.
- Demo seed is guarded by `ALLOW_DEMO_SEED=YES`, loopback host, and `_dev` database name. Schema migration and API startup also require explicit opt-ins and the same local `_dev` target guard. Existing account passwords and inactive flags are preserved.
- API and Vite bind to loopback by default; LAN exposure requires explicit settings.
- Unknown/inactive login attempts execute Argon2 verification against a dummy hash; expired sessions are purged on login and periodically.
- Remarks are trimmed, whitespace-only remarks count as empty, and remarks longer than 1,000 characters are rejected.
- Test reset now checks both a loopback host and `_test` database name.
- Android cleartext is limited to `10.0.2.2` by default.
- Integration tests were expanded for staff queue scoping, reviewer details, completion reads, no-mandatory assignment rejection, unauthenticated staff access, and the previously described cases.

**Still not run here:** PostgreSQL migration/integration suite; Express tests that require PostgreSQL; React/Vite dependency installation and production build; Android Gradle build and emulator execution. npm lockfiles and the standard Gradle wrapper JAR are not included because this environment could not retrieve the required packages/artifacts. See `FIRST_SLICE_IMPLEMENTATION_PILOT.md` for remaining owner/tool decisions.

The current container run after those changes executed 14 dependency-free tests successfully. PostgreSQL-dependent tests remain unrun. The integration suite has additional tests for read-detail access, queue scoping, completion, zero-mandatory assignment rejection, append-only history (including UPDATE/DELETE/TRUNCATE rejection), and request-deletion restriction.

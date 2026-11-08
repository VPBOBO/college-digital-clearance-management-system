# First-Slice Independent Review — Findings Disposition

**Date:** 2026-11-07  
**Implementation revision:** 0.1.1  
**Status:** Source corrections applied; database/build verification still outstanding.

This note records how the sandbox review findings were handled. It does not claim PostgreSQL, Vite, Gradle, Android, or end-to-end execution has passed.

| Finding | Disposition | Implementation / remaining evidence |
|---|---|---|
| 1. Processing history could be deleted through cascades | **Corrected in source** | `clearance_requests` → requirement records and requirement records → history now use `ON DELETE RESTRICT`. Processing history rejects UPDATE, DELETE, and TRUNCATE through database triggers. This guards normal operations; a privileged database owner can still change schema protections. PostgreSQL integration test added; not run here. |
| 2. Seed could target an unintended DB and overwrite/re-activate demo accounts | **Corrected in source** | Seed requires explicit opt-in, loopback host, and `_dev` database name. It creates missing fixtures only; it does not replace passwords or reactivate inactive accounts/assignments. Schema migration and API startup have matching local `_dev` safety gates. |
| 3. API/Vite exposed to LAN by default | **Corrected in source** | Both bind to loopback by default. API LAN binding needs `ALLOW_LAN=YES`; Vite needs explicit `VITE_HOST=0.0.0.0`. CORS origins must be configured. |
| 4. Non-standard Gradle bootstrapper / wrapper | **Partly corrected; JAR remains outstanding** | The current Linux and Windows files are temporary launch stubs: they invoke the standard `GradleWrapperMain` only when the standard JAR is present and do not bootstrap/download Gradle themselves. They are not the Gradle-generated standard wrapper scripts. Gradle 8.9 distribution SHA-256 is pinned from Gradle's independent checksum reference. The standard `gradle-wrapper.jar` could not be retrieved in this environment. Generate the standard wrapper on a connected developer machine with `gradle wrapper --gradle-version 8.9 --distribution-type bin`, ensure the generated properties retain the distribution checksum, verify JAR SHA-256 `498495120a03b9a6ab5d155f5de3c8f0d986a449153702fb80fc80e134484f17`, and commit the generated JAR and scripts before Android Studio sync/build. |
| 5a. Unknown usernames skipped Argon2 work | **Corrected in source** | Unknown/inactive users now run Argon2 verification against a cached dummy hash. A dependency-free test verifies the dummy-hash path. Timing behavior is not benchmarked here. |
| 5b. Expired sessions persisted indefinitely | **Corrected in source** | Expired sessions are purged on login and periodically by the API process. Database execution not tested here. |
| 5c. Remarks had no length limit | **Corrected in source** | Trimmed remarks are limited to 1,000 Unicode code points; whitespace-only remarks become null. API returns 422 for overlength. Domain test added. |
| 5d. Test reset did not restrict DB host | **Corrected in source** | Reset and integration test target must use loopback and a database name ending `_test`, with explicit opt-in. Helper unit tests cover target checks. |
| 6. Android cleartext allowed to all hosts | **Corrected in source for emulator; physical test requires exact host entry** | Android network-security XML permits cleartext to `10.0.2.2` only. For a physical-device development test, add the exact LAN IP, set LAN binding opt-ins, and configure the matching web origin. HTTPS remains required before deployment. |
| 7. npm lockfiles absent | **Outstanding** | No `package-lock.json` files are included because npm registry access was unavailable. Generate and review lockfiles in `backend/` and `web/` on the developer machine using the agreed Node/npm version. |
| 8. Seed helper/error reporting | **Corrected in source** | Unused helper parameter removed. Seed failures now report the failed stage and a sanitized error code/message. Existing fixture values are not silently rewritten. |
| Coverage: FS-04 and FS-09 absent | **Tests added; execution outstanding** | Integration tests now cover reviewer item detail and read-time completion after an approval. |
| Coverage: Reviewer B could see Office A? | **Test added; execution outstanding** | Integration test asserts Reviewer B sees only Office B and cannot retrieve Office A detail. |
| Coverage: FS-14 did not check staff | **Test added; execution outstanding** | Unauthenticated student and staff routes both assert 401. |
| Coverage: assignment service accepted zero mandatory setup | **Test added; execution outstanding** | Integration test expects 422 and no clearance request when no mandatory applicable requirements exist. |
| Coverage: history fields and deletion protection | **Tests added; execution outstanding** | Actor, previous/new status, timestamp and remark are checked; UPDATE/DELETE/TRUNCATE protections and request-delete restrictions have integration coverage. |

## Executed checks in this build container

- 14 dependency-free Node tests passed.
- All backend source, scripts, and test JavaScript files passed `node --check`.
- Linux Gradle wrapper launcher passed `sh -n` and `bash -n`.
- Android manifest and network-security XML parsed successfully.
- Backend/web package manifests parsed as JSON.
- PostgreSQL integration suite was not executed; without `TEST_DATABASE_URL`, its test is skipped safely.

## Still unverified

- PostgreSQL schema migration, seed, history immutability, FK restrictions, transaction/concurrency integration tests.
- npm dependency installation, lockfile generation, Vite build, and live browser workflow.
- Standard Gradle wrapper JAR generation, Android Gradle build, emulator installation, and FS-12 manual test.
- Full web → API → PostgreSQL → Android workflow.

The first-slice implementation choices for TD-R01, TD-R11, and TD-R14 remain provisional pilot choices. Their presence in source is not owner approval of permanent technical standards.

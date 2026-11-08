# First-Slice Implementation Pilot — Owner Decision Record

**Initial date:** 2026-11-07  
**Status reviewed:** 2026-11-08  
**Status:** Implementation pilot; technical decisions below remain provisional unless separately approved by the owner.

## Provisional implementation choices made to make the first slice executable

| Area | Pilot choice | Status / owner action |
|---|---|---|
| TD-R01 authentication | Opaque server-managed session, HttpOnly/SameSite=Lax cookie shared by web and Android; Android currently captures and attaches cookies explicitly per request through a `CookieManager` (no global `CookieHandler`) | Provisional; owner decision still required |
| TD-R11 PostgreSQL access | `pg` driver with parameterized SQL | Provisional; owner decision still required |
| TD-R11 query approach | Direct SQL, no ORM | Provisional; owner decision still required |
| TD-R11 testing | Node built-in `node:test` | Provisional; owner decision still required |
| TD-R11 migration | SQL schema applied by the current schema/migration script | Provisional; owner decision still required |
| TD-R14 Android application ID | `com.samplecollege.cdcms` | Provisional; not approved for store/public distribution |

These choices are present in the pilot source so the implementation can be evaluated. Their presence does not mean they have been accepted by the owner or become permanent project standards.

## Safety and integrity corrections in this revision

- Clearance request and requirement-record deletion no longer cascades into processing history.
- Processing history rejects UPDATE, DELETE, and TRUNCATE through database triggers; request/record foreign keys use RESTRICT. These controls protect normal operations, not a privileged database owner who can alter or drop schema protections.
- The demo seed requires `ALLOW_DEMO_SEED=YES`, a loopback database host, and a database name ending `_dev`. Schema migration and API startup have separate explicit opt-ins and the same loopback/`_dev` target guard.
- Existing demo account passwords and inactive flags are not overwritten or reactivated by rerunning the seed.
- API and Vite bind to loopback by default; LAN exposure requires explicit settings.
- The Android network security configuration permits cleartext to `localhost` (used by a physical phone through ADB reverse) and emulator host alias `10.0.2.2`. The tested physical-phone path does not expose the backend to the LAN; an alternate LAN approach would require a separate explicit configuration/review.
- Login executes an Argon2 verification for unknown/inactive usernames using a cached dummy hash.
- Expired sessions are purged at login and periodically by the API process.
- Remarks are trimmed, whitespace-only values count as empty, and the maximum length is 1,000 characters.
- The test reset utility rejects non-loopback PostgreSQL hosts and database names that do not end `_test`.

## Runtime evidence and infrastructure status — reviewed 2026-11-08

The latest owner-machine evidence is consolidated in [`BUILD_AND_TEST_STATUS_2026-11-08.md`](BUILD_AND_TEST_STATUS_2026-11-08.md). Current results supplied by the owner:

- Backend unit suite: 17 passed, 0 failed, 0 skipped.
- PostgreSQL integration suite: 19 passed, 0 failed, 0 skipped, targeting the dedicated `cdcms_test` database owned by `cdcms_app`.
- Vite production build: passed (17 modules transformed); production preview and reviewer sign-in/filter workflows reported working.
- Android Gradle debug build, installation, and student sign-in were reported successful in the earlier owner-machine run.
- Physical-phone networking now uses ADB reverse: `adb -s DEVICE_SERIAL reverse tcp:3000 tcp:3000`. Backend remains loopback-bound; the Android app uses `http://localhost:3000`. `network_security_config.xml` permits `localhost` and emulator bridge `10.0.2.2` for local development.
- Both `backend/package-lock.json` and `web/package-lock.json` are now included in the working project archive.
- The standard Gradle wrapper JAR is included. Its checksum matches Gradle's official Gradle 8.9 wrapper JAR checksum. The official distribution checksum is pinned in `gradle-wrapper.properties`; the distribution ZIP was not included in the source archive for a new local hash calculation.

The November 7 build-container results remain historical in `BUILD_AND_TEST_STATUS_2026-11-07.md`; they are not the current owner-machine status.

## Authentication compatibility observation — 2026-11-08

An earlier Android sign-in investigation observed a cookie value surrounded by matching double quotes, and the backend parser was updated to tolerate that representation. However, the current Android `MainActivity.java` also changed: it no longer installs a global `CookieHandler` and instead captures and attaches cookies explicitly for each request using its `CookieManager`. The cause of the earlier quoted value and the contribution of each change to successful sign-in are unproven. Record this as an observed compatibility behavior and two implementation changes, not as a confirmed Android/JVM defect or a proven root cause.

Three tests cover the backend quote-tolerance behavior through `createAuthMiddleware(pool)` using a fake pool/request:

- quoted cookie: unquoted token digest is sent to the session lookup;
- unquoted cookie: the same token digest is used;
- unmatched quote: middleware calls `next()` without setting `req.user` and performs no session query.

The tests also spy on console methods to confirm the middleware does not log the tested cookie/token. The private parser remains private. A malformed or missing cookie is passed onward without a user; `requireAuthentication` is responsible for returning 401. A cookie-count diagnostic was removed from the Android sign-in failure stage so that user-facing errors do not expose cookie-count debugging details. Because this Android source change occurred after the previously reported debug build, rerun the Android Gradle build before treating the revised package APK as rebuilt.

## Carry-forward review findings

These v0.1.1 findings remain tracked and are not silently treated as fixed:

| Finding | Current status |
|---|---|
| Failed seed may lose generated password | Open; inspect recovery behavior. |
| `.env.example` sets `ALLOW_*` flags to `YES` | Confirmed in current template; deliberate opt-in strength needs owner review. |
| Dummy hash is created lazily | Confirmed in current `auth.js`; first unknown-user request timing remains an evaluation item. |
| Staff detail route returns 404 for another office's item while the decision route returns 403 | Both routes are now documented in the draft contract; the disclosure-policy difference remains open for production review. |
| `HOST` is generic environment variable name | Current name remains; consider project-prefixed configuration in a controlled change. |

## Remaining infrastructure and decision items

- Clean `npm ci` from a fresh extraction/clone has not yet been evidenced, even though both lockfiles are present.
- Windows machine/build checks remain outstanding.
- Full M3 v1.1 evidence/review and TD-011 stack suitability evaluation remain incomplete.
- Teammate review remains unrecorded.
- TD-R01, TD-R11, TD-R12, TD-R14 and relevant repository/publication decisions remain provisional/open as listed in the project decision records.
- The `.env.example` template currently contains affirmative local `ALLOW_*` values. Review whether to change these to `NO`; do not silently alter the operational defaults without the owner's decision.

## API status and existence-disclosure choices

- Missing/whitespace-only `REQUIRED` rejection remark: `422`; remarks are trimmed and capped at 1,000 Unicode code points.
- A second decision on an already processed item: `409` before remark validation.
- Wrong role or wrong office assignment on the decision action: `403`.
- The decision action intentionally reveals the existence of an item to an authenticated office reviewer: an existing item belonging to another office returns `403`, while a nonexistent ID returns `404`. This is accepted for the local academic demo and should be reconsidered before production use.
- The reviewer detail route hides unassigned and nonexistent items behind the same `404` response.
- A student requesting another student's record and a student requesting a nonexistent record receive the same `404` body.
- The review list defaults to Pending and supports explicit `status=Pending`, `Approved`, `Rejected`, or `All` filtering. Every list result remains scoped to active office assignments.

Login lockout and request rate limiting are explicitly deferred. They are not implemented and the demo authentication must not be presented as production-hardened.

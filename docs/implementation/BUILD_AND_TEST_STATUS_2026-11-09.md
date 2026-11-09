# Authentication and Session Verification

**Date:** 2026-11-09<br>
**Decision:** TD-R01 — opaque, server-managed sessions for the academic MVP<br>
**Verification scope:** Existing backend, web and Android session behavior<br>
**Result:** Core session tests passed; some acceptance checks remain partial or unverified.

## 1. Summary

The project owner approved opaque, server-managed sessions for the academic
MVP. The existing implementation was retained; no authentication framework,
JWT flow, token-refresh mechanism, or persistent Android cookie storage was
added.

Owner-run test results on 2026-11-09:

| Test suite | Passed | Failed | Skipped |
|---|---:|---:|---:|
| Backend unit tests (`npm test`) | 28 | 0 | 0 |
| PostgreSQL integration tests (`npm run test:integration`) | 22 | 0 | 0 |
| **Total test executions** | **50** | **0** | **0** |

The integration suite used the dedicated `cdcms_test` database. Before
running, the database was verified as owned by `cdcms_app`, accessed as
`cdcms_app`, and listening on loopback `127.0.0.1`. The integration suite
resets only that test database's public schema. The development database
`cdcms_dev` was not the integration target.

Two `P0001` error messages appeared during intentional fault-injection
tests. Both corresponding history/status rollback tests passed.

## 2. Focused session test results

Three integration tests were added to `backend/test/integration.test.js`:

| Test | Result | Evidence |
|---|---|---|
| AUTH-04 — expired session | PASS | Expired the student's stored session and verified that `/api/me` returned HTTP 401. |
| AUTH-05 — logout and replay | PASS | Verified logout returned success, cleared the cookie with `Max-Age=0`, and rejected replay of the old cookie with HTTP 401. |
| AUTH-06 — inactive account | PASS | Deactivated the account while its session existed and verified that `/api/me` returned HTTP 401. |

These tests use the disposable PostgreSQL integration database. No
authentication implementation code was changed for these tests.

## 3. AUTH acceptance-check status

| ID | Status | Evidence and limitation |
|---|---|---|
| AUTH-01 — correct credentials | PARTIALLY VERIFIED | Existing FS-01 integration test confirms successful login and that the password hash is not returned. The full response/session contract is not independently asserted field by field. |
| AUTH-02 — unknown username vs wrong password | PARTIALLY VERIFIED | Existing unit test confirms an unknown username executes dummy Argon2 verification. The code uses a generic invalid-credentials error, but a dedicated comparison test for unknown and incorrect-password responses was not run. |
| AUTH-03 — session persistence and digest storage | IMPLEMENTATION REVIEWED; TEST GAP | Code inspection confirms a random 32-byte token is generated and its SHA-256 digest is stored. Unit tests verify digest use during session lookup. A dedicated integration assertion that the raw token is absent from the database was not run. |
| AUTH-04 — expiry | PASS | New integration test verifies an expired cookie cannot access `/api/me`. |
| AUTH-05 — logout | PASS | New integration test verifies server-side invalidation, cookie clearing, and rejection of the old cookie. |
| AUTH-06 — inactive account | PASS | New integration test verifies an inactive account cannot use an existing session. |
| AUTH-07 — role/assignment change | PARTIALLY VERIFIED | Existing FS-06 covers wrong role and FS-17 covers an inactive office assignment. A separate test of every possible role/assignment change was not run. |
| AUTH-08 — browser session | PARTIALLY VERIFIED | `web/src/api.js` uses `credentials: 'include'`. Earlier browser sign-in and staff workflow checks were reported on 2026-11-08. No new interactive browser test was performed on 2026-11-09. |
| AUTH-09 — Android restart/expiry | PARTIALLY VERIFIED | Earlier physical-phone sign-in and sample-record viewing were reported on 2026-11-08. Code inspection shows an in-memory `CookieManager` and a sign-in screen on startup. A full process restart returns the app to sign-in; device restart/expiry behavior was not manually tested. |
| AUTH-10 — expired-session cleanup | IMPLEMENTATION REVIEWED; NOT SEPARATELY TESTED | `loginUser` calls `purgeExpiredSessions` before login, and authenticated requests independently reject expired sessions. A dedicated test of cleanup counts/frequency was not run. |

## 4. Known MVP behavior and limitations

- Android stores its session cookie in the in-memory `CookieManager`.
- After a full app process restart, the student returns to the sign-in screen
  and signs in again.
- The existing server-side session may remain until its expiry; expired
  sessions are purged during a subsequent login.
- The current default session lifetime is eight hours. This remains a pilot
  setting, not an institutional policy.
- The current checks are functional verification for an academic
  demonstration. They are not a production security certification.

These limitations do not require new infrastructure for the current MVP.
Persistent Android sessions and additional authentication features remain
out of scope unless an approved MVP workflow demonstrates a real need.

## 5. Conclusion

TD-R01 is owner-established. The existing server-managed session approach
remains selected for the academic MVP.

The backend unit and PostgreSQL integration suites passed on 2026-11-09.
AUTH-04, AUTH-05 and AUTH-06 have dedicated passing integration tests.
Other acceptance checks retain the qualifications shown above.

No JWT migration, new authentication framework, token-refresh flow, or
persistent Android cookie storage was introduced. The Requirements
Baseline 0.1 and owner-approved MVP Specification v0.3 were not amended.

**Evidence source:** Owner-provided terminal output from the 2026-11-09
Ubuntu test runs and read-only inspection of the checked-in implementation.

# Package Revision 2 — 2026-11-08

This revision responds to the independent review of the 2026-11-08 complete source package.

## Changes

- Removed machine-specific Eclipse/Buildship/Java-language-server metadata: `android/.project`, `android/.settings/`, `android/app/.classpath`, `android/app/.project`, and `android/app/.settings/`. The Buildship preferences contained a local home-directory/Neovim JDTLS path.
- Added repository-wide `.gitignore` rules for `.project`, `.classpath`, `.settings/`, and `bin/`.
- Removed the saved-cookie-count diagnostic from Android sign-in failure text.
- Updated documentation to describe Android's explicit per-request cookie handling through `CookieManager`, with no global `CookieHandler` in the inspected source. The root cause of the earlier quoted-cookie observation and the contribution of either change to successful sign-in remain unproven.
- Added `GET /api/staff/review-items/{recordId}` to the first-slice technical contract. The detail-route 404 vs. decision-route 403 policy difference remains open for production review.
- Added a sanitized copy of the owner-provided integration test output.
- Regenerated the project SHA-256 inventory.

## Verification limits

The earlier owner-provided integration, web build, and Android runtime results remain attributed as described in `docs/implementation/BUILD_AND_TEST_STATUS_2026-11-08.md`. The Android cookie-count message cleanup happened after the previously reported Android build, so rebuild before distributing this exact revision. Clean `npm ci` attempts in the package-preparation environment timed out; rerun on a machine with working npm registry access. Windows checks, teammate review, and the exact record-ID-linked before/after phone evidence remain outstanding.

This revision does not change database schema, business logic, authentication architecture, or baseline requirements.

## Post-R2 working-tree changes — 2026-11-08

The following changes were made after the historical R2 ZIP was created. They are not included in its original 85-file count or checksums.

- Added `backend/src/demo-password-reset.js`.
- Added `backend/scripts/reset-demo-passwords.js`.
- Added `backend/test/demo-password-reset.test.js`.
- Registered `db:reset-demo-passwords` in the backend package scripts.
- Added guarded local demo-password configuration.
- Updated the seed to generate an independently salted Argon2id hash for each newly created demo account.
- Updated the root README and implementation status.
- Added the latest PostgreSQL integration output under `docs/evidence/`.

Owner-supplied verification after these changes:

- Backend unit tests: 28 passed, 0 failed.
- PostgreSQL integration tests: 19 passed, 0 failed.
- Backend and web `npm ci`: passed.
- Demo-password reset: all five designated accounts updated successfully.

The R2 ZIP remains a historical snapshot. A new source-package revision and current checksum inventory are required for a future complete archive.

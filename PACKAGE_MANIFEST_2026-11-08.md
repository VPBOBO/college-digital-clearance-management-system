# CDCMS Source Package Manifest — 2026-11-08, Revision 2

## Package identity

- Project: College Digital Clearance Management System (CDCMS)
- Package date: 2026-11-08
- Revision: 2, incorporating independent publication-safety review
- Project file count: 85 regular files, including the in-project checksum inventory; `docs/SHA256SUMS.txt` hashes the other 84 files.
- Source basis: Owner-uploaded `Digital-Clearance-source-2026-11-08.zip`
- Scope: Complete project source and documentation snapshot. Existing application source is retained except for the Android sign-in error-message diagnostic cleanup described below; no feature rewrite was performed.

## Included

- `backend/`: Express source, PostgreSQL schema/migration/seed, tests, package manifest and lockfile, and `.env.example`.
- `web/`: React/Vite source, package manifest and lockfile, Vite configuration, and README.
- `android/`: Java application source, Android manifest/resources, Gradle build files, standard Wrapper scripts/JAR/properties, and README.
- `docs/`: requirements baseline, MVP, planning, review records, environment checklists, technical contract, implementation evidence, and sanitized integration output.
- Root README, `.gitignore`, `.gitattributes`, package manifest, revision note, and checksums.

## Excluded

- `.env` and local credentials/secrets.
- `node_modules/`, `dist/`, `build/`, `.gradle/`, `android/.cache/`, `bin/`, coverage, APK/AAB outputs, logs, and machine-specific `local.properties`.
- Eclipse/Buildship/Java-language-server metadata: all `.project`, `.classpath`, and `.settings/` files/directories. The reviewed Android Buildship preferences contained a local home-directory/Neovim JDTLS path.
- `.git/` directory and commit history. This ZIP is a source snapshot, not a configured Git repository and contains no remote configuration.

## Exact reconciliation changes in revision 2

1. Removed `android/.project`, `android/.settings/`, `android/app/.classpath`, `android/app/.project`, and `android/app/.settings/`.
2. Added repository-wide root `.gitignore` patterns for `.project`, `.classpath`, `.settings/`, and `bin/`.
3. Removed the Android sign-in failure diagnostic that displayed the number of saved cookies. The previously reported Android Gradle build predates this text-only cleanup; rebuild before treating this exact revision as a rebuilt APK.
4. Corrected authentication documentation: Android explicitly stores and attaches cookies on each request through its `CookieManager` and does not install a global `CookieHandler` in the inspected source. The cause of the earlier quoted-cookie observation and the contribution of backend parser tolerance versus Android request handling to sign-in success are unproven.
5. Added the implemented `GET /api/staff/review-items/{recordId}` detail route to the first-slice technical contract. The route's 404 behavior for another office/nonexistent item and the decision route's 403 behavior for an existing other-office item are both documented; whether to retain this disclosure difference before production remains open.
6. Added a sanitized transcription of the owner-provided PostgreSQL integration output under `docs/evidence/`.
7. Regenerated `docs/SHA256SUMS.txt` after the source and documentation changes.

## Verification boundary

The status report distinguishes owner-provided terminal output, screenshot-supported evidence, package-preparer checks, and owner-reported interactive behavior. The package preparer reran the backend unit suite on Node.js 22.16.0 and checked backend JavaScript syntax. The owner-provided PostgreSQL integration output shows 19/19 tests against `cdcms_test`; the Vite build output was also supplied by the owner. Production preview, reviewer workflows, Android sign-in, and student status refresh remain classified as reported or screenshot-supported as specified in the status report.

Fresh `npm ci` attempts in the package-preparation environment (Node 22.16.0/npm 10.9.2) timed out in both backend and web. These attempts are incomplete and are not clean-install passes. Repeat `npm ci` in each folder on a machine with working registry access. The Android source diagnostic cleanup postdates the previously reported debug build; run `./gradlew assembleDebug` again before distributing the revised Android app. Windows checks, teammate review, and exact requirement-record-linked before/after phone evidence remain outstanding.

## Checksums

`docs/SHA256SUMS.txt` lists SHA-256 checksums for all files in this project snapshot except the checksum file itself. From the project root:

```bash
sha256sum -c docs/SHA256SUMS.txt
```

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

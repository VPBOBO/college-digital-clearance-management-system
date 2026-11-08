# College Digital Clearance Management System (CDCMS)

A college-clearance academic prototype with a working first-slice implementation. The repository contains the project requirements and MVP planning documents plus backend, staff web, and Android student applications.

> **Demo data:** The application uses fictional `Sample College` identities, accounts, students, offices, and requirements. The sample records are practice/demo fixtures and do not represent real student records or approved institutional policy.

**Status last updated:** 2026-11-08. See [`docs/implementation/BUILD_AND_TEST_STATUS_2026-11-08.md`](docs/implementation/BUILD_AND_TEST_STATUS_2026-11-08.md) for evidence classifications and current outstanding checks.

## Current implementation

The first slice currently includes:

- PostgreSQL schema, guarded local migration, fictional demo seed, and backend applicability assignment.
- Node.js + Express API with Argon2id password verification and server-managed opaque sessions.
- Office reviewer web portal: sign in, view office-assigned requirements, filter by Pending/Approved/Rejected/All, approve, reject, and provide remarks.
- Native Java Android student app: sign in, view the signed-in student's clearance requirements and statuses, remarks, and derived completion.
- Backend unit tests and a PostgreSQL integration suite.

**This is not the complete MVP.** Admin configuration screens/endpoints and instructor processing are not implemented; MAC-004 and full MAC-006 are not demonstrated. See the MVP scope and traceability documents before describing the prototype as complete.

## Latest owner-machine results (2026-11-08)

The owner supplied terminal output for **28/28 backend unit tests** after the latest password and seed-hashing changes, **19/19 PostgreSQL integration tests** in the earlier R2 run, and a successful Vite production build. Backend and web clean dependency installations also passed. Production preview, reviewer sign-ins, Android sign-in, and student status refresh were owner-reported successful. Reviewer B's office-scoped All list is screenshot-supported. Integration tests must be rerun after the latest source changes.

## Repository layout

```text
android/    Native Java Android student application and Gradle Wrapper
backend/    Express API, PostgreSQL schema, migration, seed, and tests
web/        React + Vite office reviewer portal
docs/       Requirements baseline, MVP, planning, reviews, and implementation evidence
```

## Requirements and project authority

1. `docs/requirements/README.md` — original baseline index and authoritative requirements.
2. `docs/mvp/CDCMS_MVP_Requirements_Specification_v0.3.md` — owner-approved working MVP specification.
3. `docs/mvp/CDCMS_MVP_Traceability_Crosswalk_and_Issue_Register_v0.3.md` — requirement/test traceability.
4. `docs/planning/CDCMS_MVP_Scope_Decision_and_Team_Execution_Plan_v0.3.md` — P0–P7 execution stages.
5. `docs/implementation/First-Slice_Technical_Contract_Draft_0.3.md` — first-slice contract; pilot clarifications are recorded in `docs/implementation/FIRST_SLICE_IMPLEMENTATION_PILOT.md`.

The applied Requirements Baseline 0.1 remains unchanged. MVP v0.3 is the working MVP foundation, not a baseline amendment and not CHG-003.

## Prerequisites

The owner's reported/tested Ubuntu environment uses Node.js 26.13.0, npm 11.19.0, PostgreSQL 18.6, Java 17, and Gradle 8.9. Node 26.13.0 remains a candidate rather than an approved team-wide standard (TD-R12). The package manifests allow Node `>=22 <27`. Windows setup/build is not yet verified.

## Run the local demo

### 1. Create the local development database (one-time setup)

On Ubuntu:

```bash
sudo -u postgres psql
```

In the PostgreSQL prompt, create a dedicated application role and development database. Replace the example with a unique local password:

```sql
CREATE ROLE cdcms_app LOGIN PASSWORD 'REPLACE_WITH_A_UNIQUE_LOCAL_PASSWORD';
CREATE DATABASE cdcms_dev OWNER cdcms_app;
\q
```

Do not use the PostgreSQL superuser as the application's runtime account. If the role/database already exist, do not recreate them; inspect the owner and use the existing setup.

### 2. Configure and initialize the backend

```bash
cd ~/Projects/Digital-Clearance/backend
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your local `cdcms_dev` database. Example format:

```dotenv
DATABASE_URL=postgres://cdcms_app:YOUR_LOCAL_PASSWORD@127.0.0.1:5432/cdcms_dev
```

Install the locked dependencies and initialize the local demo database:

```bash
npm ci
npm run db:setup
```

The migration, seed, and API have safety gates: loopback host and a database name ending `_dev`, plus their respective `ALLOW_*` settings. **Review the target database and flags in `.env` before running setup.** The checked-in `.env.example` currently sets `ALLOW_DEV_DATABASE`, `ALLOW_DEV_MIGRATIONS`, and `ALLOW_DEMO_SEED` to `YES`; this default is a tracked review finding because the affirmative values weaken the intended deliberate opt-in. The defaults have not yet been changed.

The seed creates missing fictional demo accounts. SEED_PASSWORD controls the password for newly created accounts. The checked-in .env.example provides the predictable local demo password documented below. If blank, the seed generates a random password and prints it once. Each new account receives an independently salted Argon2id hash. Existing passwords and inactive account states are preserved on rerun. Recovery of a randomly generated password after a failed seed remains an open finding.

Demo usernames:

| Username | Demo role |
|---|---|
| `reviewer-a` | Office A reviewer |
| `reviewer-b` | Office B reviewer |
| `student-a` | Student A / Program A |
| `student-b` | Student B / Program B |
| `admin` | System Administrator fixture; admin UI is deferred |

### Local demo password

All five fictional demonstration accounts use `CDCMS-Demo-2026!`. This is intentionally public for local demonstrations only. Never use it in production or for personal accounts.

To reset the five existing demo accounts, run from `backend/`:

```bash
ALLOW_DEMO_PASSWORD_RESET=YES npm run db:reset-demo-passwords
```

The command reads SEED_PASSWORD from the private .env. It requires a loopback `_dev` database, development mode, loopback application HOST, disabled LAN access, and explicit authorization. It updates only the five designated active accounts, uses independently salted Argon2id hashes, invalidates existing sessions, and preserves roles, student records, assignments, decisions, and processing history. It does not reset the database.

Keep ALLOW_DEMO_PASSWORD_RESET=NO in normal local configuration. Never commit backend/.env.

### 3. Start the backend API

From `backend/`:

```bash
npm start
```

The API listens on `http://127.0.0.1:3000` by default. Keep this terminal open. Verify from another terminal:

```bash
curl http://127.0.0.1:3000/api/health
```

Expected response:

```json
{"ok":true,"service":"cdcms-api"}
```

### 4. Start the staff web portal (development)

Open a second terminal:

```bash
cd ~/Projects/Digital-Clearance/web
npm ci
npm run dev
```

Open `http://localhost:5173`. Sign in as `reviewer-a` or `reviewer-b` with the local demo password. The Vite development server proxies `/api` to the backend at `127.0.0.1:3000`.

### 5. Build and test the production web preview

From `web/`:

```bash
npm run build
npm run preview -- --host 127.0.0.1
```

The preview normally listens at `http://127.0.0.1:4173`. The backend origin allowlist must include the exact preview origin as well as the development origin. The supplied `.env.example` includes loopback development and preview origins. If you change `WEB_ORIGINS` in `backend/.env`, restart the backend before retrying login. Do not use a wildcard origin; allow only the local origins required for this demo.

### 6. Build and run the Android student app

The standard Gradle Wrapper is already included: `android/gradlew`, `android/gradlew.bat`, `android/gradle/wrapper/gradle-wrapper.jar`, and `gradle-wrapper.properties`. Gradle 8.9 is pinned with `distributionSha256Sum`. The wrapper JAR in the uploaded source archive has SHA-256 `498495120a03b9a6ab5d155f5de3c8f0d986a449153702fb80fc80e134484f17`, matching Gradle's official Gradle 8.9 wrapper JAR checksum. The official reference is <https://gradle.org/release-checksums/>. The Gradle 8.9 binary distribution checksum in `gradle-wrapper.properties` is `d725d707bfabd4dfdc958c624003b3c80accc03f7037b5122c4b1d0ef15cecab`; the distribution ZIP was not included in the source archive, so a fresh local ZIP hash is not claimed here.

On the owner's Ubuntu setup, use Java 17 and run from `android/`:

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
./gradlew assembleDebug
```

The reported successful debug APK path is:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

#### Physical Android phone using ADB reverse (tested path)

The backend stays bound to `127.0.0.1:3000`; **do not enable LAN binding for this method**. The Android app's API URL should be `http://localhost:3000`. ADB reverse forwards the phone's localhost port to the computer's localhost port.

1. Enable Wireless debugging on the phone and connect it with the current IP:port shown by Android. A wireless-debugging port may change after sleep or reconnect.
2. In Ubuntu, inspect connected devices:

   ```bash
   "$HOME/Android/Sdk/platform-tools/adb" devices
   ```

3. If the phone is not listed, connect using the current Wireless debugging IP:port shown on the phone:

   ```bash
   "$HOME/Android/Sdk/platform-tools/adb" connect PHONE_IP:ADB_PORT
   ```

4. Copy the exact device serial from `adb devices`, then forward port 3000 (replace the example serial):

   ```bash
   ADB="$HOME/Android/Sdk/platform-tools/adb"
   DEVICE="PHONE_IP:ADB_PORT"
   "$ADB" -s "$DEVICE" reverse tcp:3000 tcp:3000
   "$ADB" -s "$DEVICE" reverse --list
   ```

5. Install/update the app if needed:

   ```bash
   cd ~/Projects/Digital-Clearance/android
   "$HOME/Android/Sdk/platform-tools/adb" -s "$DEVICE" install -r app/build/outputs/apk/debug/app-debug.apk
   ```

   Keep the backend running, open the Android app, sign in as `student-a` or `student-b`, and refresh after a reviewer processes an item. If Android reports a connection failure after the phone sleeps, check `adb devices` and restore the reverse mapping using the new serial/port.

The emulator address is `http://10.0.2.2:3000`. The Android network security configuration permits development cleartext to `localhost` and `10.0.2.2`. This is a local demo configuration, not a production deployment configuration. HTTPS and a reviewed network policy are required before deployment.

## Run backend tests

### Dependency-free unit tests

From `backend/`:

```bash
npm test
```

Owner-provided terminal output after the latest password and seed-hashing changes: **28 passed, 0 failed, 0 skipped**. Tests cover domain behavior, authentication, cookie handling, database safety, demo-password restrictions, and independently salted password hashes.

### PostgreSQL integration tests

Use a separate disposable test database owned by `cdcms_app`:

```sql
CREATE DATABASE cdcms_test OWNER cdcms_app;
```

The owner created this database and confirmed its owner. The suite drops and recreates its `public` schema before each test. It must never target `cdcms_dev` or any real/valuable database. The owner's safe launcher reads the source `DATABASE_URL` from `backend/.env`, checks that it is `cdcms_dev` on loopback and uses `cdcms_app`, then derives the test URL by changing only the database name. Run it from `backend/`:

```bash
node --input-type=module <<'NODE'
import dotenv from 'dotenv';
import { spawnSync } from 'node:child_process';

dotenv.config();
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing from backend/.env');
const source = new URL(process.env.DATABASE_URL);
const database = decodeURIComponent(source.pathname.replace(/^\/+/, ''));
const username = decodeURIComponent(source.username);
const host = source.hostname.replace(/^\[|\]$/g, '').toLowerCase();
if (database !== 'cdcms_dev') throw new Error('Expected source database cdcms_dev.');
if (!['localhost', '127.0.0.1', '::1'].includes(host)) throw new Error('Source database host must be loopback.');
if (username !== 'cdcms_app') throw new Error('Expected database user cdcms_app.');
source.pathname = '/cdcms_test';
console.log('Source configuration checked: cdcms_dev.');
console.log('Integration target: cdcms_test.');
console.log('Database owner: cdcms_app.');
const result = spawnSync('npm', ['run', 'test:integration'], {
  stdio: 'inherit',
  env: { ...process.env, TEST_DATABASE_URL: source.toString(), ALLOW_TEST_DATABASE_RESET: 'YES' }
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
NODE
```

This launcher does not print the database URL or password. The test utility itself also checks loopback, `_test`, and explicit reset opt-in before dropping/recreating the schema. Do not run `db:reset:test` or integration tests against `cdcms_dev`.

The owner-provided November 8 R2 integration run reported **19 passed, 0 failed, 0 skipped**. Two P0001 messages came from deliberate fault-injection tests whose rollback tests passed. This run preceded the latest password-reset and seed-hashing changes; rerun the suite before treating the latest source as integration-tested.

## Current limitations and tracked follow-ups

- Admin configuration is seeded rather than managed in an admin UI; MAC-004 is not demonstrated.
- Instructor processing is not implemented; full MAC-006 is not demonstrated.
- Demo role assignments are one role per account; this does not settle the final multiple-role policy.
- The authentication mechanism (server-managed cookie sessions for web and Android) remains provisional under TD-R01. Android currently captures and attaches cookies explicitly on each request through its `CookieManager`; it does not install a global `CookieHandler`. The backend tolerates matching surrounding quotes in cookie values, with middleware-level tests. The cause of the earlier quoted-cookie observation and its relationship to the Android sign-in fix are unproven; compare cookie sessions with a bearer-token approach before finalizing the architecture.
- Five v0.1.1 review findings remain in the follow-up register: (1) seed failure may lose the generated password; (2) `.env.example` pre-sets `ALLOW_*` flags to `YES`; (3) the dummy hash is created lazily; (4) staff detail and decision routes differ in 404/403 disclosure; the detail route is now documented in the contract, while the disclosure-policy difference remains open; (5) `HOST` is a generic environment variable name. These are tracked, not claimed fixed.
- Login lockout and request rate limiting are not implemented. This prototype is not production-hardened.
- Node 26.13.0, `pg`, direct SQL, `node:test`, cookie sessions, and Android application ID `com.samplecollege.cdcms` remain provisional technical choices where noted in the decision register.
- Windows checks, clean dependency installation from a fresh checkout, teammate review, full M3 readiness, and TD-011 stack suitability evaluation remain outstanding.

## Publication and repository safeguards

The instructor requires a public GitHub repository for progress review. Before making the repository public, review the school's publication/IP/ownership rules, resolve repository ownership and licensing decisions, inspect all files and the full reachable Git history, and keep credentials and private local files out. This source package excludes `.git` history; it is not itself a configured Git repository. Root `.gitignore` excludes Eclipse/Buildship/Java-language-server metadata (`.project`, `.classpath`, `.settings/`, and `bin/`), and those machine-specific files were removed from this package. No license is included. Use the fictional demo identity/data until publication permissions and project naming decisions are settled.

# Testing the project

This page separates checks already reported by the project owner from checks that still need to be run by the team. A result from one Ubuntu computer does not prove that Windows setup works.

## Latest recorded results

| Check | Result | Where the evidence comes from |
|---|---|---|
| Backend unit tests | 28 passed, 0 failed, 0 skipped after the `test123` update | Owner-supplied terminal output from 2026-11-08; the full output is not saved as a separate file. |
| PostgreSQL integration tests | Latest owner rerun after the `test123` update: 19 passed, 0 failed, 0 skipped | Terminal output supplied on 2026-11-08; latest output is not saved separately. An earlier run is saved in `docs/evidence/POSTGRES_INTEGRATION_TEST_OUTPUT_2026-11-08_AFTER_PASSWORD_CHANGES.txt`. Target: `cdcms_test`. |
| Backend `npm ci` | Completed successfully | Owner-reported Ubuntu terminal result. |
| Web `npm ci` | Completed successfully | Owner-reported Ubuntu terminal result. |
| Web production build | Completed successfully | Owner-reported Vite build result. |
| Web reviewer sign-in | Working — owner-reported | Both reviewer accounts signed in and displayed their expected office-specific sample records after the password reset. |
| Android debug build | Completed successfully | Owner-reported Gradle 8.9 / Java 17 build result. |
| Windows setup | Not tested yet | A teammate still needs to follow the Windows setup guide on their own computer. |
| Android student sign-in | Working — owner-reported | Both student accounts signed in on the physical Android phone and displayed their own sample records after the password reset. |

## Run the backend unit tests

Open PowerShell in the `backend` folder and run:

```powershell
npm test
```

After the `test123` password validation update, the owner ran `npm test` on Ubuntu. The supplied terminal output reports 28 passed, 0 failed, and 0 skipped. The complete output has not been saved as a separate evidence file.

## Build the staff website

Open PowerShell in the `web` folder and run:

```powershell
npm run build
```

This checks that the website can make a production build. It does not test every browser workflow.

## PostgreSQL integration tests — read first

The integration suite clears and recreates the `public` schema in the database configured for its test run. It must use a separate database named `cdcms_test`, never `cdcms_dev` and never a database containing real or valuable information.

### Prepare the disposable test database (one time)

In pgAdmin, connect to your local PostgreSQL server and open the Query Tool for the `postgres` database. Run this statement once:

```sql
CREATE DATABASE cdcms_test OWNER cdcms_app;
```

If `cdcms_test` already exists, do not create it again. Check that it is your local test database and that `cdcms_app` owns it. The integration suite deletes and recreates its `public` schema repeatedly, so this database must contain no data you need to keep.

### Run the integration tests on Windows

Open PowerShell in the `backend` folder. The following commands read the existing local database URL from `.env`, verify that it points to `cdcms_dev` on `127.0.0.1`, and derive the separate `cdcms_test` URL. The password is not printed or copied into the command:

```powershell
$databaseUrlLine = Get-Content .env |
    Where-Object { $_ -match '^DATABASE_URL=' } |
    Select-Object -First 1

if (-not $databaseUrlLine) {
    throw "DATABASE_URL was not found in backend/.env."
}

$sourceUrl = $databaseUrlLine.Substring('DATABASE_URL='.Length)
if ($sourceUrl -notmatch '^postgres(?:ql)?://cdcms_app:[^@]+@127\.0\.0\.1:\d+/cdcms_dev$') {
    throw "Expected DATABASE_URL to use cdcms_app on 127.0.0.1 with database cdcms_dev. Check backend/.env locally."
}

$env:TEST_DATABASE_URL = $sourceUrl -replace '/cdcms_dev$', '/cdcms_test'
$env:ALLOW_TEST_DATABASE_RESET = 'YES'

try {
    npm run test:integration
}
finally {
    Remove-Item Env:TEST_DATABASE_URL -ErrorAction SilentlyContinue
    Remove-Item Env:ALLOW_TEST_DATABASE_RESET -ErrorAction SilentlyContinue
    Remove-Variable databaseUrlLine, sourceUrl -ErrorAction SilentlyContinue
}
```

The integration test itself checks for a loopback `_test` database and the explicit `ALLOW_TEST_DATABASE_RESET=YES` setting. It drops and recreates the `public` schema before the suite and before each test. You do **not** need to run `npm run db:reset:test` separately. Never point `TEST_DATABASE_URL` at `cdcms_dev`, a shared database, or a database containing valuable data.

Do not paste your database URL or password into chat, GitHub, or a source file.

The owner reran the integration suite after the latest `test123` password-validation update. The supplied 2026-11-08 terminal output reports 19 passed, 0 failed, and 0 skipped against `cdcms_test`; the latest output is not saved separately. The saved output file documents an earlier run. Rerun after future relevant backend or database changes.

## Windows team check

The next useful check is for one teammate to:

1. Clone the public repository on a Windows computer.
2. Follow [SETUP-WINDOWS.md](SETUP-WINDOWS.md) from top to bottom.
3. Record whether `npm ci`, `npm run db:setup`, staff sign-in, and (if applicable) Android build work.
4. Share error messages without passwords, tokens, `.env` contents, or personal machine details.

Do not mark Windows setup as passed until someone has actually completed and recorded it.

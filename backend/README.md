# Backend

The backend is the part that connects the website and Android app to PostgreSQL. It handles sign-in, office access, review decisions, and student clearance status.

For first-time setup, follow the repository's [Windows setup guide](../SETUP-WINDOWS.md). It explains how to create the local database and start the API.

## Start the API

From this folder:

```powershell
npm start
```

The local API address is <http://127.0.0.1:3000>. Its health check is <http://127.0.0.1:3000/api/health>.

## Run backend unit tests

```powershell
npm test
```

The owner reran the unit tests after the `test123` password-validation adjustment. The supplied 2026-11-08 terminal output reports 28 passed, 0 failed, and 0 skipped. The full output is not saved as a separate evidence file.

The PostgreSQL integration tests use a separate `cdcms_test` database that is reset by the test suite. Read [TESTING.md](../TESTING.md) before running them. Never use `cdcms_dev` as the integration-test database.

# Backend API

Node.js + Express API backed by PostgreSQL. The backend owns authentication, role and office-assignment authorization, applicability assignment, requirement decisions, history, and completion calculation.

See the repository root [`README.md`](../README.md) for complete setup, database-safety, demo, and test instructions.

## Start and health check

From this directory, configure `.env` from `.env.example`, then start the API:

```bash
npm start
```

The API binds to `127.0.0.1:3000` by default. Check `http://127.0.0.1:3000/api/health` or run:

```bash
curl http://127.0.0.1:3000/api/health
```

## Main routes

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/staff/review-items?status=Pending|Approved|Rejected|All` (default: Pending)
- `GET /api/staff/review-items/:recordId` (office-scoped item details)
- `POST /api/staff/review-items/:recordId/decision`
- `GET /api/student/clearance-requests`
- `GET /api/student/clearance-requests/:requestId`

The first-slice assignment use case is `src/assignment-service.js`. The development seed calls this backend function. There is no admin assignment endpoint or admin UI in this increment.

## Local tests

```bash
npm test
```

The owner-provided 2026-11-08 output reports 17 passed, 0 failed. The PostgreSQL suite is separate and destructive to its dedicated test database only; see the root README before running `npm run test:integration`.

## Security and integrity boundaries

- Passwords are verified with Argon2id.
- The server issues an opaque HttpOnly, SameSite=Lax session cookie and stores only its SHA-256 digest in PostgreSQL.
- Account, active role, and office assignment are checked server-side.
- Decision state and processing history are committed in one transaction.
- The row is locked during decision processing so parallel decisions cannot both succeed.
- Student record lookup is scoped to the authenticated student; missing and not-owned requests share the same 404 response.
- Seed/migration/API operations require guarded local database targets and opt-in flags; inspect `.env` before running them.
- Processing history rejects UPDATE, DELETE, and TRUNCATE; request/record foreign keys use `RESTRICT`. These protections do not prevent a privileged database owner from altering/dropping the schema protections.
- API binds to loopback by default. LAN exposure requires explicit `HOST` and `ALLOW_LAN` settings and is not the tested physical-phone path.
- Browser origins are allowlisted with `WEB_ORIGINS`. For local Vite preview, include the exact `http://127.0.0.1:4173` origin (or the exact preview host used) and restart the backend after changing `.env`.

Login lockout/rate limiting, deployment HTTPS, operational monitoring, and full production security hardening are not included in this academic first slice.

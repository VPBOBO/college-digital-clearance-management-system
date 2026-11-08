# Non-Functional Requirements (NFR)

Prefix `NFR` · Baseline 0.1 · Last reviewed 2026-11-04
Related: [../decisions.md](../decisions.md), [mvp-scope.md](mvp-scope.md)
Legend and conventions: [README.md](README.md).

These requirements are proportional to an **academic prototype**, not a production institutional system (SRC-01 §20). Security limitations must be stated before any real institutional deployment (NFR-011).

## A. Specified requirements

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| NFR-001 | Passwords are hashed and verified with Argon2id in the Node.js backend only, using the maintained `argon2` library. | CONFIRMED | REQUIRED | SRC-01 §9, §20 | 2026-11-04 | Decision record: TD-006. |
| NFR-002 | Original passwords are never stored. Password hashes are never returned to clients and never written to logs. | CONFIRMED | REQUIRED | SRC-01 §9, §20 | 2026-11-04 | |
| NFR-003 | No custom hashing algorithm. The library generates and manages salts. Argon2id parameters follow library recommendations and are not so costly that ordinary login becomes impractical. | CONFIRMED | REQUIRED | SRC-01 §9 | 2026-11-04 | Parameter values are not yet chosen. |
| NFR-004 | Failed logins do not reveal unnecessary account information. | CONFIRMED | REQUIRED | SRC-01 §9 | 2026-11-04 | |
| NFR-005 | User inputs are validated before processing. | CONFIRMED | REQUIRED | SRC-01 §20 | 2026-11-04 | |
| NFR-006 | Database access uses parameterized queries. | CONFIRMED | REQUIRED | SRC-01 §20 | 2026-11-04 | |
| NFR-007 | Database credentials and other secrets live in environment variables. Real credentials are never committed. A `.env.example` lists variable names only. | CONFIRMED | REQUIRED | SRC-01 §19, §20 | 2026-11-04 | |
| NFR-008 | Error messages and logs do not expose passwords, credentials, password hashes or other sensitive data. | CONFIRMED | REQUIRED | SRC-01 §20 | 2026-11-04 | |
| NFR-009 | The project can be cloned, configured, run and tested on Ubuntu Linux and on Windows. Setup instructions label each command by operating system, and avoid unnecessary OS-specific dependencies. | CONFIRMED | REQUIRED | SRC-01 §3 | 2026-11-04 | |
| NFR-010 | Code is readable and consistently named. API responses use a clear, consistent format. Business logic is not duplicated across clients. | CONFIRMED | REQUIRED | SRC-01 §18 | 2026-11-04 | |
| NFR-011 | Security limitations are stated explicitly before any actual institutional deployment is considered. | CONFIRMED | REQUIRED | SRC-01 §20 | 2026-11-04 | |
| NFR-012 | Documentation matches the implementation. Proposed functionality is never documented as completed. Code is not described as tested unless it was run and verified. | CONFIRMED | REQUIRED | SRC-01 §18, §19 | 2026-11-04 | |

## B. Targets not yet known

| ID | Description | Info status | Class | Source | Updated | Notes |
|---|---|---|---|---|---|---|
| NFR-013 | Expected number of users and concurrent use; response-time expectations. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[EXPECTED_LOAD]` |
| NFR-014 | Authentication mechanism for the two clients (session-based or token-based). | UNKNOWN | UNDECIDED | SRC-01 §9 | 2026-11-04 | Open decision TD-R01. Argon2id is unaffected. |
| NFR-015 | Accessibility and language needs of users. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[ACCESSIBILITY_LANGUAGE_NEEDS]` |
| NFR-016 | Minimum Android version and target devices. | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[ANDROID_TARGETS]` |
| NFR-017 | Where the MVP demonstration runs (one laptop on a local network, or a hosted server). | UNKNOWN | UNDECIDED | SRC-INST (pending) | 2026-11-04 | `[DEMO_ENVIRONMENT]`. Affects how the Android app reaches the backend. |

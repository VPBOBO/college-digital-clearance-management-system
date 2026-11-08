# PostgreSQL Integration Test Output — 2026-11-08

**Evidence class:** Owner-supplied terminal output from the Ubuntu workstation. This is a sanitized transcription of the output supplied in chat; it is not a new execution by the package preparer. No database URL, password, or credential is included.

## Target confirmation

```text
Source configuration checked: cdcms_dev.
Integration target: cdcms_test.
Database owner: cdcms_app.
Starting integration tests...
```

## Test output

```text
✔ FS-01 authenticates and does not return password hash
✔ FS-02 backend assignment applies program-specific requirements
✔ FS-02 assignment rejects a template with zero applicable mandatory requirements
✔ FS-03 review queue defaults to Pending and supports status filtering
✔ FS-03B Reviewer B cannot see Office A items and detail access is scoped
✔ FS-04 authorized reviewer can retrieve a Pending review item
✔ FS-05 missing and whitespace-only REQUIRED remark returns 422; OPTIONAL permits omission
✔ FS-06 wrong office assignment and wrong role return 403
✔ FS-07 decision and history contain matching actor and status fields
✔ FS-08 another student receives the identical 404 body as an unknown request
✔ FS-09 completion is derived from persisted mandatory requirement status
✔ FS-11 a second decision returns 409 before remark validation
✔ FS-13 two parallel decisions produce exactly one success and one conflict
✔ FS-14 unauthenticated protected request returns 401
Unhandled API error: P0001
✔ FS-15 history insert failure rolls back the requirement update
Unhandled API error: P0001
✔ FS-15 status update failure cannot create a history event
✔ FS-16 concurrent duplicate assignment creates one request only
✔ history is append-only and request deletion cannot cascade away records/history
✔ FS-17 inactive office staff assignment is denied

ℹ tests 19
ℹ suites 0
ℹ pass 19
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

The two `P0001` error log lines appeared during the intentional fault-injection tests; both corresponding rollback tests passed.

## Qualification

The launcher selected `cdcms_test`, derived from the local `cdcms_dev` configuration after checking its loopback host and application user. The integration suite resets the `public` schema in its configured `_test` database before each test. It must never be run against `cdcms_dev`.

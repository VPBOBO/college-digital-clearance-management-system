# College Digital Clearance Management System

CDCMS is a school project that shows how a college clearance process could work online instead of passing around a paper form.

It is a working first version for a class project. It uses fictional **Sample College** data only.

## What you can try

- **Staff website:** office reviewers can sign in, see the items assigned to their office, filter them, and approve or reject an item with a remark.
- **Student Android app:** students can sign in and view their own clearance items and current progress.
- **Backend and database:** the backend checks access, saves decisions and history, and calculates the displayed progress.

The full project is not finished yet. The admin screens for managing school information and clearance requirements are not available. The instructor-processing workflow is also not implemented.

## Try the project

Most team members use Windows. Start with the [Windows setup guide](SETUP-WINDOWS.md).

Other useful guides:

- [How to use the demo](HOW-TO-USE.md)
- [Testing the project](TESTING.md)
- [Fixing common problems](TROUBLESHOOTING.md)
- [Project documentation](docs/README.md)

## Demo accounts

All five fictional demo accounts use the same local demo password:

**Password: `test123`**

| Username | Demo role |
|---|---|
| `reviewer-a` | Sample Office A reviewer |
| `reviewer-b` | Sample Office B reviewer |
| `student-a` | Sample Student A |
| `student-b` | Sample Student B |
| `admin` | Sample administrator account; admin screens are not built yet |

This password is public because these are practice accounts. It is only for a local demo on your own computer. Do not use it for personal accounts, real student accounts, a hosted server, or a production system. The backend is set to listen on your own computer by default; keep `ALLOW_LAN=NO`.

When a new local database is seeded from the included `.env.example`, new demo accounts use `test123`. Running setup again does not change passwords for accounts that already exist. See the troubleshooting guide if an existing account needs to be reset.

## Project folders

```text
android/    Student Android app
backend/    API, database setup, and backend tests
web/        Staff reviewer website
docs/       Project requirements, plans, notes, and test records
```

## Tools and versions

The project owner's Ubuntu setup has been reported/tested with Node.js 26.13.0, PostgreSQL 18.6, Java 17, and Gradle 8.9. These are the owner's environment versions, not proof that the same setup has been tested on Windows. The npm projects declare support for Node.js `>=22 <27`; the team has not yet completed the Windows checks or selected a final team-wide Node version.

## What has been tested

The owner reports that all 28 backend unit tests passed after the `test123` password update. The full terminal output was supplied in the project conversation but is not saved as a separate evidence file. Both web reviewer accounts reportedly signed in and showed their expected office-specific sample records. Both Android student accounts reportedly signed in on a physical phone and showed their own sample records after the password reset. The owner reran the PostgreSQL integration suite after the latest `test123` password-validation update and supplied terminal output on 2026-11-08: 19 passed, 0 failed, and 0 skipped against `cdcms_test`. The latest output is not saved separately; an earlier run's output remains in `docs/evidence/POSTGRES_INTEGRATION_TEST_OUTPUT_2026-11-08_AFTER_PASSWORD_CHANGES.txt`. Rerun the suite after future relevant backend or database changes. The web production build and Android debug build were also reported successful. Windows setup has not yet been tested by a teammate. See [TESTING.md](TESTING.md) for details.
## GitHub repository

The project is public so the instructor can view progress:

[VPBOBO/college-digital-clearance-management-system](https://github.com/VPBOBO/college-digital-clearance-management-system)

The repository is owned by the project owner's personal GitHub account at present. The school publication, ownership, and licensing rules still need to be checked. No open-source license is included. The publication review so far is partial; see [the publication review note](docs/reviews/PUBLICATION_REVIEW_2026-11-08.md).

Please use fictional data only. Do not add real student records, original clearance forms, interview notes, passwords, database credentials, or private machine details to the public repository.

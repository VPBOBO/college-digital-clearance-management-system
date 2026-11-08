# Ubuntu Pilot — Previously Reported Results

**Date recorded:** 2026-11-07  
**Evidence status:** Summary of results reported from earlier interactive terminal sessions; not a verbatim terminal transcript and not independently re-executed while preparing this repository package.  
**M3 status:** In Progress. This report does not complete M3 v1.1 or TD-011.

## Reported component results

| Component/check | Reported observation | Qualification |
|---|---|---|
| Node.js / npm / NVM | Node.js 26.13.0; npm 11.20.0; NVM 0.40.7 | Node 26 remains a candidate under TD-R12, not the approved team standard. |
| PostgreSQL server | PostgreSQL 18.6; service active; readiness and local `psql` checks accepted connections | Local server readiness only. |
| React/Vite scratch app | React 19.3.1 and Vite 8.3.6 installed; development server started; owner confirmed starter page displayed; production build succeeded | Scratch test, not CDCMS. Earlier npm audit output reported four moderate findings; no force-fix was applied. |
| Express scratch test | Express 5.3.0 installed; local HTTP smoke test returned status 200 | Supplemental scratch test. |
| Argon2id scratch test | `argon2` 0.45.2 installed; Argon2id hash creation and correct/incorrect password verification behaved as expected | Installation emitted an `allowScripts` warning for the package install script. Review before relying on this as a clean M3 pass. Do not publish hashes or passwords. |
| Node-to-PostgreSQL probe | `pg` 8.23.1; Node connection passed; basic query passed; temporary INSERT/UPDATE/SELECT and ROLLBACK passed; exit code 0 | Supplemental probe in a scratch project. It does not establish the integrated Express backend or MAC-007. |
| Git | Git 2.53.0 available; global developer identity configured | GitHub authentication and repository collaboration not checked. |
| Android emulator tooling | ADB 37.0.1; Emulator 37.1.11.0; emulator appeared in `adb devices`; boot-completed property returned 1 | Emulator booted. Android Studio temporary Java project build and app launch were not tested. |

## Outstanding M3 / TD-011 items

- Android Studio project setup and temporary Java app build/launch.
- Emulator-to-host network check, or documented reason for deferral.
- Review and record resolution of the Argon2 install-script warning.
- Record evidence references and outputs in the official M3 v1.1 per-machine result log.
- Complete the two Windows developer checks and other applicable machine records.
- Obtain independent teammate review of the evidence before marking M3 Verified.
- Complete the broader TD-011 evaluation of compatibility **and suitability**, including hardware/project fit. M3 checks alone do not settle TD-011.

## Safe evidence handling

This report intentionally omits private machine identifiers, usernames, local paths, database names, credentials, password hashes, and raw error text. The underlying terminal transcript was not included with this summary. Replace or supplement this report with sanitized original command output when available; do not promote reported observations to independently reviewed evidence without checking the source output.

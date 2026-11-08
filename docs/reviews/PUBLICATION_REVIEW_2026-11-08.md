# Public GitHub Repository Review — 2026-11-08

## Why this note exists

The repository was made public so the instructor can view project progress. The full publication-safety review required by TD-020 was not completed before the first push. This note records a limited follow-up review and its results; it does **not** claim that every publication check is complete.

Repository: <https://github.com/VPBOBO/college-digital-clearance-management-system>

Current main commit after the history cleanup: `6e905c2389223cae8bd6f933eaf2ed1b5157df10`.

## Checks performed on 2026-11-08

The following results are based on commands run by the project owner and terminal output supplied for review:

| Check | Result | What it means |
|---|---|---|
| Git history file-name scan for `.env`, IDE project files, local Android properties, and APKs | No matches, excluding the intentionally tracked `.env.example` | None of those file names appeared in the reachable history checked at the time. |
| Git history content scan for selected private-path, private-key, GitHub token, AWS key, and PostgreSQL URL patterns | Four files matched the broad pattern | The matches were inspected. They were example/test database URLs and the documented demo credential, not identified as a real user password, token, or private key. |
| Review of the M3 environment checklist | Found earlier machine-specific Ubuntu hardware and storage details | Those details were removed from the checklist. |
| History rewrite | Completed | The initial commit was amended; the public `main` branch was force-updated with `--force-with-lease` to commit `6e905c2`. |
| Follow-up scan for the removed hardware strings in reachable history | No matches | The old commit `ff803ad` was no longer reachable from the checked local branches/tags, and `main` tracked the rewritten `origin/main`. |
| Working tree and remote branch | Clean and synchronized | Owner terminal output showed `main...origin/main` with no working-tree changes after the cleanup. |

The broad content scan matched these paths in the old commit:

- `backend/.env.example`
- `backend/test/db-safety.test.js`
- `backend/test/demo-password-reset.test.js`
- `README.md`

The database URLs contain example values such as `CHANGE_THIS_LOCAL_PASSWORD` or test-only values. The demo password is intentionally public for local fictional accounts; it must never be used for real users or a hosted/production system.

## Requirements folder review

The current requirements source register lists both:

- `SRC-FORM` — actual traditional college clearance form: **NOT YET AVAILABLE**.
- `SRC-INST` — institutional policies and interviews: **NOT YET AVAILABLE**.

The inspected requirements files use placeholders and labelled examples, not verified office lists or policies from an actual clearance form/interview. Keep original forms, raw interview notes, real student details, and confidential school material out of the public repository unless the institution explicitly authorizes publication.

## Current repository ownership and license

The repository is currently hosted under the project owner's personal GitHub account. This records the current arrangement; future administrator succession or transfer arrangements are not decided. The repository has no license file. Do not add a license until the relevant ownership and school rules have been checked.

## What remains open

This review is **partial**. The following still need to be checked or confirmed:

1. Applicable school/college publication, intellectual-property, ownership, branding, and licensing rules (TD-R17).
2. The longer-term repository administrator/succession arrangement (TD-R15).
3. A complete review of all current files and reachable Git history, not only the selected filename/content patterns listed above.
4. GitHub repository settings, collaborators, rulesets, issues, pull requests, workflows, artifacts, logs, and any other public metadata/content that may exist.
5. Any future changes that introduce new school documents, names, records, or external integrations.

Do not mark TD-020 fully verified based only on this limited scan. Repeat the review after significant repository changes and before adding any institutional source material.

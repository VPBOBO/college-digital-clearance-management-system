# How to use the CDCMS demo

This guide explains the features that are currently available. The sample school and all sample records are fictional.

## Sign in

### Staff website

1. Start the backend and web app using [SETUP-WINDOWS.md](SETUP-WINDOWS.md).
2. Open <http://localhost:5173>.
3. Sign in with one of these accounts:

| Username | What it reviews |
|---|---|
| `reviewer-a` | Sample Office A items |
| `reviewer-b` | Sample Office B items |

Password for both: **`test123`**.

### Student Android app

Sign in using:

| Username | Student |
|---|---|
| `student-a` | Sample Student A |
| `student-b` | Sample Student B |

Password: **`test123`**.

For an emulator, set the app's API server URL to `http://10.0.2.2:3000`. For a physical phone using ADB reverse, use `http://localhost:3000`.

## What staff reviewers can do

A reviewer can see the fictional clearance items assigned to their office. The status filters include Pending, Approved, Rejected, and All. A reviewer can open an item, approve or reject it, and add a remark.

A reviewer should only see the items assigned to their office. The two sample reviewers are used to demonstrate that separation.

## What students can do

A student can see their own clearance items, current statuses, remarks, and the displayed progress. Refresh the student screen after a reviewer changes an item.

## What is not available yet

- There is no finished admin screen for configuring academic years, offices, programs, or clearance requirements.
- The full instructor clearance workflow is not implemented.
- The `admin` sample account exists as a fixture, but there is no admin interface to use yet.

These are unfinished features, not problems with your installation.

## Demo-only reminder

`test123` is intentionally simple and public so classmates can sign in to the local demo. Do not use it for personal accounts, real students, public hosting, or production.

# M3 — Environment Readiness Checklist (Ubuntu + Windows) — Revision 1.1

**Project:** College Digital Clearance Management System (CDCMS)  
**Milestone:** M3 — Three-machine environment readiness  
**Prepared:** 2026-11-05  
**Revision:** 1.1 — review corrections applied  
**Status:** Working checklist — no M3 test results are recorded; earlier owner reports are labeled separately as Reported only  
**Related document:** `TD-011_Stack_Readiness_Checklist.md` (the fuller stack and compatibility checklist)

> This companion document gives OS-specific commands for the team's planned Ubuntu and Windows development machines. It does not modify Requirements Baseline 0.1, approve a Node.js standard, create the application, or replace the broader TD-011 checklist. Use temporary test folders only. Do not put real student data, institutional records, secrets, passwords, tokens, or password hashes into test evidence or the public repository.

---

## 1. What M3 must establish

M3 checks whether the team's actual machines can support the agreed development stack and whether important cross-platform dependencies behave consistently.

The planned stack is:

| Area | Project choice | What M3 checks |
|---|---|---|
| Student application | Android, Java, Android Studio | A temporary Java Android app can build and run on an emulator or physical device. |
| Staff/admin application | React + Vite | A temporary React/Vite project installs, starts, and builds. |
| Backend | Node.js + Express | Node and npm run; a temporary Express 5 service starts and responds. |
| Database | PostgreSQL | The intended database host can run PostgreSQL and accept a local connection; other machines can verify client readiness or defer shared access until configured. |
| Password hashing | Argon2id through the Node.js `argon2` package | The package installs and its hash/verify operations work with dummy-only test input. |
| Version control | Git + GitHub | Git is available and developer identity is configured; repository authentication is checked later through the approved team method. |
| API communication | REST + JSON | No API is built in M3. Basic host/emulator reachability is tested only where applicable. |

### Node.js candidate — not a final team standard

The current working candidate in Decision Pack v5.1.1 is **Node.js 26.13.0**. This is a compatibility-test candidate, not an approved final standard. Record what each machine actually runs. Do not add `.nvmrc`, lock an `engines.node` range, or declare Node 26 selected until the team has compared all three machines and completed the relevant package tests.

### Expected machine mix

The current planning assumption is one Ubuntu machine and two Windows machines. Confirm the actual OS and version of each developer; do not assume the machines match this plan. Use the Ubuntu section on Linux machines and the Windows section on Windows machines.

---

## 2. How to use this checklist

Complete one copy of Section 3 and Section 4 for each developer. Use the matching OS-specific commands in Sections 5–9.

For each check, record an individual test result, evidence basis, and sanitized evidence reference. Do not record a check as `Pass` merely because the software is installed or because a teammate says it worked on another machine.

Keep **individual test results**, **evidence basis**, and **overall milestone progress** separate. The overall progress vocabulary below matches TD-019 in Decision Pack v5.1.1.

**Individual test result — record one per check:**

- `Not run` — no test has been performed for this checklist entry.
- `Pass` — the named test ran on the named machine and met its stated pass condition.
- `Fail` — the named test ran but did not meet its pass condition.
- `Blocked` — the test could not be completed because of a stated technical, access, or external blocker.
- `Not applicable` — the test genuinely does not apply to that machine or role; explain the alternative arrangement and who confirmed it.

**Evidence basis — record separately:**

- `Reported` — the developer previously supplied the information, but it has not yet been rerun and recorded for M3. `Reported` is not a test result and is not a pass.
- `Run output recorded` — the test was run and a sanitized evidence reference was recorded.
- `Reviewed` — another team member reviewed the evidence; record the reviewer's label and review date. This is not a separate test result.

**Overall M3 progress status — use only TD-019's vocabulary:**

- `Suggested` — the checklist is prepared, but substantive checks have not started.
- `In Progress` — checks are underway, evidence is incomplete, or a failure is being investigated.
- `Implemented` — all applicable checks have been completed and their results/evidence recorded; independent review is still pending. There must be no unresolved required failure or blocker.
- `Verified` — another team member has reviewed the recorded evidence and the M3 exit criteria are satisfied.
- `Blocked` — an unresolved required blocker prevents M3 from progressing or completing.

**Mapping from the earlier draft's labels:** `Reported` becomes evidence basis `Reported` and the individual result remains `Not run`; `Tested — pass` becomes test result `Pass`; `Tested — fail` becomes `Fail`; `Verified` is recorded as an evidence review, while overall progress becomes `Verified` only when the M3 exit criteria are met; `Blocked` remains an individual result and also becomes the overall status only when the blocker prevents milestone progress. `Not applicable` remains an individual result with a reason.

Do not use `Reported`, `Pass`, or `Fail` as the overall M3 progress status. A reported result must be rerun on the named machine before it can count toward M3 completion.

### Evidence rules

1. Record the developer label (Dev 1, Dev 2, or Dev 3), date, OS, software versions, result, and a short evidence reference.
2. Terminal output may be attached to an internal team note, but remove usernames, private paths, IP addresses where not needed, email addresses, tokens, passwords, and other personal or sensitive details before anything is published.
3. Never record a real password, dummy password value, Argon2 hash, database password, GitHub token, or access key.
4. Keep all temporary test projects outside the future application repository. Delete them after evidence is captured, unless the team has a clear reason to retain sanitized test evidence.
5. Do not change the stack or install substitute libraries silently. Record failures first, identify the cause, and raise a decision if a change is genuinely needed.

---

## 3. Developer machine record — complete one per person

| Field | Value |
|---|---|
| Developer label | Dev 1 / Dev 2 / Dev 3 |
| Date checked | |
| Actual operating system and edition | |
| OS version / build | |
| CPU model | |
| CPU architecture (x64 / ARM64 / other) | |
| Installed RAM | |
| Free disk space on development drive | |
| Assigned or likely responsibility | Backend / Web / Android / Shared |
| Node version manager (name and version) | |
| PostgreSQL role | Local server / Client only / Not yet decided |
| Android test target | Emulator / Physical device / Both / Not yet decided |
| Android device or emulator available? | |
| Overall M3 progress status (TD-019) | Suggested / In Progress / Implemented / Verified / Blocked |
| Evidence location | |
| Blockers / notes | |

Do not publish personal machine details in the public repository. The team may keep detailed records privately and publish only a sanitized summary such as OS family, architecture, and tested tool versions.

### 3.1 Earlier owner-supplied environment observations — reported only

The following details were supplied in an earlier conversation/terminal report. They are included to avoid losing the starting information, **not** as M3 test results. Enter `Reported` as the evidence basis and leave the corresponding M3 test result as `Not run` until the relevant checks are repeated and evidence is recorded on the named machine.

| Item | Earlier reported observation | M3 treatment |
|---|---|---|
| Ubuntu machine | Ubuntu development machine; personal hardware and storage details are not included here | Reported; rerun checks privately. |
| Node.js | NVM 0.40.7; Node.js 26.13.0 selected; npm 11.20.0; a basic Node REPL smoke test succeeded | Reported; rerun version and runtime checks. Does not prove Vite, Express, or Argon2 compatibility. |
| PostgreSQL | PostgreSQL 18.6; cluster `18/main` online; `pg_isready` accepted a local connection; `sudo -u postgres psql` worked | Reported; rerun client/server readiness and connection checks. |
| Git | Git 2.53.0 | Reported; rerun `git --version` and configuration checks. |
| Argon2 prerequisite | `libatomic.so.1` was present | Reported only; this does **not** prove the Node.js `argon2` package installs, uses Argon2id, or passes hash/verify tests. |

Do not treat the earlier hardware/storage numbers as current; they are time-specific observations. Keep detailed machine information in the team's private working record, not the public repository.

---

## 4. Checks required across the team

| Check | Dev 1 | Dev 2 | Dev 3 | Team conclusion |
|---|---|---|---|---|
| OS, version, architecture, RAM, and free disk recorded | | | | |
| Node.js exact version recorded | | | | |
| npm version recorded | | | | |
| Version manager and version-resolution behavior recorded | | | | |
| React/Vite temporary project installs, starts, and builds | | | | |
| Express 5 temporary service starts and responds | | | | |
| Argon2 package installs and dummy hash/verify check passes | | | | |
| PostgreSQL client is available | | | | |
| PostgreSQL server readiness and connection checked on intended host | | | | |
| Git is installed and configured | | | | |
| GitHub account access method identified; no token recorded | | | | |
| Android Studio and SDK are ready for the Android developer | | | | |
| Temporary Java Android project builds and launches | | | | |
| Emulator-to-host or physical-device connectivity checked, if applicable | | | | |
| Differences and blockers have an owner and next action | | | | |

Not every developer must host a local PostgreSQL server or use an emulator. Record the team's intended arrangement rather than treating every optional component as a failure.

---

## 5. OS and hardware inventory

### 5.1 Ubuntu — Bash

Run from a normal terminal:

```bash
cat /etc/os-release | grep -E '^(PRETTY_NAME|VERSION_ID)='
uname -m
lscpu | grep -E 'Model name|CPU\(s\)|Virtualization'
free -h
df -h "$HOME"
```

What these checks show:

- `/etc/os-release`: Ubuntu release information.
- `uname -m`: machine architecture, such as `x86_64` or `aarch64`.
- `lscpu`: processor model, logical CPU count, and virtualization information when exposed by the system.
- `free -h`: installed/available memory in a readable format.
- `df -h "$HOME"`: free space on the filesystem containing the developer's home directory.

If an Android emulator will be used, also inspect virtualization support and KVM availability:

```bash
ls -l /dev/kvm
id
```

An error that `/dev/kvm` does not exist or is not accessible is a finding to investigate; do not assume the Android toolchain is unusable until the emulator and physical-device alternatives are assessed.

### 5.2 Windows — PowerShell

Run in a normal PowerShell window:

```powershell
Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion, OsBuildNumber, OsArchitecture, CsTotalPhysicalMemory
Get-CimInstance Win32_Processor | Select-Object Name, Architecture, NumberOfCores, NumberOfLogicalProcessors
Get-PSDrive -PSProvider FileSystem | Select-Object Name, @{Name='FreeGB';Expression={[math]::Round($_.Free / 1GB, 1)}}
```

What these checks show:

- Windows edition, version/build, OS architecture, and physical memory.
- Processor model, architecture, and core counts.
- Free space on available filesystem drives.

If an Android emulator will be used, confirm the machine's virtualization configuration and that the Android Emulator actually launches. Record the result from Android Studio rather than assuming that a CPU feature alone guarantees a working emulator.

---

## 6. Node.js, npm, and version manager

Run these common commands in the appropriate terminal:

```text
node --version
npm --version
node -p "process.platform + ' ' + process.arch"
```

Record the exact Node version (including patch), npm version, and the platform/architecture reported by Node. The reported runtime is more useful than a statement that Node is installed.

### 6.1 Ubuntu — NVM (`nvm-sh`) check

In Bash:

```bash
type -a nvm
nvm --version
nvm current
nvm ls
nvm alias default
```

Notes:

- NVM for Linux/macOS is normally a shell function, so `type -a nvm` is a useful check.
- `nvm current` reports the version active in the current shell.
- `nvm ls` and `nvm alias default` show installed versions and the configured default.
- If NVM is not the installed manager, record the actual manager and use its documented equivalent commands. Do not install a second version manager merely to make the checklist match.

### 6.2 Windows — identify the actual version manager

In PowerShell:

```powershell
Get-Command nvm -ErrorAction SilentlyContinue
nvm version
nvm current
nvm list
```

These commands are examples for **NVM for Windows**, not a universal interface for every release. In particular, the version-reporting subcommand may differ by installed version. If `nvm version` is not recognized, do not mark Node readiness as failed solely for that reason: record the exact error, obtain the installed manager version from its own documentation or installed-program information, and record the actual manager and its version-resolution behavior. Do not assume that NVM for Windows and the Unix `nvm-sh` behave identically.

For NVM for Windows, record its operating mode and whether automatic project-version detection is enabled. The behavior of `.nvmrc` depends on the installed version, mode, and configuration; this remains an open team check under TD-R13. A version file should be standardized only after the team has agreed on the exact Node version.

### Node/npm pass condition

- Node starts successfully on the machine.
- npm starts successfully.
- The exact versions and architecture are recorded.
- The developer can explain how their version manager selects the active Node version.
- The team can compare the same candidate version on all three machines without declaring the candidate approved prematurely.

Before package-install tests, check whether npm can reach its configured registry:

```text
npm ping
```

Record success or the sanitized error. If registry access, DNS, or a proxy prevents npm from reaching the registry, mark the affected package test `Blocked`, not `Fail`; a network failure does not establish that the package is incompatible.

---

## 7. React + Vite temporary compatibility check

This test uses a disposable starter project. It is not the actual staff/admin application.

First create and enter a parent temporary directory so the disposable project is kept outside the future application repository. Run the matching commands in Bash or PowerShell:

```text
mkdir m3-vite-check-parent
cd m3-vite-check-parent
npm create vite@latest m3-vite-check -- --template react
cd m3-vite-check
npm install
npm run dev
```

The Vite creation flow may display additional questions depending on the CLI version. Record the exact prompt choices and the answers selected; do not silently accept a different framework or template.

Open the local address printed by Vite in a browser. Confirm that the starter page loads. Stop the development server with `Ctrl+C`, then run:

```text
npm run build
npm ls react vite
```

Record the exact React and Vite versions from the output/lockfile and whether installation, startup, browser loading, and build all succeeded.

**Pass condition:** The temporary React/Vite project installs, runs in a browser, and completes a production build on the machine being checked.

If creation or installation fails, record the complete error after removing private paths and personal details. Do not change the project's chosen framework as a first response to a failed local setup.

---

## 8. Express 5 temporary compatibility check

Run this in a separate disposable folder, not inside the Vite folder and not inside the future backend repository. The JavaScript test is saved as a `.js` file and then launched with `node`; this avoids relying on the shell's handling of embedded quotes when invoking a native executable. Microsoft documents changed native-command argument parsing beginning with PowerShell 7.3; Windows PowerShell 5.1 uses the legacy behavior.

```text
mkdir m3-express-check
cd m3-express-check
npm init -y
npm install express@5
npm ls express --depth=0
```

Create a plain-text file named `check-express.js` in this temporary folder. Use a text editor on either OS and paste the following JavaScript exactly:

```javascript
const express = require("express");
const http = require("node:http");

const app = express();
app.get("/", (_req, res) => res.status(200).send("ok"));

const server = app.listen(0, "127.0.0.1", () => {
  const address = server.address();
  if (!address || typeof address === "string") {
    console.error("Could not determine the local test server port.");
    server.close(() => process.exit(1));
    return;
  }

  const request = http.get(
    { hostname: "127.0.0.1", port: address.port, path: "/" },
    (response) => {
      console.log("Express smoke test HTTP status:", response.statusCode);
      response.resume();
      server.close(() => {
        process.exitCode = response.statusCode === 200 ? 0 : 1;
      });
    }
  );

  request.on("error", (error) => {
    console.error("Express request failed:", error.message);
    server.close(() => process.exit(1));
  });
});

server.on("error", (error) => {
  console.error("Express server failed:", error.message);
  process.exit(1);
});
```

Run the file in Bash or PowerShell with the same command:

```text
node check-express.js
```

Expected result: the terminal reports HTTP status `200` and the command exits successfully. A script file avoids shell-specific quoting of JavaScript passed through `node -e`, especially under Windows PowerShell 5.1. Record the Node and Express versions and any error. This is only a local runtime check; it does not create the actual backend or decide the API design.

**Pass condition:** Express 5 installs under the tested Node version, starts a local server, and responds to the test request.

---

## 9. Argon2 native-package check

This is a cross-platform dependency check. It is especially important because successful Node installation does not prove that the native `argon2` package will install and run.

Use a separate disposable folder:

```text
mkdir m3-argon2-check
cd m3-argon2-check
npm init -y
npm install argon2
npm ls argon2 --depth=0
```

Create a plain-text file named `check-argon2.js` in this temporary folder. Use a text editor on either OS and paste the following JavaScript exactly:

```javascript
const argon2 = require("argon2");

(async function main() {
  const dummyPassword = "m3-dummy-only-password";
  const hash = await argon2.hash(dummyPassword, {
    type: argon2.argon2id,
  });

  const correctPasswordAccepted = await argon2.verify(hash, dummyPassword);
  const wrongPasswordAccepted = await argon2.verify(
    hash,
    "m3-wrong-dummy-password"
  );
  const argon2idConfirmed = hash.startsWith("$argon2id$");

  // Print only boolean outcomes. Never print the hash or either dummy password.
  console.log("Argon2id algorithm confirmed:", argon2idConfirmed);
  console.log("Correct password accepted:", correctPasswordAccepted);
  console.log("Wrong password rejected:", !wrongPasswordAccepted);

  if (
    argon2idConfirmed !== true ||
    correctPasswordAccepted !== true ||
    wrongPasswordAccepted !== false
  ) {
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error("Argon2 check failed:", error.message);
  process.exit(1);
});
```

Run the file in Bash or PowerShell with the same command:

```text
node check-argon2.js
```

Expected result: all three printed values are `true`. The algorithm check requires the encoded hash prefix `$argon2id$`; the test prints neither the dummy password nor the generated hash. A script file avoids shell-specific quoting of JavaScript passed through `node -e`, especially under Windows PowerShell 5.1.

**Never use a real password or any password that will be used by the application. Never copy a password hash into screenshots, documentation, shell history, or Git.**

Record:

- Node and npm versions.
- `argon2` package version.
- Whether installation succeeded using a prebuilt binary or required a source build, if the output makes that clear.
- Whether the hash/verify smoke test passed.
- The sanitized error text and investigation, if it failed.

**Pass condition:** The `argon2` package installs and both verification outcomes match the expected result on each machine where this cross-platform check is required. A failure is a blocker to investigate, not permission to silently replace Argon2id.

---

## 10. PostgreSQL client and server readiness

The team does not automatically need a PostgreSQL server on all three machines. Identify which machine will host the development database, or record that the hosting arrangement is still open. Do not create the actual clearance database or tables during this readiness check.

### 10.1 Ubuntu — Bash

Check whether the PostgreSQL client is available:

```bash
psql --version
```

If this machine is intended to host the local server, check service readiness and server version:

```bash
systemctl is-active postgresql
pg_isready
sudo -u postgres psql -Atqc "SHOW server_version;"
```

Use the server commands only if PostgreSQL is installed locally and the developer has the required local administrative access. Record the client version separately from the server version; they are not necessarily the same.

### 10.2 Windows — PowerShell

Check whether the PostgreSQL client is available:

```powershell
psql --version
```

If this machine is intended to host a local PostgreSQL server, inspect its service and readiness:

```powershell
Get-Service -Name 'postgresql*' -ErrorAction SilentlyContinue | Select-Object Status, Name, DisplayName
pg_isready -h localhost -p 5432
```

If the service is running and the developer has a local database account, verify the server version. Replace `YOUR_LOCAL_DB_USER` with the actual local database username; `psql` may prompt for the password:

```powershell
psql -h localhost -p 5432 -U YOUR_LOCAL_DB_USER -d postgres -c "SHOW server_version;"
```

Do not put the password directly in the command. Do not paste the connection string or credentials into the public repository.

### PostgreSQL result rules

- **Server host:** Verify the PostgreSQL service starts and accepts a local connection; record the server version.
- **Client-only machine:** Verify `psql` is available. Record that a connection test is deferred until the team has established the shared development database and credentials.
- **No role assigned yet:** Record the status as open; do not install or expose an unnecessary database server on every machine.

Never expose PostgreSQL directly to the public internet for convenience.

---

## 11. Git and GitHub readiness

### 11.1 Common commands

```text
git --version
git config --global --get user.name
git config --global --get user.email
git config --get core.autocrlf
```

Confirm Git is installed and the commit identity is configured. The values from `user.name` and `user.email` may identify the developer; do not include personal email addresses in public test evidence unless the team explicitly approves it. Record `core.autocrlf` as `true`, `false`, `input`, or `(unset)`. An unset value is a finding to resolve under TD-017; do not change it during M3 before the team agrees on the cross-platform `.gitattributes` policy.

### 11.2 Ubuntu / Windows notes

The commands above work in Ubuntu Bash and Windows PowerShell. If Git is installed but a command cannot be found, record the installation location and PATH issue rather than installing another copy immediately.

Do not create the shared project repository or push the baseline as part of M3. Repository ownership, branch workflow, and publication-safety decisions belong to their separate milestones. Do not place a GitHub password or token in the checklist. Verify the team's approved GitHub authentication method when the repository is ready.

**Pass condition:** Git runs locally and the developer has a known, approved method for accessing the eventual team repository.

---

## 12. Android Studio, Java, SDK, and device readiness

This section is primarily required for the developer responsible for Android. Other developers should record whether they need Android Studio for reviewing or building the Android project.

1. Install and launch the current stable Android Studio release, not a preview build.
2. Complete the setup wizard and install its recommended SDK components.
3. Create a disposable Android starter project using a **Views-based (XML layout) template** (often named `Empty Views Activity`; the exact template label can vary). In the project configuration, explicitly select **Java** as the language. Do not select a Compose-only template for this Java stack check; Compose requires Kotlin.
4. Allow Gradle sync to complete and build the starter app from Android Studio. Record the Gradle JDK selected for that project. If you also run Gradle from a terminal, record that environment separately because terminal Gradle can use `JAVA_HOME` or the `java` executable on `PATH` instead of the IDE's configured JDK.
5. Run the app on an Android Emulator or a physical Android device.
6. Record Android Studio, SDK platform/build-tools, Android Gradle Plugin, Gradle, and the Gradle JDK shown by the project/tooling.
7. Do not select an arbitrary JDK independently. Use the JDK required by the selected Android Gradle Plugin and record the actual Gradle JDK setting.

### 12.1 Ubuntu — Bash checks

After Android SDK platform-tools are installed and available in PATH:

```bash
adb version
adb devices
```

`java -version` is optional system-Java information, not the authoritative JDK check for an Android Studio project. Record the **Gradle JDK selected/shown by Android Studio for this project**. Android Studio can use its bundled JDK even when the system `java` command is missing or points to a different installation.

If `adb` is not found, locate the Android SDK's `platform-tools` directory and record whether the issue is PATH configuration or a missing SDK component. For a physical phone, unlock it, enable USB debugging, connect it, and accept the device authorization prompt. Linux may require an appropriate device rule/permission setup; record any such adjustment.

### 12.2 Windows — PowerShell checks

After Android SDK platform-tools are installed and available in PATH:

```powershell
adb version
adb devices
```

`java -version` is optional system-Java information, not the authoritative JDK check for an Android Studio project. Record the **Gradle JDK selected/shown by Android Studio for this project**. Android Studio can use its bundled JDK even when the system `java` command is missing or points to a different installation.

If `adb` is not found, check the Android SDK `platform-tools` directory and PATH. For a physical phone, unlock it, enable USB debugging, connect it, accept the device authorization prompt, and install the relevant device driver if Windows requires one.

### 12.3 Emulator or physical-device result

- **Emulator:** Confirm that it actually starts and the temporary Java app launches. Record the AVD/device profile and any virtualization issue.
- **Physical device:** Confirm that `adb devices` lists the device as authorized and the temporary Java app launches on it. Do not publish device serial numbers.
- **Both:** Record both results separately.

**Pass condition:** The Android developer can build and launch the temporary Java app on at least one usable test target. If an emulator is impractical but a physical device works, record that as the approved test method rather than marking Android readiness as failed.

---

## 13. Android-to-host network check (only where applicable)

This is a basic network reachability check, not an API integration test.

### Emulator

When using the Android Emulator, `10.0.2.2` is the emulator's special route to the host machine's loopback interface. It is not the address to use from a physical phone.

Use the temporary Vite server from Section 7:

1. Stop the Vite server if it is running.
2. Restart it so it listens on a host-accessible interface, for example:

   ```text
   npm run dev -- --host 0.0.0.0
   ```

3. Confirm the page loads in the host computer's browser.
4. Open the emulator browser and navigate to `http://10.0.2.2:5173` (or the actual port printed by Vite).
5. Confirm the page loads, then stop the temporary server.

### Physical phone

Use the development computer's LAN IPv4 address, not `10.0.2.2`. The phone and computer must be on a permitted common network, and the host service/firewall must allow the test port as narrowly as practical. Do not expose the test service to the public internet.

**Pass condition:** The selected test device can load the temporary host page. This does not prove that the future Android app can call the backend; that later integration test belongs to implementation.

---

## 14. Team comparison and decision record

After each developer has filled in the individual record, compare:

| Topic | Finding | Decision / next action | Owner | Evidence reference |
|---|---|---|---|---|
| Actual OS mix | | | | |
| Node candidate on all machines | | | | |
| One exact Node version tested by all three? | | | | |
| Version manager differences and `.nvmrc` behavior | | | | |
| Vite compatibility | | | | |
| Express compatibility | | | | |
| Argon2 compatibility across OSes | | | | |
| PostgreSQL server host and client arrangement | | | | |
| Git/GitHub access | | | | |
| Android device/emulator plan | | | | |
| Cross-device network test | | | | |
| Remaining blockers | | | | |

A single machine's failure does not prove the whole stack is incompatible. First determine whether the issue is a version mismatch, native binary, missing OS dependency, PATH/configuration problem, permissions, firewall/networking, hardware resource limit, or a documented platform limitation.

---

## 15. M3 exit criteria

M3 may use the overall progress status **Verified** only when the following evidence exists and another team member has reviewed it. Until then, use the matching TD-019 progress status defined in Section 2:

- [ ] All three developer machine records are complete.
- [ ] The actual OS, architecture, RAM, and free-space information are known for each machine.
- [ ] Node/npm versions and version-manager behavior are recorded for each machine.
- [ ] The same Node candidate has been evaluated consistently across the three machines; the team has documented the selected version or the remaining reason it cannot yet be selected.
- [ ] React/Vite install, browser startup, and production build have been tested on machines that need the web toolchain.
- [ ] Express 5 has been installed and smoke-tested under the candidate Node version on the backend machine, and any relevant cross-platform differences have been assessed.
- [ ] Argon2 install and dummy hash/verify behavior have been tested on the backend machine and on at least one machine for each supported OS; test all three where practical.
- [ ] PostgreSQL client readiness is recorded on each relevant machine, and the intended server host has passed a local connection test or has a documented blocker.
- [ ] Git is installed and configured on all three machines.
- [ ] Android Studio and a temporary Java app build/run are verified on the Android developer's selected test machine.
- [ ] Emulator-to-host or physical-device network reachability is checked where applicable, or documented as deferred with a reason.
- [ ] Failed, blocked, and not-applicable results have explanations and owners.
- [ ] Another team member has reviewed the evidence before the team marks the checks Verified.

M3 does not approve the final database schema, API contract, authentication approach, additional libraries, clearance rules, institutional workflow, or production code. Those remain governed by the baseline and later milestones.

---

## 16. Result log — copy one per developer

| Item | Test result (`Not run` / `Pass` / `Fail` / `Blocked` / `Not applicable`) | Evidence basis (`Reported` / `Run output recorded` / `Reviewed`) and sanitized evidence reference | Notes / blocker |
|---|---|---|---|
| OS/hardware | | | |
| Node.js/npm/version manager | | | |
| React/Vite | | | |
| Express 5 | | | |
| Argon2 | | | |
| PostgreSQL client/server | | | |
| Git/GitHub method | | | |
| Android Studio/SDK/Java | | | |
| Emulator or physical device | | | |
| Device-to-host network | | | |

**Completed by:** ____________________  
**Reviewed by:** ____________________  
**Date:** ____________________  
**Overall M3 progress status (TD-019):** Suggested / In Progress / Implemented / Verified / Blocked  
**Evidence reviewed by:** ____________________  
**Evidence review date:** ____________________

---

## 17. Technical references

- Microsoft Learn, **about_Parsing — Windows PowerShell 5.1**: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parsing?view=powershell-5.1 — explains how Windows PowerShell passes quoted arguments to native programs.
- Microsoft Learn, **about_Parsing — PowerShell 7.4**: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_parsing?view=powershell-7.4 — documents the native-command argument-passing change introduced in PowerShell 7.3.
- Android Developers, **Create a project**: https://developer.android.com/studio/projects/create-project — describes project templates and the language setting; it states that Java is supported, Kotlin is recommended, and Kotlin is required for Jetpack Compose. Page last updated 2026-09-25.
- Android Developers, **Java versions in Android builds**: https://developer.android.com/build/jdks — explains Android Studio's bundled JetBrains Runtime (JBR), the distinction between the IDE's Gradle JDK setting and terminal Gradle's `JAVA_HOME`/`PATH` behavior, and the project JDK setting.

The project stack remains Java as previously specified by the owner. The Android template selection in this checklist exists to test that stated stack, not to recommend changing the language.

---

**Scope note:** This is an M3 environment worksheet only. It does not authorize production coding by an AI assistant, alter the project owner's responsibility for approving decisions, or replace the team's own implementation and understanding. The team writes and maintains the application; this checklist exists to make the development environment and its evidence reproducible.

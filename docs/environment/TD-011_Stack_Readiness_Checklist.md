# TD-011 — Stack Readiness Checklist

**Project:** College Digital Clearance Management System  
**Baseline:** Requirements Baseline 0.1  
**Prepared:** 4 November 2026  
**Status:** Working worksheet — no machine has been verified by this document  
**Purpose:** Evaluate whether the owner-established technology stack can be installed and run consistently on the team's actual Ubuntu and Windows machines before implementation begins.

> **Important:** This is a readiness test, not an implementation milestone. Do not create the actual project database schema, API, authentication flow, or clearance features during this check. Use temporary test projects and fictional test values only. Do not mark a result Verified until the named test has actually passed on the relevant machine.

---

## 1. What this milestone is checking

The project baseline establishes these technologies and responsibilities:

| Layer | Established choice | What this check must prove |
|---|---|---|
| Student client | Android, Java, Android Studio | Android Studio can create, build, and run a small Java app. |
| Staff/admin client | React with Vite | The team can create, run, and build a temporary React starter. |
| Backend | Node.js with Express | Node and npm work consistently; the selected Node version meets the declared package requirements. |
| Database | PostgreSQL | The server and command-line client install, start, and connect locally. No project schema is created. |
| Password hashing | Argon2id using the Node.js `argon2` package in the backend | The package installs and can hash and verify a dummy password on each applicable machine. |
| Communication | REST using JSON | No API contract is created here. Basic host-to-emulator network reachability is checked using the temporary Vite development server. |
| Version control | Git hosted on GitHub | Git is installed and can identify the developer. Repository workflow is verified later, after the team creates the repository. |

The owner-established requirements are recorded in TD-001 through TD-011. TD-011 remains **Not yet performed** until the evidence in this worksheet has been collected.

## 2. Current compatibility baseline (checked 4 November 2026)

These are compatibility facts from upstream documentation. They are not proof that the stack works on the team's machines.

| Component | Upstream fact | Working candidate for the team |
|---|---|---|
| Node.js | Node 26 is Active LTS; Node 24 is Maintenance LTS. | **Node.js 26 LTS** is the initial candidate. All three developers should use the same exact 26.x patch release after the team confirms it works. |
| Vite | Current Vite guide states Node.js 20.19+ or 22.12+; some templates may require a higher version. | Node 26 meets the documented minimum. Confirm the selected React template installs, starts, and builds. |
| Express | Express 5 lists Node.js 18 as its minimum. | Node 26 exceeds the stated minimum. The actual Express package will be installed and tested when backend setup begins. |
| `node-argon2` | The package README states Node.js >=22.0.0. Prebuilt binaries are tested on Ubuntu 22.04 x64 and Windows Server 2022 x64, among other platforms. | Node 26 meets the stated Node minimum. The team's precise Ubuntu release, Windows edition, CPU architecture, and binary installation must still be tested. |
| PostgreSQL | PostgreSQL 18.6 is the current minor release in major version 18; major version 18 is supported through 14 November 2030. | PostgreSQL 18.x. Record the exact installed minor version on each machine. |
| Android Studio | Current official system requirements list 16 GB RAM as the minimum for Studio plus Emulator and 32 GB as recommended for Windows and Linux. Virtualization support is required for the emulator. | Install the current stable Android Studio release. Use a physical Android device if a developer's machine cannot run the emulator adequately. |
| Argon2id parameters | OWASP lists a minimum configuration of 19 MiB memory, 2 iterations, and parallelism 1, and also lists alternative equal-strength configurations. It advises benchmarking the selected parameters. | Do not lock the project's final parameters during this installation check. Benchmark on the team's target environment before recording the final choice for NFR-003. |
| Android Emulator networking | `10.0.2.2` is the emulator's special alias to the development machine's loopback interface. | Use `10.0.2.2` from an emulator to reach a host service bound on the development machine. A physical phone can use a trusted LAN route or ADB reverse forwarding. The current project pilot has tested ADB reverse to keep the backend bound to loopback. |

### Why Node.js 26 is the candidate, not yet a final decision

Node.js 26 is Active LTS as of the check date, and the documented minimum versions for current Vite, Express 5, and `node-argon2` are lower than Node 26. That makes 26 a reasonable starting candidate. It does **not** establish that every native dependency, Android tool, or future project package has been tested with it. If a required package fails or a reproducibility issue appears, document the evidence and reassess before changing the team baseline.

### Why the Android emulator is not a pass/fail requirement for every machine

Android Studio can also deploy to a physical Android device. The official requirements distinguish Studio alone from Studio plus Emulator. A machine that can run Android Studio but not a usable emulator may still participate using a physical device. Record the actual capability and do not label the entire Android toolchain incompatible solely because an emulator is too demanding.

---

## 3. Machine profile — complete one copy per developer

Duplicate this section three times. The baseline expects one Ubuntu development environment for the project owner and Windows environments for the other two developers (TD-009). Record actual details; do not assume all Windows machines are identical.

### Developer / machine record

| Field | Record |
|---|---|
| Developer label (Dev 1 / Dev 2 / Dev 3) |  |
| Date checked |  |
| Operating system and edition |  |
| OS version/build |  |
| CPU model |  |
| CPU architecture (x64 / ARM64 / other) |  |
| Installed RAM |  |
| Free storage on development drive |  |
| Virtualization available and enabled? |  |
| Android test method (emulator / physical device / both) |  |
| Physical Android device model and Android version, if used |  |

**Record status:** Not started / In progress / Blocked / Verified  
**Evidence location:** (screenshot, command output, brief note, or issue reference)  
**Blockers / notes:**

---

## 4. Per-machine checklist

For each item, record **Pass**, **Fail**, **Blocked**, or **Not applicable**, plus evidence. A command's purpose is explained so the developer knows what is being checked; the command is not itself the learning outcome.

### A. Operating system and hardware

- [ ] Record the exact OS version, edition, and CPU architecture.
- [ ] Record RAM and free disk space.
- [ ] Confirm the machine meets the relevant Android Studio requirements for the chosen test method.
- [ ] If using an emulator, confirm CPU virtualization is supported and enabled in firmware/BIOS and that the emulator starts.
- [ ] If the emulator is not practical, identify and test a physical Android device instead.

**Pass condition:** The machine can run the development tools needed for its assigned responsibilities, or a documented alternative (such as a physical Android device) is available.

### B. Node.js and npm

**Candidate:** Node.js 26 LTS, with the same exact patch release across all three developers after the team agrees.

Run these in a terminal (Ubuntu) or PowerShell (Windows):

| Command | What it tells you |
|---|---|
| `node --version` | The installed Node.js version. |
| `npm --version` | The npm package-manager version bundled with or selected for Node. |
| `node -p "process.platform + ' ' + process.arch"` | The platform and CPU architecture Node is actually using. |

- [ ] Node.js installs successfully.
- [ ] The reported Node major version is 26 on all three machines, unless a documented compatibility finding changes the team decision.
- [ ] The exact Node patch version is recorded for each developer.
- [ ] The team agrees on one exact Node version and a repeatable installation approach.
- [ ] npm runs without permission or path errors.

**Pass condition:** All three machines run the same agreed Node version and npm successfully. Do not rely on the phrase “Node is installed”; record the actual output.

### C. React + Vite temporary starter

This is a disposable test project, not the actual clearance-system web app.

1. Create a temporary Vite project using the React template. The official Vite guide provides the `npm create vite@latest` flow.
2. Install its dependencies.
3. Start its development server and open the local address shown in the terminal.
4. Confirm the default page loads in a browser.
5. Run the production build and confirm it completes without errors.
6. Keep the generated test project outside the future project repository, or delete it after evidence is recorded.

Suggested setup command:

```text
npm create vite@latest clearance-web-check -- --template react
```

After the project is created, enter its folder, install dependencies, and use the scripts shown in its generated package manifest. In a default Vite starter, the development and build scripts are commonly `npm run dev` and `npm run build`; read the actual manifest rather than assuming it.

- [ ] Temporary React/Vite starter created.
- [ ] Dependencies installed without errors.
- [ ] Development server starts.
- [ ] Default page opens in the local browser.
- [ ] Production build completes.
- [ ] Exact Vite and React versions are recorded from the temporary project's package manifest/lockfile.

**Pass condition:** A clean temporary React/Vite starter installs, runs, and builds on this machine.

### D. Node.js `argon2` package — native dependency check

This is an important cross-platform test. The package includes native components, so successful Node installation does not prove that the Argon2 package will install correctly.

1. Use a disposable Node test folder, not the actual backend repository.
2. Initialize the temporary folder as a small npm project.
3. Install the `argon2` package.
4. Open the Node.js interactive prompt and use the package to hash a clearly fictional test password.
5. Verify that the correct dummy password returns a match and a different dummy password does not.
6. Record the package version and whether a prebuilt binary installed or a source build was required.
7. Delete the temporary test folder after recording the result.

**Do not use a real password, a team member's password, or any credential that will later be used by the application.** Do not put test passwords or password hashes in project documentation, screenshots, shell history, or logs.

- [ ] `argon2` installs successfully on this machine.
- [ ] Hash generation succeeds.
- [ ] Verification of the matching dummy password succeeds.
- [ ] Verification of a non-matching dummy password fails as expected.
- [ ] Package version and installation outcome are recorded.
- [ ] No real credential or hash was recorded or committed.

**Pass condition:** The package installs and its hash/verify operations work on the actual machine. An installation failure is a blocker to investigate, not a reason to silently replace Argon2id.

### E. PostgreSQL local readiness

**Candidate:** PostgreSQL 18.x; record the exact minor version. The backend developer should verify a local server. Other developers may use a client to connect to an agreed development database later; they do not automatically need a separate local server.

- [ ] If this machine will host the development database, install PostgreSQL server and client tools for the developer's OS.
- [ ] If this machine will only connect to a shared development database, install/verify the required client tools and record that the shared connection test is deferred until the team environment exists.
- [ ] If hosting locally, confirm the PostgreSQL service starts.
- [ ] Record the version reported by the `psql` client.
- [ ] If hosting locally, connect to the local PostgreSQL server using a local development account.
- [ ] Confirm the applicable connection succeeds and disconnect cleanly.
- [ ] Record how the server is started and stopped on this OS, if locally hosted.
- [ ] Record any OS-specific setup differences for the team guide.

Useful version check:

```text
psql --version
```

**Do not create the clearance database or any project tables during TD-011.** This test only verifies that the database software installs and accepts a local connection. Database design belongs after requirements validation.

**Pass condition:** The backend developer can run PostgreSQL 18.x locally and connect to it, or the team has documented the shared development database arrangement and its access test is scheduled for the environment milestone. Record the actual server version separately if it differs from the client version.

### F. Git

- [ ] Git is installed.
- [ ] `git --version` reports a version.
- [ ] The developer has configured a commit name and email appropriate for project work.
- [ ] The developer can access their GitHub account.

Do not create the shared repository until the team agrees on repository layout and workflow (TD-R04/TD-R05 remain suggestions, not established decisions).

**Pass condition:** Git works locally and the developer can authenticate to GitHub by an approved method. Never put a GitHub token or password in the checklist.

### G. Android Studio + Java + Android SDK

1. Install the current **stable** Android Studio release, not a preview/canary release.
2. Complete its setup wizard and install the recommended SDK components.
3. Create a new temporary Android project using a Java-capable starter/template.
4. Build and run the starter on an emulator or a physical Android device.
5. Record Android Studio, Android SDK, Android Gradle Plugin/Gradle, and project JDK details shown by the tooling.
6. Do not independently select an arbitrary Java version. Use the JDK recommended/required by the selected Android Gradle Plugin and record the actual Gradle JDK setting.

- [ ] Android Studio installs and launches.
- [ ] SDK setup completes.
- [ ] A temporary Java Android project is created.
- [ ] Gradle sync/build succeeds.
- [ ] The app launches on an emulator or physical device.
- [ ] Android Studio, SDK, Gradle, and JDK details are recorded.
- [ ] The chosen emulator/device method is available to the developer.

**Pass condition:** The developer can build and launch a minimal Java Android app on at least one supported test target.

### H. Android Emulator → host-machine connectivity (`10.0.2.2`)

This test applies when the developer uses the Android Emulator. `10.0.2.2` is a special emulator address that routes to the host computer's loopback interface; it is not a general LAN address and should not be used as the server address for a physical phone.

Use the temporary Vite starter from Section C as a temporary host service:

1. Stop the Vite server if it is already running.
2. Restart it so it listens on all host network interfaces, using the Vite CLI's host option (for example, `npm run dev -- --host 0.0.0.0`).
3. Confirm the host browser can still open the Vite page.
4. Start the Android Emulator.
5. Open the emulator's browser and navigate to `http://10.0.2.2:5173` (use the actual port printed by Vite if it differs).
6. Confirm the temporary Vite page loads inside the emulator.
7. Stop the temporary server when the test is complete.

- [ ] Vite is listening on a host-accessible interface.
- [ ] Host browser can open the temporary page.
- [ ] Android Emulator browser can open the page through `10.0.2.2`.
- [ ] Any firewall rule or network adjustment is recorded and kept as narrow as practical.

**Pass condition:** The emulator can reach the temporary host service. This proves basic emulator-to-host reachability; it does **not** yet prove that the actual Android app can call the future backend. That application integration test happens later.

**Physical-device alternative:** Use the development machine's local network IPv4 address, ensure the phone and computer are on a permitted common network, bind the host service to a network-accessible interface, and allow the port through the host firewall as appropriate. Do not use `10.0.2.2` on a physical phone.

---

## 5. Team-wide comparison table

Complete after every developer has filled in their machine profile and tests.

| Check | Dev 1 — Ubuntu | Dev 2 — Windows | Dev 3 — Windows | Team result / action |
|---|---|---|---|---|
| OS and hardware profile recorded |  |  |  |  |
| Node.js exact version |  |  |  |  |
| npm version |  |  |  |  |
| React/Vite starter installs, runs, builds |  |  |  |  |
| Argon2 install and hash/verify |  |  |  |  |
| PostgreSQL 18.x local/shared connection (or documented N/A) |  |  |  |  |
| Git/GitHub access |  |  |  |  |
| Android Studio and Java app build |  |  |  |  |
| Emulator or physical device works |  |  |  |  |
| Emulator → host connectivity (if applicable) |  |  |  |  |

## 6. How to record a result honestly

Use these labels consistently:

- **Suggested:** A candidate or procedure has been proposed but not tried.
- **In progress:** Someone is currently performing the check.
- **Verified:** The check was run on the named machine and evidence shows it passed.
- **Blocked:** The check could not be completed; state why and what decision or fix is needed.
- **Not applicable:** The check does not apply (for example, emulator networking when the developer only uses a physical phone). Explain the alternative test.

For every failed or blocked item, record:

1. The exact step that failed.
2. OS and version, CPU architecture, and relevant software versions.
3. The error message (remove usernames, file paths containing personal information, tokens, passwords, and other secrets).
4. What was tried.
5. Whether the issue affects one machine or all three.
6. The next investigation or proposed change.

Do not mark an entire technology “incompatible” based on one unexamined error. First distinguish an installation issue, version mismatch, missing OS dependency, firewall problem, resource limitation, or actual unsupported platform.

## 7. TD-011 exit criteria

TD-011 may be marked **Completed / Verified** only when:

- [ ] All three machine profiles are recorded.
- [ ] The team has agreed on one Node.js major and exact tested version.
- [ ] React/Vite installs, runs, and builds on the developer machines that need the web toolchain.
- [ ] `argon2` installation and hash/verify behavior are tested on the backend developer's machine and at least one machine for each supported OS; preferably all three.
- [ ] PostgreSQL 18.x is installed and locally reachable on the backend developer's machine; the team has documented the intended shared development arrangement for the other developers.
- [ ] Git is available to all developers.
- [ ] The Android developer can build and run a Java app using the chosen emulator or physical device.
- [ ] Emulator-to-host connectivity is tested where an emulator is used, or the physical-device alternative is documented.
- [ ] Differences and blockers are resolved or accepted with reasons.
- [ ] Evidence and final versions are recorded in the project decision/change records.

**Important qualification:** PostgreSQL does not necessarily need to run as a local server on all three machines. The team may use one shared development database or a local server for the backend developer, but this is a team setup decision that must be documented. Do not expose a database service publicly for convenience.

Passing this checklist completes the environment/compatibility portion of TD-011. It does not complete TD-R01 (authentication choice), TD-R11 (additional tools/libraries), repository setup, requirements validation, or application integration testing.

---

## 8. Learning review — explain the result, do not only tick boxes

Each developer should be able to explain these ideas in their own words after running the checks:

1. **Runtime vs package manager:** What does Node.js execute, and what does npm manage?
2. **Dependency:** Why does the React/Vite starter need packages before it can run?
3. **Native dependency:** Why can `argon2` fail even when Node.js itself is installed correctly?
4. **Database server vs client:** What is the PostgreSQL server, and what does `psql` do?
5. **Build vs run:** What is the difference between starting the Vite development server and producing a production build?
6. **Emulator networking:** Why is `10.0.2.2` used from an emulator, and why is it not the right address for a physical phone?
7. **Compatibility vs verification:** Why does meeting a documented minimum version not prove that the complete project works on the team's machine?

A developer who can perform a procedure but cannot explain what it verifies has completed the mechanical check, not yet demonstrated understanding. Pair up and teach the concept to another developer before signing off.

---

## 9. Decisions and scope boundaries after this checklist

This worksheet does **not** decide the following:

- Whether authentication will use server-managed sessions, bearer tokens, or another documented arrangement (TD-R01).
- The final Argon2id cost parameters (NFR-003), beyond using upstream guidance and benchmarking before choosing them.
- Which additional libraries, frameworks, ORMs, routers, testing tools, or other dependencies should be introduced (TD-R11; TD-010 applies).
- The repository layout or Git branching workflow (TD-R04/TD-R05 remain suggested).
- The final database schema, API contract, clearance rules, offices, signatories, applicability rules, approval order, or rejection/resubmission behavior.
- The final institutional data set or use of real student information.

Those items remain governed by the requirements baseline and must not be silently decided by a stack installation test.

---

## 10. Primary references checked on 4 November 2026

- Node.js release schedule: https://github.com/nodejs/Release (Node 26 Active LTS; Node 24 Maintenance LTS at the check date).
- Vite Getting Started / compatibility: https://vite.dev/guide/
- Express version support: https://expressjs.com/en/support/
- `node-argon2` README: https://github.com/ranisalt/node-argon2
- PostgreSQL versioning policy: https://www.postgresql.org/support/versioning/
- Android Studio installation and system requirements: https://developer.android.com/studio/install
- Android Emulator network address space: https://developer.android.com/studio/run/emulator-networking-address
- OWASP Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

**Prepared as a working aid for Requirements Baseline 0.1. Do not edit the original baseline merely to make this worksheet appear complete. Record actual results and approved changes in the appropriate project files.**

# Set up CDCMS on Windows

These steps are written for Windows 11 using PowerShell. Windows 10 reached end of support on October 14, 2025 for most standard editions. Some LTSC editions and devices enrolled in Extended Security Updates have separate support timelines. Windows 11 is recommended for a new setup. See [Microsoft's Windows 10 lifecycle information](https://learn.microsoft.com/en-us/lifecycle/announcements/windows-10-22h2-end-of-support-update).

> Windows setup has not yet been checked on a teammate's computer. Please report what happens rather than assuming every Windows machine is already supported.

## 1. Install the programs

For the staff website and backend, install:

1. **Git for Windows**
2. **Node.js**
3. **PostgreSQL** and **pgAdmin**

For the Android app, also install **Android Studio** and **Java 17**. You can skip Android Studio if you only need the staff website.

The project owner's Ubuntu computer has used Node.js 26.13.0 and PostgreSQL 18.6. These are reported project-owner versions, not mandatory Windows versions. The backend and web package files currently allow Node.js `>=22 <27`. The final team-wide Node version has not been decided yet.

Open a new PowerShell window and check Git and Node:

```powershell
git --version
node --version
npm --version
```

If a command is not recognized, close and reopen PowerShell. If it is still missing, check that the program is installed and added to PATH.

## 2. Download the project

```powershell
Set-Location $HOME
git clone https://github.com/VPBOBO/college-digital-clearance-management-system.git
Set-Location "$HOME\college-digital-clearance-management-system"
```

You should see the `android`, `backend`, `web`, and `docs` folders.

## 3. Create a local database

Open **pgAdmin** and connect to your local PostgreSQL server. Open the Query Tool for the `postgres` database.

Create a project database user. Replace the example with a password you choose for your local PostgreSQL account:

```sql
CREATE ROLE cdcms_app LOGIN PASSWORD 'ChooseYourOwnDatabasePassword';
```

Then create the project database:

```sql
CREATE DATABASE cdcms_dev OWNER cdcms_app;
```

Run each statement once. If the role or database already exists, do not create another one; check the existing setup instead.

This is a local practice database. Do not connect it to a real college database or use real student information.

## 4. Configure the backend

In PowerShell:

```powershell
Set-Location "$HOME\college-digital-clearance-management-system\backend"
```

Create your private `.env` file without overwriting an existing one:

```powershell
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
} else {
    Write-Host "backend\.env already exists. It was not changed."
}
```

Open it:

```powershell
notepad .env
```

Find `DATABASE_URL` and use the PostgreSQL password you created in pgAdmin:

```dotenv
DATABASE_URL=postgres://cdcms_app:YOUR_DATABASE_PASSWORD@127.0.0.1:5432/cdcms_dev
```

For the local PostgreSQL password, use letters and numbers to keep the connection URL simple. If you use special characters such as `@`, `#`, `/`, or `:`, they must be URL-encoded in `DATABASE_URL`.

The example file already sets `SEED_PASSWORD=test123`. Keep these local settings for the normal demo:

```dotenv
HOST=127.0.0.1
ALLOW_LAN=NO
SEED_PASSWORD=test123
ALLOW_DEMO_PASSWORD_RESET=NO
```

The example file also preconfigures `ALLOW_DEV_DATABASE=YES`, `ALLOW_DEV_MIGRATIONS=YES`, and `ALLOW_DEMO_SEED=YES` for this local demo. These allow the development database connection, migrations, and demo seeding to run. The code still checks that the database host is loopback and the database name ends in `_dev`. Keep `DATABASE_URL` pointed at your own local `cdcms_dev` database. Never use a shared or real database for this project demo.

Save `.env` and close Notepad. **Never upload or commit `backend\.env`**. It contains your local database credentials.

## 5. Install packages and create the sample data

Still inside the `backend` folder, run:

```powershell
npm ci
npm run db:setup
```

This creates the database tables and fictional Sample College accounts. On a fresh database, the five sample accounts use password `test123`.

If the accounts already existed before this setup, their passwords are left unchanged. The password reset instructions are in [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

## 6. Start the backend

In the same PowerShell window:

```powershell
npm start
```

Leave this window open. Check the backend by opening this address in your browser:

<http://127.0.0.1:3000/api/health>

You should see:

```json
{"ok":true,"service":"cdcms-api"}
```

## 7. Start the staff website

Open a second PowerShell window:

```powershell
Set-Location "$HOME\college-digital-clearance-management-system\web"
npm ci
npm run dev
```

Leave that window open too. Open <http://localhost:5173> in your browser.

Sign in with `reviewer-a` or `reviewer-b`. The demo password is `test123`.

## 8. Run the Android app (optional)

1. Install Android Studio and Java 17.
2. In Android Studio, choose **Open** and select the project's `android` folder.
3. Let Gradle sync and install any SDK components Android Studio requests.
4. Start an Android emulator, or connect a physical Android phone with USB debugging or Wireless debugging enabled.
5. Run the app from Android Studio, or build it in PowerShell:

```powershell
Set-Location "$HOME\college-digital-clearance-management-system\android"
.\gradlew.bat assembleDebug
```

The debug APK is created at:

`android\app\build\outputs\apk\debug\app-debug.apk`

### Android emulator connection

The app initially shows `http://localhost:3000` in its **API server URL** field. For an Android emulator, change that field to:

```text
http://10.0.2.2:3000
```

Then sign in as `student-a` or `student-b` with password `test123`. The address `10.0.2.2` is the Android Emulator's special address for reaching the host computer's localhost service. See [Android's emulator networking guide](https://developer.android.com/studio/run/emulator-networking-address).

### Physical phone connection with ADB reverse

For a physical phone, leave the app's API server URL as:

```text
http://localhost:3000
```

ADB reverse forwards the phone's localhost port to the computer's localhost port. Android SDK **platform-tools** must be installed. The usual Windows SDK location is:

```text
%LOCALAPPDATA%\Android\Sdk\platform-tools
```

To run ADB without changing PATH, use the full path in PowerShell:

```powershell
$adb = Join-Path $env:LOCALAPPDATA "Android\Sdk\platform-tools\adb.exe"
& $adb devices
```

For wireless debugging:

1. Connect the phone and computer to the same Wi-Fi network.
2. On the phone, open **Developer options > Wireless debugging**.
3. Choose **Pair device with pairing code**. Note the IP address, pairing port, and six-digit pairing code shown on the phone.
4. In PowerShell, run the pairing command (replace the example address):

   ```powershell
   $pairingAddress = "PHONE_IP:PAIRING_PORT"
   & $adb pair $pairingAddress
   ```

5. Enter the six-digit pairing code when ADB asks for it.
6. Return to the main **Wireless debugging** screen. Note the device IP address and connection port. The connection port may be different from the pairing port.
7. Connect to the device using that address:

   ```powershell
   $device = "PHONE_IP:CONNECTION_PORT"
   & $adb connect $device
   & $adb devices
   ```

For USB debugging, connect the phone and approve the computer's debugging prompt.

After the phone appears in the list, copy its device serial and run:

```powershell
$device = "YOUR_DEVICE_SERIAL"
& $adb -s $device reverse tcp:3000 tcp:3000
& $adb -s $device reverse --list
```

The reverse list should show `tcp:3000 tcp:3000`. Keep the backend running on the computer. If the phone disconnects or sleeps, check `adb devices` and set up the reverse mapping again.

If your Android SDK is installed in a different folder, find its location in Android Studio under **Settings > Languages & Frameworks > Android SDK**. You can add that SDK's `platform-tools` folder to your Windows user PATH so that `adb` works without the full path. See [Android's environment-variable guide](https://developer.android.com/tools/variables).

## 9. Stop the project

In each PowerShell window running the backend or website, press **Ctrl+C**.

## Important reminders

- The sample school, accounts, students, offices, and requirements are fictional.
- `test123` is a public local-demo password only. Never use it on a hosted server, in production, or for a real account.
- Keep `HOST=127.0.0.1` and `ALLOW_LAN=NO` for local use.
- Do not share `.env`, passwords, tokens, or real student information.
- Do not run integration tests against `cdcms_dev`; the integration test database is separate and is reset by the test suite.

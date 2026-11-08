# Troubleshooting

If a step fails, copy the error message for the team. Do not share your `.env` file, passwords, tokens, or database connection string.

## PowerShell does not recognize `node`, `npm`, or `git`

Install the missing program, close PowerShell, and open a new window. Check again:

```powershell
git --version
node --version
npm --version
```

## PostgreSQL connection error

1. Open pgAdmin and make sure your local PostgreSQL server is running.
2. Check that the `cdcms_app` role and `cdcms_dev` database exist.
3. Open `backend\.env` and check the `DATABASE_URL` host, database name, username, and local password.
4. The database should be `cdcms_dev` and the host should be `127.0.0.1` for the local setup.
5. Do not paste the full URL or password into chat or GitHub.

## The website opens, but sign-in fails

1. Make sure the backend PowerShell window is still running.
2. Open <http://127.0.0.1:3000/api/health>. It should return `ok: true`.
3. Open the website at <http://localhost:5173>.
4. Check the username and use the local demo password `test123` for newly created sample accounts.
5. Existing accounts keep their old passwords when `npm run db:setup` is run again. Setup does not overwrite existing passwords.

### Reset the five demo accounts

Only use this for your own local demo database. First check that `backend\.env` has `DATABASE_URL` pointing to the loopback `cdcms_dev` database, `NODE_ENV=development`, `HOST=127.0.0.1`, `ALLOW_LAN=NO`, and `SEED_PASSWORD=test123`.

In PowerShell, from the `backend` folder, run:

```powershell
$env:ALLOW_DEMO_PASSWORD_RESET = "YES"
try {
    npm run db:reset-demo-passwords
}
finally {
    Remove-Item Env:ALLOW_DEMO_PASSWORD_RESET -ErrorAction SilentlyContinue
}
```

The reset utility is guarded. It refuses non-development mode, remote database hosts, databases without the `_dev` suffix, non-loopback application hosts, and enabled LAN access. It updates only the five named fictional demo accounts and invalidates their existing sessions. It does not reset the database or erase assignments, decisions, or history.

If the command fails, do not remove the safety checks or edit password hashes directly. Ask the project owner for help.

## `npm ci` fails while installing `argon2`

First try `npm ci` again after checking your internet connection and Node.js version. The `argon2` maintainers currently list a prebuilt binary for Windows Server 2022 (x86-64). This does not confirm installation on every Windows 10 or Windows 11 computer. Windows ARM64 is not listed in that prebuilt-binary table. The project still needs a real Windows teammate test. See the [published platform list](https://www.npmjs.com/package/argon2?activeTab=versions).

If npm reports that it must compile `argon2` from source and cannot find a C++ build environment, install Visual Studio Build Tools with the **Desktop development with C++** workload, then retry. `node-gyp` also requires a supported Python installation. See the [node-argon2 installation notes](https://github.com/ranisalt/node-argon2#before-installing) and [node-gyp Windows instructions](https://github.com/nodejs/node-gyp#on-windows).

Windows on ARM has not been tested for this project, and Windows ARM64 is not listed among the current prebuilt binaries. If you use an ARM computer, do not change Node.js architecture or package versions as a workaround without checking with the project owner first.

## `adb` is not recognized

Install Android SDK **platform-tools** through Android Studio. The usual SDK folder is `%LOCALAPPDATA%\Android\Sdk`, and `adb.exe` is usually inside its `platform-tools` folder.

You can call it with the full path from PowerShell:

```powershell
$adb = Join-Path $env:LOCALAPPDATA "Android\Sdk\platform-tools\adb.exe"
& $adb --version
```

If the SDK is in a different location, check **Android Studio > Settings > Languages & Frameworks > Android SDK**. You can also add the `platform-tools` folder to your Windows user PATH. See [Android's environment-variable guide](https://developer.android.com/tools/variables).

## Android app cannot connect to the backend

- Make sure the backend is running and that <http://127.0.0.1:3000/api/health> works on the computer.
- **Android emulator:** in the app's API server URL field, enter `http://10.0.2.2:3000`.
- **Physical phone with ADB reverse:** use `http://localhost:3000` in the app and run `adb reverse tcp:3000 tcp:3000` after connecting the device.
- Do not enable LAN access just to connect the emulator or a phone using ADB reverse.

The Android Emulator uses `10.0.2.2` as the special address for reaching the host computer's localhost. See [Android's emulator networking guide](https://developer.android.com/studio/run/emulator-networking-address).

## Port 3000 or 5173 is already in use

Another program or project copy may already be using the port. Stop the other backend or Vite terminal with `Ctrl+C`, then try again.

## Still stuck?

Send the team the command you ran and the error text. Remove usernames, private folders, passwords, tokens, database URLs, and any personal/student information first.

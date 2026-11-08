# Student Android App

This is the sample student app. It lets a student sign in and view their own fictional clearance items and progress.

For the first setup and build steps, see the repository's [Windows setup guide](../SETUP-WINDOWS.md).

The project uses Java and the Gradle Wrapper. From this folder on Windows, build the debug app with:

```powershell
.\gradlew.bat assembleDebug
```

## Backend address

The app has an **API server URL** field on its sign-in screen:

- Android emulator: `http://10.0.2.2:3000`
- Physical phone using ADB reverse: `http://localhost:3000`

For an emulator, change the field to `http://10.0.2.2:3000` before signing in. For a physical phone, connect ADB and run `adb reverse tcp:3000 tcp:3000`. The full Windows instructions are in [SETUP-WINDOWS.md](../SETUP-WINDOWS.md).

Use `student-a` or `student-b` with the local demo password `test123`. This is for local fictional data only.

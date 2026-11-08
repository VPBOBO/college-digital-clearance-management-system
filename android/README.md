# Android Student App

Native Java Android application for the first-slice student view. It uses the backend's server-managed HttpOnly session cookie and displays only the signed-in student's own clearance records.

## Build

The standard Gradle Wrapper is included in this project. The wrapper targets Gradle 8.9 and pins the distribution SHA-256 in `gradle/wrapper/gradle-wrapper.properties`. The wrapper JAR in the uploaded source archive matches the Gradle-published Gradle 8.9 wrapper JAR checksum. Reference: <https://gradle.org/release-checksums/>.

On the owner's Ubuntu setup, use Java 17:

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH="$JAVA_HOME/bin:$PATH"
./gradlew assembleDebug
```

The owner previously reported a successful debug build and installation on a physical Android phone. The expected APK path is `app/build/outputs/apk/debug/app-debug.apk`.

## API address

- Physical phone using ADB reverse: `http://localhost:3000` (tested path).
- Android emulator: enter `http://10.0.2.2:3000`.

### Physical phone setup using ADB reverse

Keep the backend bound to `127.0.0.1:3000`; this method does not require `HOST=0.0.0.0` or `ALLOW_LAN=YES`.

On Ubuntu, list connected devices:

```bash
ADB="$HOME/Android/Sdk/platform-tools/adb"
"$ADB" devices
```

If the wireless-debugging device is not listed, use the current phone IP and port shown under Android Developer Options > Wireless debugging:

```bash
"$ADB" connect PHONE_IP:ADB_PORT
```

The port can change after the phone sleeps or reconnects. Copy the current serial from `adb devices`, then run:

```bash
DEVICE="PHONE_IP:ADB_PORT"
"$ADB" -s "$DEVICE" reverse tcp:3000 tcp:3000
"$ADB" -s "$DEVICE" reverse --list
```

Expected mapping includes `tcp:3000 tcp:3000`. Install/update the debug APK if needed:

```bash
"$ADB" -s "$DEVICE" install -r app/build/outputs/apk/debug/app-debug.apk
```

The app's default API URL is `http://localhost:3000`. To check the forwarded connection from the phone, open `http://localhost:3000/api/health` in phone Chrome; the expected JSON is `{"ok":true,"service":"cdcms-api"}`.

## Network configuration

The development network-security configuration permits cleartext to `localhost` (ADB reverse physical phone path) and `10.0.2.2` (emulator bridge). This is for local testing only. Do not use this cleartext configuration for a public deployment; configure HTTPS and review the production network policy first.

The Android application ID `com.samplecollege.cdcms` remains provisional under TD-R14.

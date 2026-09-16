# Publishing Wiretalk SDKs

How to publish or install each platform package from this repo.

## Android (Maven)

### Maven Local (development)

```bash
cd sdk/android
./gradlew :wiretalk-android:publishReleasePublicationToMavenLocal
```

Then in your app `settings.gradle.kts`:

```kotlin
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        mavenLocal()
    }
}
```

```kotlin
// app/build.gradle.kts
dependencies {
    implementation("tech.wiretalk:wiretalk-android:1.0.0")
}
```

### GitHub Packages (optional)

Set env vars and add repository to `wiretalk-android/build.gradle.kts`:

```bash
export GITHUB_ACTOR=your-github-username
export GITHUB_TOKEN=ghp_...
```

```kotlin
repositories {
    maven {
        name = "GitHubPackages"
        url = uri("https://maven.pkg.github.com/anilkumar1995-star/wiretalk-sdk")
        credentials {
            username = System.getenv("GITHUB_ACTOR")
            password = System.getenv("GITHUB_TOKEN")
        }
    }
}
```

Run: `./gradlew :wiretalk-android:publishReleasePublicationToGitHubPackagesRepository`

### Demo app

```bash
cd sdk/android
./gradlew :demo-app:assembleDebug
```

Edit `demo-app/.../MainActivity.kt` — set `WIDGET_KEY` and add `app:com.wiretalk.demo` to Allowed Domains.

---

## iOS (Swift Package Manager)

### Local / Git dependency

**Xcode:** File → Add Package Dependencies → folder `sdk/ios/WiretalkSDK`

**Package.swift:**

```swift
.package(path: "../sdk/ios/WiretalkSDK")
// or
.package(url: "https://github.com/anilkumar1995-star/wiretalk-sdk.git", from: "1.0.0")
```

Target dependency: `.product(name: "WiretalkSDK", package: "WiretalkSDK")`

### Demo

See [`ios/DemoApp/README.md`](ios/DemoApp/README.md).

---

## React Native (npm)

### Install from repo (no publish)

```bash
npm install file:./sdk/react-native
npm install react-native-webview
```

### Publish to npm

```bash
cd sdk/react-native
npm login
npm publish --access public
```

Scoped package: `@wiretalk/react-native-chat`

Dry run: `npm pack` (creates `.tgz` to inspect)

### Demo

```bash
cd sdk/react-native/example
npm install
# Copy App.tsx into your RN app entry, set WIDGET_KEY
```

---

## Flutter

### Local path dependency

```yaml
dependencies:
  wiretalk_chat:
    path: ../sdk/flutter
  webview_flutter: ^4.10.0
```

Or copy `lib/wiretalk_chat.dart` into your project.

### pub.dev (optional)

Set `publish_to:` in `pubspec.yaml` and run:

```bash
cd sdk/flutter
flutter pub publish
```

### Demo

```bash
cd sdk/flutter/example
flutter pub get
flutter run
```

---

## Version bumps

| Platform | File |
|----------|------|
| Android | `sdk/android/gradle.properties` → `wiretalk.version` |
| npm | `sdk/react-native/package.json` → `version` |
| Flutter | `sdk/flutter/pubspec.yaml` → `version` |
| iOS SPM | Git tag on repo (e.g. `sdk-v1.0.0`) |

Keep all platforms on the same semver when releasing together.

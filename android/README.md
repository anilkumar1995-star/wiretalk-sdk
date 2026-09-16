# Wiretalk Android SDK

## Install

### Option A — Copy module

Copy `wiretalk-android` into your project:

```gradle
// settings.gradle.kts
include(":wiretalk-android")
project(":wiretalk-android").projectDir = file("path/to/sdk/android/wiretalk-android")

// app/build.gradle.kts
dependencies {
    implementation(project(":wiretalk-android"))
}
```

### Option B — Maven Local

```bash
cd sdk/android
./gradlew :wiretalk-android:publishReleasePublicationToMavenLocal
```

```kotlin
dependencies {
    implementation("tech.wiretalk:wiretalk-android:1.0.0")
}
```

See [../PUBLISHING.md](../PUBLISHING.md) for GitHub Packages / Maven Central.

## Demo app

```bash
cd sdk/android
./gradlew :demo-app:assembleDebug
```

Edit `demo-app/src/main/java/com/wiretalk/demo/MainActivity.kt` — set `WIDGET_KEY`.

## Setup

1. Allowed Domains → `app:com.yourcompany.app`
2. Declare permissions (see `AndroidManifest.xml` in module — merge into your app)

## Usage

### Full-screen activity

```kotlin
WiretalkChatActivity.launch(
    context,
    WiretalkConfig(
        baseUrl = "https://wiretalk.tech",
        widgetKey = "wk_your_key",
        appId = "com.yourcompany.app",
        visitorName = user.name,
        visitorEmail = user.email,
    ),
)
```

### Embedded view

```kotlin
val chat = findViewById<WiretalkChatView>(R.id.wiretalk_chat)
chat.setBridgeListener { event ->
    when (event.type) {
        "unread:count" -> updateBadge(event.unreadCount)
        "message:received" -> showLocalNotification(event.messageBody)
    }
}
chat.load(config)
```

### Bridge commands

```kotlin
chat.openChat()
chat.updateVisitor(name = "Jane", email = "jane@example.com")
```

See [../BRIDGE.md](../BRIDGE.md).

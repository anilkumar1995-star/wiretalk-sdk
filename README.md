# Wiretalk Native Mobile SDK

Public SDK repository: [github.com/anilkumar1995-star/wiretalk-sdk](https://github.com/anilkumar1995-star/wiretalk-sdk)

```bash
git clone https://github.com/anilkumar1995-star/wiretalk-sdk.git
```

Official WebView-based SDKs for embedding Wiretalk live chat in **Android**, **iOS**, **React Native**, and **Flutter** apps.

The SDK wraps the same `/popout/{widgetKey}` UI your website uses, with a typed JavaScript bridge for unread badges, push hooks, and visitor identity.

## Quick start

1. **Widget Settings → Allowed Domains** — add `app:com.yourcompany.app`
2. Copy your **widget key** (`wk_…`)
3. Add the platform SDK (see folders below)
4. Open chat:

```kotlin
// Android
WiretalkChatActivity.launch(context, WiretalkConfig(
    baseUrl = "https://wiretalk.tech",
    widgetKey = "wk_…",
    appId = "com.yourcompany.app",
))
```

```swift
// iOS
let vc = WiretalkChatViewController(config: WiretalkConfig(
    baseUrl: URL(string: "https://wiretalk.tech")!,
    widgetKey: "wk_…",
    appId: "com.yourcompany.app"
))
present(vc, animated: true)
```

## Packages

| Platform | Path | Install |
|----------|------|---------|
| Android | [`android/`](android/) | Maven `tech.wiretalk:wiretalk-android` or copy module |
| iOS | [`ios/`](ios/) | Swift Package Manager — `Package.swift` |
| React Native | [`react-native/`](react-native/) | `npm install @wiretalk/react-native-chat` |
| Flutter | [`flutter/`](flutter/) | Local path or copy `lib/wiretalk_chat.dart` |
| Bridge spec | [`BRIDGE.md`](BRIDGE.md) | Shared event/command contract |
| Publishing | [`PUBLISHING.md`](PUBLISHING.md) | Maven, npm, SPM, pub.dev |

## Demo apps

| Platform | Path |
|----------|------|
| Android | [`android/demo-app/`](android/demo-app/) |
| iOS | [`ios/DemoApp/`](ios/DemoApp/) |
| React Native | [`react-native/example/`](react-native/example/) |
| Flutter | [`flutter/example/`](flutter/example/) |

Replace `wk_REPLACE_ME` and add `app:com.wiretalk.demo` to Allowed Domains before running demos.

## Bridge events (widget → app)

| Event | Use |
|-------|-----|
| `widget:ready` | Persist `visitor_uid` |
| `unread:count` | Tab badge |
| `message:received` | Local notification when app backgrounded |
| `widget:state` | Track open/closed |

## Bridge commands (app → widget)

| Command | Use |
|---------|-----|
| `widget:open` / `close` / `toggle` | Control chat UI |
| `visitor:update` | Sync logged-in user name/email/phone |
| `storage:set` | Persist `wiretalk_visitor_uid` securely |

See [BRIDGE.md](BRIDGE.md) for full JSON schemas.

## Server-side API

For CRM/backend integrations (not in-app UI), use the [Public REST API](/docs/api) with organization API keys.

## Requirements

- HTTPS Wiretalk instance
- Bundle ID on allowlist (`app:…`)
- WebView: JavaScript + DOM storage enabled
- Voice/video: camera/mic permissions + TURN (see docs)

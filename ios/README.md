# Wiretalk iOS SDK

Swift Package for embedding Wiretalk chat in iOS apps.

## Install (Xcode)

1. **File → Add Package Dependencies**
2. Git URL: `https://github.com/anilkumar1995-star/wiretalk-sdk.git` (folder `ios/WiretalkSDK`)
3. Or local path: `ios/WiretalkSDK`
4. Or add to `Package.swift`:

```swift
.package(url: "https://github.com/anilkumar1995-star/wiretalk-sdk.git", from: "1.0.0")
```

## Setup

1. Allowed Domains → `app:com.yourcompany.app`
2. `Info.plist`: `NSCameraUsageDescription`, `NSMicrophoneUsageDescription`

## Usage

```swift
import WiretalkSDK

let config = WiretalkConfig(
    baseURL: URL(string: "https://wiretalk.tech")!,
    widgetKey: "wk_your_key",
    appId: "com.yourcompany.app",
    visitorName: user.name,
    visitorEmail: user.email
)

let chat = WiretalkChatViewController(config: config)
chat.onBridgeEvent = { event in
    switch event.type {
    case "unread:count":
        UIApplication.shared.applicationIconBadgeNumber = event.unreadCount
    default:
        break
    }
}

present(chat, animated: true)
```

See [../BRIDGE.md](../BRIDGE.md).

## Demo

Copy [`DemoApp/DemoApp.swift`](DemoApp/DemoApp.swift) into a new Xcode SwiftUI project. See [DemoApp/README.md](DemoApp/README.md).

# Wiretalk iOS Demo App

Minimal SwiftUI reference app for the Wiretalk SDK.

## Setup

1. Xcode → **File → New → Project → App** (SwiftUI, iOS 15+)
2. Bundle ID: `com.wiretalk.demo` — add `app:com.wiretalk.demo` to Allowed Domains
3. **File → Add Package Dependencies** → Local path: `sdk/ios/WiretalkSDK`
4. Replace `ContentView.swift` with `DemoApp.swift` from this folder
5. Set `BASE_URL`, `WIDGET_KEY` in `DemoApp.swift`
6. Add to `Info.plist`:
   - `NSCameraUsageDescription`
   - `NSMicrophoneUsageDescription`

## Run

Build and tap **Open support chat**. Unread badge updates via bridge events.

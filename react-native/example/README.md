# Wiretalk React Native — Example App

Minimal Expo / React Native app using the local SDK package.

## Setup

```bash
# From a new RN app (or copy example/ into your project)
npm install react-native-webview
npm install file:../   # sdk/react-native from repo root

# Or from repo:
cd sdk/react-native/example
npm install
```

Replace `BASE_URL`, `WIDGET_KEY`, and `APP_ID` in `App.tsx`.

Add `app:com.wiretalk.demo` to Widget Settings → Allowed Domains.

## Run

```bash
npx react-native run-android
# or
npx react-native run-ios
```

For Expo: wrap `App.tsx` in your Expo entry and ensure `react-native-webview` is installed.

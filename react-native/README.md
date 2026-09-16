# Wiretalk React Native SDK

```bash
npm install react-native-webview
npm install @wiretalk/react-native-chat
# or from repo:
npm install file:./sdk/react-native
```

## Usage

```tsx
import { WiretalkChat } from '@wiretalk/react-native-chat';

<WiretalkChat
  config={{
    baseUrl: 'https://wiretalk.tech',
    widgetKey: 'wk_…',
    appId: 'com.yourcompany.app',
    visitorName: user.name,
    visitorEmail: user.email,
  }}
  onBridgeEvent={(event) => {
    if (event.type === 'unread:count') setBadge(event.count ?? 0);
  }}
/>
```

Register `app:com.yourcompany.app` in Widget Settings → Allowed Domains.

## Demo

See [`example/`](example/) — minimal app with unread badge.

## Publish

See [../PUBLISHING.md](../PUBLISHING.md).

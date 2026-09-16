# Wiretalk Flutter SDK

Copy `lib/wiretalk_chat.dart` into your Flutter project or add as a local package.

```yaml
dependencies:
  webview_flutter: ^4.10.0
  wiretalk_chat:
    path: ../sdk/flutter
```

```dart
import 'package:wiretalk_chat/wiretalk_chat.dart';

WiretalkChatPage(
  config: WiretalkConfig(
    baseUrl: 'https://wiretalk.tech',
    widgetKey: 'wk_…',
    appId: 'com.yourcompany.app',
  ),
)
```

Register `app:com.yourcompany.app` in Allowed Domains.

## Demo

```bash
cd example
flutter pub get
flutter run
```

See [../PUBLISHING.md](../PUBLISHING.md) for pub.dev publishing.

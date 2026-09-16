# Wiretalk mobile bridge contract

Implemented in `resources/js/shared/mobile-bridge.js` (widget) and mirrored in each native SDK.

## Widget → native (outbound)

Posted as JSON string (Android `WiretalkAndroid.postMessage`, iOS `webkit.messageHandlers.wiretalk`, RN `ReactNativeWebView.postMessage`, Flutter `WiretalkFlutter.postMessage`).

### `widget:ready`

```json
{
  "type": "widget:ready",
  "platform": "android",
  "visitor_uid": "uuid",
  "conversation_id": 123
}
```

### `unread:count`

```json
{
  "type": "unread:count",
  "count": 3,
  "conversation_id": 123,
  "platform": "android"
}
```

### `message:received`

```json
{
  "type": "message:received",
  "message_id": 456,
  "body": "Hello",
  "conversation_id": 123,
  "platform": "android"
}
```

### `widget:state`

```json
{
  "type": "widget:state",
  "open": true,
  "tab": "chat",
  "conversation_id": 123,
  "platform": "android"
}
```

## Native → widget (inbound)

Dispatch a `message` event with `wiretalk: true`:

```javascript
window.dispatchEvent(new MessageEvent('message', {
  data: { wiretalk: true, type: 'widget:open', tab: 'chat' }
}));
```

### Commands

| type | fields |
|------|--------|
| `widget:open` | optional `tab`: `chat` \| `home` |
| `widget:close` | — |
| `widget:toggle` | — |
| `visitor:update` | `name`, `email`, `phone` |
| `storage:set` | `key`, `value` |
| `storage:remove` | `key` |

### Example: update visitor after login

```json
{
  "wiretalk": true,
  "type": "visitor:update",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+919876543210"
}
```

## Popout URL

```
{baseUrl}/popout/{widgetKey}?platform=android&app_id=com.example.app&locale=en&tab=chat
```

Optional: `visitor_uid`, `visitor_name`, `visitor_email`, `visitor_phone`, `app_version`, `app_build`.

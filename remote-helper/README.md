# Wiretalk Remote Helper (Windows)

Native helper app for **full remote desktop control**. The visitor runs this on Windows; the support agent controls mouse and keyboard from the Wiretalk agent dashboard.

## Requirements

- Windows 10/11
- Node.js 20+ (for development builds)
- Wiretalk Pro or Enterprise plan with **Remote desktop** enabled

## Development

```bash
cd remote-helper
npm install
npm start
```

## Build portable EXE

```bash
npm run dist
```

The portable executable is written to `remote-helper/dist/`.

## How it works

1. Agent opens a chat and clicks **Remote desktop**.
2. Agent shares the 6-character pairing code with the visitor.
3. Visitor opens Wiretalk Remote Helper, enters server URL + code.
4. Helper pairs via `POST /api/remote-desktop/pair`, joins the conversation socket room, and publishes the desktop over WebRTC.
5. Agent accepts control in the dashboard; mouse/keyboard events travel over an RTCDataChannel to the helper, which injects them via Windows APIs.

## Configuration

Set on the Wiretalk server:

- `WIRETALK_FEATURE_REMOTE_DESKTOP=true`
- `WIRETALK_REMOTE_HELPER_DOWNLOAD_URL=` URL to your published helper EXE

## Security notes

- Pairing codes expire after 15 minutes by default (`WIRETALK_REMOTE_DESKTOP_PAIRING_TTL`).
- Only agents with conversation access can start sessions.
- Remote control requires the visitor to run the helper and the agent to explicitly accept control.

# Wiretalk Remote Helper — Releases

Official downloads for the Wiretalk Remote Helper (remote desktop pairing app).

## Latest

| Platform | Download |
|----------|----------|
| Windows (portable EXE) | [WiretalkRemoteHelper-0.1.0.exe](https://github.com/anilkumar1995-star/wiretalk-sdk/releases/download/remote-helper-v0.1.0/WiretalkRemoteHelper-0.1.0.exe) |
| macOS (DMG) | Build from [`remote-helper-mac/`](remote-helper-mac/) on a Mac (`npm run dist`) |

## Pairing flow

1. Agent starts **Remote desktop** in Wiretalk chat and shares the pairing code.
2. Visitor downloads and runs the helper for their OS.
3. Enter Wiretalk server URL + pairing code.
4. Agent accepts control in the dashboard.

## Build from source

### Windows

```bash
cd remote-helper
npm install
CSC_IDENTITY_AUTO_DISCOVERY=false npm run dist
```

Output: `dist/WiretalkRemoteHelper-0.1.0.exe`

### macOS

```bash
cd remote-helper-mac
npm install
CSC_IDENTITY_AUTO_DISCOVERY=false npm run dist
```

## Server configuration

On your Wiretalk server:

```env
WIRETALK_REMOTE_HELPER_DOWNLOAD_URL=https://github.com/anilkumar1995-star/wiretalk-sdk/releases/download/remote-helper-v0.1.0/WiretalkRemoteHelper-0.1.0.exe
```

Agents see this link in the pairing modal when requesting remote desktop.

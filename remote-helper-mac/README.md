# Wiretalk Remote Helper (macOS)

macOS build of the Wiretalk Remote Helper. Same pairing flow as the Windows app.

## Requirements

- macOS 12+
- Node.js 20+
- Xcode command line tools

## Development

```bash
cd remote-helper-mac
npm install
npm start
```

## Build DMG

```bash
CSC_IDENTITY_AUTO_DISCOVERY=false npm run dist
```

Output: `dist/WiretalkRemoteHelper-0.1.0-mac.dmg`

## Notes

- Input injection uses AppleScript + `cliclick` fallback patterns in `input-bridge.js`.
- Screen capture uses Electron `desktopCapturer` (same as Windows helper).
- For production distribution outside the App Store, users may need to allow the app under **System Settings → Privacy & Security**.

See also [`../remote-helper/README.md`](../remote-helper/README.md) for the pairing flow.

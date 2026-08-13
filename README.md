# Vitamin Browser

**Supplement your search**

A privacy-first browser that poisons tracking data by feeding trackers garbage information instead of just blocking them.

## Key Features

Vitamin is a **local-first, privacy-focused desktop browser** designed around a calm interface, explicit context boundaries, and practical browser controls.

| Area | Capability |
| --- | --- |
| Privacy | Built-in ad and tracker blocking, optional HTTPS-only mode, WebRTC protection, fingerprinting resistance, and local per-site permission rules. |
| Context | Local workspaces use separate persistent browser sessions, while workspace deletion clears that workspace’s local session data. |
| Focus | Tab groups, protected pinned tabs, reader mode, a keyboard command center, and manual background-tab parking keep busy browsing sessions manageable. |
| Recovery | **Recently closed tabs** are stored locally, remain scoped to their original workspace, and can be restored with `Ctrl/Cmd+Shift+T` or from the command center. |
| Control | A local privacy ledger makes permission decisions visible, and standard bookmark, history, download, find-in-page, and session-restore tools remain built in. |
| Maintenance | Automatic update support and cross-platform builds for macOS, Linux, and Windows. |

> Vitamin keeps recovery metadata on the local device. It does not claim anonymous browsing, encrypted sync, or cross-device data recovery.

## Download

Visit our [Releases](https://github.com/realvitali/vitamin-releases/releases) page to download for:
- macOS
- Linux (Debian/Ubuntu, AppImage)
- Windows

### macOS Note
After installing, run: `xattr -cr /Applications/Vitamin.app`

## Source Code

This repository contains the full source code. Vitamin Browser is free and open source software.

### Building from Source

```bash
npm install
npm start
```

Run the verification suite with:

```bash
npm run test:security
```

Create a Linux package with:

```bash
npm run build:linux
```

## License

GNU General Public License v3.0 - See [LICENSE](LICENSE) file for details

Copyright (C) 2025 Vitali @ VitaliCorp
Email: mrvitali@pm.me

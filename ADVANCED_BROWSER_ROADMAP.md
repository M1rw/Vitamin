# Vitamin Advanced Browser Roadmap

## Delivered in This Increment

The browser now has **local workspaces** designed around three practical principles: a workspace owns its own visible tab strip, each non-personal workspace uses a dedicated persistent Electron session partition, and deleting a workspace clears its session storage and cache. Workspace metadata is bounded and validated, while renderer actions are available only through the trusted main UI bridge.

This creates an offline, local-first foundation rather than a cloud-collaboration system. It deliberately does not claim encryption, anonymity, cross-device sync, or account isolation beyond the session-partition boundary.

## Product Positioning

Chrome documents tab groups as an organizational mechanism; Edge describes dedicated windows with saved tab sets and optional account-based workspace features; Brave emphasizes native privacy controls, vertical tabs, and productivity tools. [1] [2] [3] Vitamin should differentiate by making **context boundaries, performance costs, and privacy trade-offs explicit**, instead of merely reproducing a tab list.

| Horizon | Capability | What makes it useful | Engineering prerequisite |
| --- | --- | --- | --- |
| Next | Workspace telemetry | Show tabs, storage footprint, blocked requests, and session status per workspace | Extend the current workspace state with bounded, local metrics only |
| Next | Tab suspension | Manually or automatically unload inactive tabs while preserving their URL and visual state | Introduce a clear suspended-tab lifecycle and memory-pressure policy |
| Next | Tab groups and pinning | Create named groups inside a workspace and preserve pinned operational tabs | Add group metadata to the validated session schema |
| Next | Command palette | Keyboard-first actions for tab search, workspace switching, navigation, and data cleanup | A typed command registry and trusted IPC allowlist |
| Later | Reader / speed view | Offer decluttered reading with per-site opt-in and an explicit fallback | Content extraction isolation, accessibility testing, and site-compatibility controls |
| Later | Privacy ledger | Per-site explanation of tracker blocking, storage, permissions, and network upgrades | Structured event collection that remains local by default |
| Later | Cross-device sync | Synchronize workspace metadata only after an end-to-end encrypted design and recovery model are defined | Threat model, cryptographic review, conflict resolution, and opt-in account layer |
| Architecture | View migration | Replace deprecated `BrowserView` usage with `WebContentsView` before deep feature expansion | Dedicated migration plan and desktop-runtime regression coverage |

> Electron documents that persistent partition names create a session shared by pages using the same partition, while a partition without the `persist:` prefix is in memory only. Vitamin intentionally uses persistent partitions for local workspaces and clears storage on deletion. [4]

## Non-Negotiable Quality Gates

Every capability should pass a source-level test suite, a hostile-renderer IPC test, desktop runtime tests on supported operating systems, and an accessibility pass before it is represented as a browser protection or productivity guarantee. BrowserView is deprecated in current Electron documentation, so the `WebContentsView` migration is an architectural priority rather than optional cleanup. [5]

## References

[1] [Google Chrome — Tips and shortcuts for better browsing](https://www.google.com/chrome/tips/)

[2] [Microsoft Edge — Workspaces](https://explore.microsoft.com/en-us/edge/features/workspaces)

[3] [Brave — Browser features](https://brave.com/features/)

[4] [Electron — Session API](https://www.electronjs.org/docs/latest/api/session)

[5] [Electron — BrowserView API](https://www.electronjs.org/docs/latest/api/browser-view)

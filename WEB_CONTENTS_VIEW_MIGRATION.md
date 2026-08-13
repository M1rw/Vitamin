# WebContentsView Migration Record

Vitamin has migrated its tab and hidden poison-engine views from Electron’s deprecated `BrowserView` API to `WebContentsView`. The project’s Electron dependency is version 39, which exceeds Electron’s documented version 30 migration baseline. [1]

| Previous behavior | Migrated behavior | Preservation measure |
| --- | --- | --- |
| Create a `BrowserView` per browser tab | Create a `WebContentsView` per browser tab | Existing web preferences, preload, context isolation, and workspace session selection are retained. |
| Attach one active view with `setBrowserView` | Add the active view through `BrowserWindow.contentView.addChildView` | Switching detaches the old tab before attaching the selected view. |
| Remove a view for workspace switches or modals | Use `contentView.removeChildView` | The view remains available for later reattachment unless its tab is closed. |
| Destroy browser-view contents on tab close | Explicitly close all remaining tab web contents when the window closes | This follows the documented responsibility to clean up `WebContentsView` contents. [2] |
| Hidden poison `BrowserView` instances | Hidden `WebContentsView` instances | Existing load and timed disposal behavior remains unchanged. |

## Required Desktop Runtime Tests

The source-level suite verifies syntax, validated IPC, workspace normalization, suspension eligibility, and ledger summarization. A desktop test run is still required because attachment and rendering behavior depend on the Electron runtime and operating system window manager.

| Test | Expected result |
| --- | --- |
| Open and switch across tabs | Only the selected tab is attached and visible; URL, title, favicon, navigation, and theme updates continue. |
| Switch local workspaces | The prior tab view detaches; the selected workspace attaches its own tab and session boundary remains intact. |
| Open and close modal/panel surfaces | The active view hides and reattaches without duplication or stale bounds. |
| Park and restore a tab | The parked view navigates to a blank page; selecting it reloads its preserved external URL. |
| Close the browser with several tabs | Child web contents close without leaks or hanging processes. |
| Run poison mode | Hidden content loads and is disposed on its existing timer without appearing above the active tab. |

## References

[1] [Electron — Migrating from BrowserView to WebContentsView](https://www.electronjs.org/blog/migrate-to-webcontentsview)

[2] [Electron — WebContentsView API](https://www.electronjs.org/docs/latest/api/web-contents-view)

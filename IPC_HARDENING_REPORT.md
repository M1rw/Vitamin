# Validated IPC Boundary Implementation

The browser-view preload no longer exposes a generic renderer IPC object. It now exposes only named methods required by bundled internal pages. The main process independently verifies that a request originates from an HTML file inside the packaged `html/` directory and, for sensitive channels, from the specific internal page authorized to invoke that action.

| Boundary | Applied control |
| --- | --- |
| Browser-view renderer bridge | Replaced generic `chrome.ipcRenderer` access with named `vitaminInternal` methods. |
| Sender identity | `requireTrustedInternalSender` accepts only packaged internal HTML senders and can restrict a channel to named pages. |
| Navigation and external opening | HTTP(S)-only parsing, bounded input length, scheme rejection, and query normalization. |
| Download filesystem actions | `open-download` and `show-download-in-folder` only accept paths already recorded in the browser download list. |
| Bookmarklets and destructive actions | Bookmarklets have bounded payload validation; browser-data deletion and app closing require the trusted main UI sender. |

## Verification

The source passes `npm run check:ipc` and `npm run test:ipc`. The test suite covers trusted and untrusted sender resolution, HTTP(S) URL acceptance, dangerous-scheme rejection, bounded search input, download-path matching, and bookmarklet limits.

The sandbox did not launch a graphical Electron desktop session. A release candidate should therefore also be tested in each supported desktop runtime with a hostile external page that attempts to access exposed objects and invoke privileged IPC channels. The expected result is that only the narrowly named bridge is visible, while the main process rejects privileged actions from external origins.


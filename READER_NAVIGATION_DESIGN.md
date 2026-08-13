# Reader Mode and Navigation Resilience Design

Vitamin will add a **reversible reader presentation** that runs only inside the current remote tab. It will preserve the original URL, avoid persisting extracted article content, and allow the user to leave reader mode instantly by reloading the original page. This is a local readability aid, not a claim that every page will extract correctly.

The navigation policy will deny renderer-created windows and route only validated HTTPS `target=_blank` / `window.open` URLs into a new internal tab. Requests using unsupported schemes remain denied. The policy retains Vitamin’s existing explicit user-initiated navigation and narrow `shell.openExternal` handling.

| Control | Intended behavior |
| --- | --- |
| Reader mode | Apply to eligible HTTPS tabs only; preserve original URL and restore by reload. |
| Window creation | Use `setWindowOpenHandler` to deny native child windows and optionally create a browser tab from a validated HTTPS URL. |
| Page-originated navigation | Block unsupported schemes and preserve HTTP-to-HTTPS upgrading through the existing session policy. |
| User-initiated navigation | Continue through existing main-process URL normalization and trusted IPC checks. |

> Electron documents `setWindowOpenHandler()` as the main-process control point for renderer-created windows, where returning `{ action: 'deny' }` cancels creation. Electron also documents cancellable navigation events and recommends limiting navigation and new-window creation. [1] [2]

## References

[1] [Electron — Opening Windows from the Renderer](https://www.electronjs.org/docs/latest/api/window-open)

[2] [Electron — Security Tutorial](https://www.electronjs.org/docs/latest/tutorial/security)

[3] [Electron — WebContents Navigation Events](https://www.electronjs.org/docs/latest/api/web-contents)

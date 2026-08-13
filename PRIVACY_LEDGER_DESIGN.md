# Local Privacy Ledger and Permission Design

Vitamin’s permission model will be **local-first and deny-by-default** for the browser sessions it controls. It will persist only bounded site-rule metadata and a short local audit trail. It will not claim to observe all browser privacy activity, provide network anonymity, or replace platform permission settings.

| Design rule | Implementation direction |
| --- | --- |
| Least privilege | Treat `notifications`, `media`, `geolocation`, `midi`, `clipboard-sanitized-write`, and other remote-content permissions as denied unless an explicit per-site allow rule exists. |
| Scoped decisions | Normalize only HTTPS origins and bind each rule to its local workspace identifier. |
| Transparent local records | Record the decision, permission, origin, workspace, and timestamp in a capped local ledger. |
| Revocability | Allow a user to set a site rule, remove a site rule, or clear the local ledger. |
| Defense in depth | Apply both request and check handlers to every controlled session. Keep the existing node-integration and context-isolation boundaries unchanged. |

> Electron’s security guidance recommends a permission request handler on every session that loads remote content. It also warns that remote content should run without Node integration and with context isolation enabled. [1]

The implementation follows Electron’s session model: persistent workspace partitions share a session by partition name, so rules are keyed by workspace and normalized origin rather than by a global browser profile. [2]

## References

[1] [Electron Security Tutorial](https://www.electronjs.org/docs/latest/tutorial/security)

[2] [Electron Session API](https://www.electronjs.org/docs/latest/api/session)

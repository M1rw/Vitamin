# IPC Boundary Hardening Checklist

- [x] Inventory privileged IPC channels and their current renderer exposure.
- [x] Define reusable sender, origin, URL, and path validation guards.
- [x] Apply guards to navigation, external links, downloads, filesystem actions, and destructive data controls.
- [x] Add source-level regression tests for accepted and rejected inputs.
- [x] Run static verification and document runtime tests that require a desktop display environment.

## Remaining runtime validation

- [ ] Launch the packaged browser on each supported desktop platform with an untrusted external-page fixture and confirm it cannot invoke privileged IPC actions.

## Advanced browser cycle

- [ ] Push the IPC boundary hardening commit to the connected GitHub repository.
- [x] Audit existing privacy, tab, download, and session-management capabilities for the next feature increment.
- [x] Implement a practical advanced workspace capability with validated IPC access.
- [x] Add regression coverage and run local source-level verification for the new capability.
- [ ] Push the advanced-browser feature commit to the connected GitHub repository.

## Next architecture milestones

- [ ] Migrate the tab-view layer from deprecated BrowserView to WebContentsView with desktop runtime regression coverage.
- [ ] Add tab suspension and a local workspace performance ledger.
- [ ] Add tab groups, pinning, and keyboard command search with validated IPC methods.

## Workspace performance cycle

- [x] Map the current tab lifecycle and identify safe suspension and restoration boundaries.
- [x] Implement a local workspace performance ledger and user-controlled tab suspension.
- [x] Add suspension and metric regression tests, then run source-level verification.
- [ ] Push the verified workspace performance increment to the connected GitHub repository.

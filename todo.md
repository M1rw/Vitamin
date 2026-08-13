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
- [ ] Audit existing privacy, tab, download, and session-management capabilities for the next feature increment.
- [ ] Implement a practical advanced workspace capability with validated IPC access.
- [ ] Add regression coverage and run local source-level verification for the new capability.
- [ ] Push the advanced-browser feature commit to the connected GitHub repository.

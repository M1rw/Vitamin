const { contextBridge, ipcRenderer } = require('electron');

// Browser views load arbitrary web content. Expose only the named operations
// needed by bundled internal pages; the main process also validates their sender.
contextBridge.exposeInMainWorld('vitaminInternal', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  search: (query) => ipcRenderer.send('search-request', query),
  proceedBlocked: (url) => ipcRenderer.send('proceed-blocked-url', url),
  proceedPalantir: (url) => ipcRenderer.send('proceed-palantir-url', url),
  onThemeChange: (callback) => ipcRenderer.on('theme-change', (_event, theme) => callback(theme)),
  onPoisonState: (callback) => ipcRenderer.on('poison-state', (_event, enabled) => callback(enabled)),
  onPerformanceModeChange: (callback) => ipcRenderer.on('performance-mode-change', (_event, enabled) => callback(enabled)),
});

contextBridge.exposeInMainWorld('vitamin', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
});

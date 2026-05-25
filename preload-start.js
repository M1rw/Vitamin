const { contextBridge, ipcRenderer } = require('electron');

// Restrict what we expose in the start preload to prevent arbitrary IPC access from web content
contextBridge.exposeInMainWorld('vitamin', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
});
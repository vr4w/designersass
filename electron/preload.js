const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('designerSassNative', {
  exportPdf: (payload) => ipcRenderer.invoke('export-pdf', payload),
  sendDiscordMessage: (payload) => ipcRenderer.invoke('send-discord', payload),
  getDiscordConfig: () => ipcRenderer.invoke('get-discord-config'),
  saveDiscordConfig: (payload) => ipcRenderer.invoke('save-discord-config', payload),
});

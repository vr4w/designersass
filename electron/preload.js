const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('designerSassNative', {
  exportPdf: (payload) => ipcRenderer.invoke('export-pdf', payload),
});

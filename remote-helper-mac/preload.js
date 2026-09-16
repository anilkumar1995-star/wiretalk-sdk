const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('wiretalkHelper', {
    capturePrimarySource: () => ipcRenderer.invoke('capture-primary-source'),
    injectInput: (payload) => ipcRenderer.invoke('inject-input', payload),
});

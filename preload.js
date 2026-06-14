const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('waterApp', {
  getState: () => ipcRenderer.invoke('get-state'),
  drinkWater: () => ipcRenderer.invoke('drink-water'),
  undoWater: () => ipcRenderer.invoke('undo-water'),
  updateSettings: (settings) => ipcRenderer.invoke('update-settings', settings),
  drawBlessing: () => ipcRenderer.invoke('draw-blessing'),
  buySkin: (skinId) => ipcRenderer.invoke('buy-skin', skinId),
  equipSkin: (skinId) => ipcRenderer.invoke('equip-skin', skinId),
  toggleDeveloperMode: () => ipcRenderer.invoke('toggle-developer-mode'),
  updateDeveloperCurrency: (currency) => ipcRenderer.invoke('update-developer-currency', currency),
  saveCustomReminder: (reminder) => ipcRenderer.invoke('save-custom-reminder', reminder),
  deleteCustomReminder: (reminderId) => ipcRenderer.invoke('delete-custom-reminder', reminderId),
  onStateChanged: (callback) => {
    ipcRenderer.on('state-changed', (_, state) => callback(state));
  }
});


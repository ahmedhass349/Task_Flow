/*
  FILE: public/preload.js
  PHASE: Phase 2
  PURPOSE: Preload script for secure IPC communication between renderer and main process.
  FEATURES:
  - Exposes limited API to React app
  - Prevents XSS attacks through context isolation
  - Handles backend URL and startup status communication
*/

const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited API to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // Get backend URL from main process
  getBackendUrl: () => ipcRenderer.invoke('get-backend-url'),
  
  // Get startup status (whether backend and DB are ready)
  getStartupStatus: () => ipcRenderer.invoke('get-startup-status'),
  
  // Send messages to main process (if needed in future)
  sendMessage: (channel, data) => {
    if (['log-message'].includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  // Receive messages from main process
  onMessage: (channel, callback) => {
    if (['backend-status-changed'].includes(channel)) {
      ipcRenderer.on(channel, (event, data) => callback(data));
    }
  }
});

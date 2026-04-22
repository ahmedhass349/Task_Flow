const { contextBridge, ipcRenderer } = require('electron');

// Allowlist of IPC channels the renderer is permitted to call.
// Add new channels here when new ipcMain.handle() handlers are registered.
const ALLOWED_INVOKE_CHANNELS = [
  'get-backend-url',
  'get-startup-status',
  'read-reset-code',
];

const ALLOWED_SEND_CHANNELS = [
  // No one-way send channels currently in use.
];

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel, ...args) => {
    if (!ALLOWED_INVOKE_CHANNELS.includes(channel))
      throw new Error(`IPC channel not allowed: ${channel}`);
    return ipcRenderer.invoke(channel, ...args);
  },
  send: (channel, ...args) => {
    if (!ALLOWED_SEND_CHANNELS.includes(channel))
      throw new Error(`IPC channel not allowed: ${channel}`);
    ipcRenderer.send(channel, ...args);
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  once: (channel, func) => {
    ipcRenderer.once(channel, (event, ...args) => func(...args));
  },
  removeListener: (channel, func) => {
    ipcRenderer.removeListener(channel, func);
  },
  // Platform information
  platform: process.platform,
  arch: process.arch
});

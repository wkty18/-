const { contextBridge, ipcRenderer } = require('electron');

// 通过 contextBridge 安全地暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 文件操作
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (defaultPath) => ipcRenderer.invoke('dialog:saveFile', defaultPath),
  readFile: (filePath) => ipcRenderer.invoke('file:read', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('file:write', filePath, content),

  // 应用信息
  getRecentFiles: () => ipcRenderer.invoke('app:getRecentFiles'),
  getAppPath: () => ipcRenderer.invoke('app:getAppPath'),

  // 监听主进程事件
  on: (channel, callback) => {
    const validChannels = [
      'file:new',
      'file:open-recent',
      'file:loaded',
      'file:save',
      'file:save-as-path',
      'file:export-preview',
      'edit:undo',
      'edit:redo',
      'edit:duplicate',
      'edit:delete',
      'view:toggle-components',
      'view:toggle-properties',
      'app:before-close'
    ];
    if (validChannels.includes(channel)) {
      const subscription = (event, ...args) => callback(...args);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    }
  }
});

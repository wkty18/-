const e = require('electron');
console.log('ipcMain:', typeof e.ipcMain);
console.log('app:', typeof e.app);
console.log('Resolved path:', require.resolve('electron'));

const { app, BrowserWindow, ipcMain } = require('electron');
console.log('app:', typeof app);
console.log('BrowserWindow:', typeof BrowserWindow);
console.log('ipcMain:', typeof ipcMain);
console.log('SUCCESS - all APIs loaded!');
app.whenReady().then(() => {
  console.log('App ready!');
  app.quit();
});

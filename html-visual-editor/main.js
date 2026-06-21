const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let recentFiles = [];
const MAX_RECENT_FILES = 10;

// 加载最近文件列表
function loadRecentFiles() {
  const userDataPath = app.getPath('userData');
  const recentPath = path.join(userDataPath, 'recent-files.json');
  try {
    if (fs.existsSync(recentPath)) {
      recentFiles = JSON.parse(fs.readFileSync(recentPath, 'utf-8'));
    }
  } catch (e) {
    recentFiles = [];
  }
}

// 保存最近文件列表
function saveRecentFiles() {
  const userDataPath = app.getPath('userData');
  const recentPath = path.join(userDataPath, 'recent-files.json');
  try {
    fs.writeFileSync(recentPath, JSON.stringify(recentFiles, null, 2), 'utf-8');
  } catch (e) {
    // 忽略写入错误
  }
}

// 添加到最近文件
function addToRecentFiles(filePath) {
  recentFiles = recentFiles.filter(f => f !== filePath);
  recentFiles.unshift(filePath);
  if (recentFiles.length > MAX_RECENT_FILES) {
    recentFiles = recentFiles.slice(0, MAX_RECENT_FILES);
  }
  saveRecentFiles();
  buildMenu();
}

// 构建应用菜单
function buildMenu() {
  const recentFileItems = recentFiles.length > 0
    ? recentFiles.map((filePath, index) => ({
        label: path.basename(filePath),
        tooltip: filePath,
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.send('file:open-recent', filePath);
          }
        }
      }))
    : [{ label: '(无最近文件)', enabled: false }];

  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow && mainWindow.webContents.send('file:new')
        },
        {
          label: '打开...',
          accelerator: 'CmdOrCtrl+O',
          click: () => handleOpenFile()
        },
        {
          label: '最近打开的文件',
          submenu: recentFileItems
        },
        { type: 'separator' },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow && mainWindow.webContents.send('file:save')
        },
        {
          label: '另存为...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => handleSaveAs()
        },
        { type: 'separator' },
        {
          label: '导出预览',
          click: () => mainWindow && mainWindow.webContents.send('file:export-preview')
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        {
          label: '撤销',
          accelerator: 'CmdOrCtrl+Z',
          click: () => mainWindow && mainWindow.webContents.send('edit:undo')
        },
        {
          label: '重做',
          accelerator: 'CmdOrCtrl+Y',
          click: () => mainWindow && mainWindow.webContents.send('edit:redo')
        },
        { type: 'separator' },
        {
          label: '复制元素',
          accelerator: 'CmdOrCtrl+D',
          click: () => mainWindow && mainWindow.webContents.send('edit:duplicate')
        },
        {
          label: '删除元素',
          accelerator: 'Delete',
          click: () => mainWindow && mainWindow.webContents.send('edit:delete')
        }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '切换组件面板',
          accelerator: 'CmdOrCtrl+B',
          click: () => mainWindow && mainWindow.webContents.send('view:toggle-components')
        },
        {
          label: '切换属性面板',
          accelerator: 'CmdOrCtrl+I',
          click: () => mainWindow && mainWindow.webContents.send('view:toggle-properties')
        },
        { type: 'separator' },
        {
          label: '开发者工具',
          accelerator: 'F12',
          click: () => mainWindow && mainWindow.webContents.toggleDevTools()
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于 HTML可视化编辑器',
              message: 'HTML可视化编辑器 v1.0.0',
              detail: '所见即所得的HTML编辑工具\n支持拖拽组件、CSS可视化编辑、实时预览'
            });
          }
        }
      ]
    }
  ];

  // macOS 下需要插入应用名菜单
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { label: '关于', role: 'about' },
        { type: 'separator' },
        { label: '退出', role: 'quit' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 处理打开文件
async function handleOpenFile() {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: '打开 HTML 文件',
    filters: [
      { name: 'HTML 文件', extensions: ['html', 'htm'] },
      { name: '所有文件', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    addToRecentFiles(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    mainWindow.webContents.send('file:loaded', { filePath, content });
  }
}

// 处理另存为
async function handleSaveAs() {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: '另存为',
    filters: [
      { name: 'HTML 文件', extensions: ['html', 'htm'] },
      { name: '所有文件', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePath) {
    mainWindow.webContents.send('file:save-as-path', result.filePath);
  }
}

// IPC 处理
ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: '打开 HTML 文件',
    filters: [
      { name: 'HTML 文件', extensions: ['html', 'htm'] },
      { name: '所有文件', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    addToRecentFiles(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    return { filePath, content };
  }
  return null;
});

ipcMain.handle('dialog:saveFile', async (event, defaultPath) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: '保存 HTML 文件',
    defaultPath: defaultPath,
    filters: [
      { name: 'HTML 文件', extensions: ['html', 'htm'] },
      { name: '所有文件', extensions: ['*'] }
    ]
  });

  if (!result.canceled && result.filePath) {
    return result.filePath;
  }
  return null;
});

ipcMain.handle('file:read', async (event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (e) {
    throw new Error(`无法读取文件: ${filePath}`);
  }
});

ipcMain.handle('file:write', async (event, filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    addToRecentFiles(filePath);
    return true;
  } catch (e) {
    throw new Error(`无法保存文件: ${filePath}`);
  }
});

ipcMain.handle('app:getRecentFiles', () => {
  return recentFiles;
});

ipcMain.handle('app:getAppPath', () => {
  return app.getAppPath();
});

// 创建主窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 950,
    minWidth: 1100,
    minHeight: 650,
    title: 'HTML可视化编辑器',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // 窗口关闭前检查
  mainWindow.on('close', (e) => {
    mainWindow.webContents.send('app:before-close');
  });
}

// 应用启动
app.whenReady().then(() => {
  loadRecentFiles();
  buildMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

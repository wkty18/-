// ===== 文件管理器 =====
// 处理文件的打开、保存、新建操作

class FileManager {
  constructor() {
    this.filePath = null;
    this.fileName = '未命名页面';
    this.isDirty = false;
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  _emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  // 获取模板 HTML
  _getTemplateHTML() {
    // 基础空白模板（如果 templates/blank.html 不存在则使用此模板）
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>新建页面</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f5f5f7;
      color: #1d1d1f;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #007aff, #5856d6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 1.1rem;
      color: #86868b;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>欢迎使用 HTML 可视化编辑器</h1>
    <p>开始拖拽组件来构建你的页面吧！</p>
  </div>
</body>
</html>`;
  }

  // 新建文件
  async newFile() {
    if (this.isDirty) {
      const confirmed = confirm('当前文件有未保存的修改。是否继续？');
      if (!confirmed) return null;
    }

    this.filePath = null;
    this.fileName = '未命名页面';
    this.isDirty = false;
    const html = this._getTemplateHTML();
    this._emit('fileChanged', { filePath: null, fileName: this.fileName, html, isDirty: false });
    return html;
  }

  // 打开文件（通过 Electron API）
  async openFile() {
    if (this.isDirty) {
      const confirmed = confirm('当前文件有未保存的修改。是否继续？');
      if (!confirmed) return null;
    }

    try {
      const result = await window.electronAPI.openFile();
      if (result) {
        this.filePath = result.filePath;
        this.fileName = result.filePath.split(/[/\\]/).pop();
        this.isDirty = false;
        this._emit('fileChanged', {
          filePath: this.filePath,
          fileName: this.fileName,
          html: result.content,
          isDirty: false
        });
        return result.content;
      }
    } catch (e) {
      console.error('打开文件失败:', e);
      alert('打开文件失败: ' + e.message);
    }
    return null;
  }

  // 通过路径加载文件内容
  async loadFile(filePath) {
    try {
      const content = await window.electronAPI.readFile(filePath);
      this.filePath = filePath;
      this.fileName = filePath.split(/[/\\]/).pop();
      this.isDirty = false;
      this._emit('fileChanged', {
        filePath: this.filePath,
        fileName: this.fileName,
        html: content,
        isDirty: false
      });
      return content;
    } catch (e) {
      console.error('加载文件失败:', e);
      alert('加载文件失败: ' + e.message);
    }
    return null;
  }

  // 保存文件
  async save(html) {
    if (!this.filePath) {
      return await this.saveAs(html);
    }

    try {
      await window.electronAPI.writeFile(this.filePath, html);
      this.isDirty = false;
      this._emit('dirtyChanged', { isDirty: false });
      return true;
    } catch (e) {
      console.error('保存失败:', e);
      alert('保存文件失败: ' + e.message);
      return false;
    }
  }

  // 另存为
  async saveAs(html) {
    try {
      const filePath = await window.electronAPI.saveFile(this.filePath || 'untitled.html');
      if (filePath) {
        this.filePath = filePath;
        this.fileName = filePath.split(/[/\\]/).pop();
        await window.electronAPI.writeFile(filePath, html);
        this.isDirty = false;
        this._emit('fileChanged', {
          filePath: this.filePath,
          fileName: this.fileName,
          html,
          isDirty: false
        });
        return true;
      }
    } catch (e) {
      console.error('另存为失败:', e);
      alert('另存为失败: ' + e.message);
    }
    return false;
  }

  // 标记为已修改
  markDirty() {
    if (!this.isDirty) {
      this.isDirty = true;
      this._emit('dirtyChanged', { isDirty: true });
    }
  }

  // 导出预览（在默认浏览器打开）
  exportPreview(html) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}

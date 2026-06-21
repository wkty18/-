// ===== 编辑器核心 — 连接所有模块 =====

class Editor {
  constructor() {
    // 核心状态
    this.currentHTML = '';
    this.selectedInfo = null;
    this.selectedSelector = null;

    // 初始化模块
    this.undoManager = new UndoManager();
    this.fileManager = new FileManager();
    this.canvasBridge = new CanvasBridge('design-canvas');
    this.componentsPanel = new ComponentsPanel();
    this.propertiesPanel = new PropertiesPanel();

    // 交互状态
    this.contextMenuTarget = null;

    // 初始化
    this._init();
  }

  _init() {
    // 初始化组件库
    this.componentsPanel.initComponentLibrary();

    // 绑定工具栏按钮
    this._bindToolbar();

    // 绑定面板标签切换
    this._bindPanelTabs();

    // 绑定画布事件
    this._bindCanvasEvents();

    // 绑定属性面板事件
    this._bindPropertyEvents();

    // 绑定组件面板事件
    this._bindComponentPanelEvents();

    // 绑定文件管理器事件
    this._bindFileManagerEvents();

    // 绑定右键菜单
    this._bindContextMenu();

    // 绑定快捷键
    this._bindKeyboardShortcuts();

    // 绑定 Electron IPC 事件
    this._bindIPCEvents();

    // 绑定画布容器拖放
    this._bindCanvasDrop();

    // 绑定画布模式切换
    this._bindCanvasMode();

    // 绑定缩放控制
    this._bindZoom();

    // 加载初始空白文件
    this.fileManager.newFile().then(html => {
      if (html) this.loadHTML(html);
    });

    // 更新状态栏
    this._updateStatusBar();
  }

  // ===== 工具栏 =====
  _bindToolbar() {
    document.getElementById('btn-new').addEventListener('click', () => this.fileManager.newFile().then(h => { if (h) this.loadHTML(h); }));
    document.getElementById('btn-open').addEventListener('click', () => this.fileManager.openFile().then(h => { if (h) this.loadHTML(h); }));
    document.getElementById('btn-save').addEventListener('click', () => this.fileManager.save(this.currentHTML));
    document.getElementById('btn-save-as').addEventListener('click', () => this.fileManager.saveAs(this.currentHTML));
    document.getElementById('btn-undo').addEventListener('click', () => this.undo());
    document.getElementById('btn-redo').addEventListener('click', () => this.redo());
    document.getElementById('btn-preview').addEventListener('click', () => this.fileManager.exportPreview(this.currentHTML));
  }

  // ===== 面板标签切换 =====
  _bindPanelTabs() {
    document.querySelectorAll('.panel-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const panel = tab.closest('.panel');
        const tabName = tab.dataset.tab;

        // 切换标签活动状态
        panel.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // 切换面板内容
        panel.querySelectorAll('.panel-content').forEach(c => c.classList.add('hidden'));
        const target = document.getElementById('tab-' + tabName);
        if (target) target.classList.remove('hidden');
      });
    });
  }

  // ===== 画布事件 =====
  _bindCanvasEvents() {
    this.canvasBridge.on('elementSelected', (info) => {
      this.selectedInfo = info;
      this.selectedSelector = info.selector;
      this.propertiesPanel.loadElement(info, info.selector);
      this.componentsPanel.highlightBySelector(info.selector);
      this._updateBreadcrumb(info.selector);
      this._updateStatusBar();
    });

    this.canvasBridge.on('textEdited', (msg) => {
      this._saveUndoState();
      this._updateTextContent(msg.selector, msg.newText);
      this.fileManager.markDirty();
    });

    this.canvasBridge.on('canvasClicked', (msg) => {
      if (msg.target === 'body') {
        this.selectedInfo = null;
        this.selectedSelector = null;
        this.propertiesPanel.loadElement(null, null);
        this._updateBreadcrumb('');
        this._updateStatusBar();
      }
    });
  }

  // ===== 属性面板事件 =====
  _bindPropertyEvents() {
    this.propertiesPanel.on('propertiesChanged', (data) => {
      if (!data.selector) return;
      this._saveUndoState();
      this._applyPropertyChanges(data.selector, data.changes);
      this.fileManager.markDirty();
    });

    this.propertiesPanel.on('cssVarsChanged', (vars) => {
      this._saveUndoState();
      this._updateCSSVariables(vars);
      this.fileManager.markDirty();
    });
  }

  // ===== 组件面板事件 =====
  _bindComponentPanelEvents() {
    this.componentsPanel.on('elementSelected', (data) => {
      this.canvasBridge.highlightElement(data.selector);
      this.canvasBridge.scrollToElement(data.selector);
    });

    this.componentsPanel.on('contextMenu', (data) => {
      this.contextMenuTarget = data;
      this._showContextMenu(data.x, data.y);
    });
  }

  // ===== 文件管理器事件 =====
  _bindFileManagerEvents() {
    this.fileManager.on('fileChanged', (data) => {
      document.getElementById('file-name').textContent = data.fileName;
      this._updateStatusBar();
    });

    this.fileManager.on('dirtyChanged', (data) => {
      this._updateStatusBar();
    });
  }

  // ===== 右键菜单 =====
  _bindContextMenu() {
    const menu = document.getElementById('context-menu');

    document.addEventListener('click', () => {
      menu.style.display = 'none';
    });

    menu.querySelectorAll('.ctx-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        this._handleContextAction(action);
        menu.style.display = 'none';
      });
    });
  }

  _showContextMenu(x, y) {
    const menu = document.getElementById('context-menu');
    menu.style.display = 'block';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';

    // 确保不超出窗口
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      menu.style.left = (x - rect.width) + 'px';
    }
    if (rect.bottom > window.innerHeight) {
      menu.style.top = (y - rect.height) + 'px';
    }
  }

  _handleContextAction(action) {
    const selector = this.selectedSelector;
    if (!selector) return;

    this._saveUndoState();

    switch (action) {
      case 'edit-text':
        this.canvasBridge.highlightElement(selector);
        break;

      case 'edit-html':
        this._showEditHTMLModal(selector);
        break;

      case 'duplicate':
        this._duplicateElement(selector);
        break;

      case 'delete':
        this._deleteElement(selector);
        break;

      case 'add-before':
        this._insertElement(selector, 'beforebegin');
        break;

      case 'add-after':
        this._insertElement(selector, 'afterend');
        break;

      case 'wrap-with':
        this._wrapElement(selector);
        break;
    }
  }

  // ===== 键盘快捷键 =====
  _bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (e.shiftKey) {
          this.fileManager.saveAs(this.currentHTML);
        } else {
          this.fileManager.save(this.currentHTML);
        }
      }

      // Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }

      // Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        this.redo();
      }

      // Delete
      if (e.key === 'Delete' && this.selectedSelector && document.activeElement === document.body) {
        e.preventDefault();
        this._saveUndoState();
        this._deleteElement(this.selectedSelector);
        this.fileManager.markDirty();
      }
    });
  }

  // ===== IPC 事件 =====
  _bindIPCEvents() {
    if (!window.electronAPI || !window.electronAPI.on) return;

    window.electronAPI.on('file:new', () => {
      this.fileManager.newFile().then(h => { if (h) this.loadHTML(h); });
    });

    window.electronAPI.on('file:save', () => {
      this.fileManager.save(this.currentHTML);
    });

    window.electronAPI.on('file:save-as-path', (filePath) => {
      window.electronAPI.writeFile(filePath, this.currentHTML).then(() => {
        this.fileManager.filePath = filePath;
        this.fileManager.fileName = filePath.split(/[/\\]/).pop();
        this.fileManager.isDirty = false;
        document.getElementById('file-name').textContent = this.fileManager.fileName;
        this._updateStatusBar();
      });
    });

    window.electronAPI.on('file:export-preview', () => {
      this.fileManager.exportPreview(this.currentHTML);
    });

    window.electronAPI.on('edit:undo', () => this.undo());
    window.electronAPI.on('edit:redo', () => this.redo());

    window.electronAPI.on('edit:duplicate', () => {
      if (this.selectedSelector) {
        this._saveUndoState();
        this._duplicateElement(this.selectedSelector);
        this.fileManager.markDirty();
      }
    });

    window.electronAPI.on('edit:delete', () => {
      if (this.selectedSelector) {
        this._saveUndoState();
        this._deleteElement(this.selectedSelector);
        this.fileManager.markDirty();
      }
    });

    window.electronAPI.on('view:toggle-components', () => {
      document.getElementById('panel-left').classList.toggle('hidden');
    });

    window.electronAPI.on('view:toggle-properties', () => {
      document.getElementById('panel-right').classList.toggle('hidden');
    });

    window.electronAPI.on('file:loaded', (data) => {
      if (data && data.content) {
        this.fileManager.filePath = data.filePath;
        this.fileManager.fileName = data.filePath.split(/[/\\]/).pop();
        this.fileManager.isDirty = false;
        document.getElementById('file-name').textContent = this.fileManager.fileName;
        this.loadHTML(data.content);
        this._updateStatusBar();
      }
    });

    window.electronAPI.on('file:open-recent', (filePath) => {
      this.fileManager.loadFile(filePath).then(h => {
        if (h) this.loadHTML(h);
      });
    });

    window.electronAPI.on('app:before-close', () => {
      if (this.fileManager.isDirty) {
        // 主进程处理关闭确认
      }
    });
  }

  // ===== 画布拖放（接收组件拖入） =====
  _bindCanvasDrop() {
    const canvasContainer = document.getElementById('canvas-container');

    canvasContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    canvasContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      const componentId = e.dataTransfer.getData('application/component-id');
      const fallbackHTML = e.dataTransfer.getData('text/plain');

      if (componentId) {
        const template = COMPONENT_TEMPLATES.find(c => c.id === componentId);
        if (template) {
          this._saveUndoState();
          this._insertComponentToBody(template);
          this.fileManager.markDirty();
        }
      } else if (fallbackHTML) {
        this._saveUndoState();
        this._insertRawHTMLToBody(fallbackHTML);
        this.fileManager.markDirty();
      }
    });
  }

  // 插入组件到 body
  _insertComponentToBody(template) {
    let html = template.html;

    // 如果有 CSS，将 CSS 追加到 <style> 标签
    if (template.css) {
      const cssBlock = '\n/* ' + template.name + ' */\n' + template.css;
      if (this.currentHTML.includes('</style>')) {
        this.currentHTML = this.currentHTML.replace('</style>', cssBlock + '\n</style>');
      } else if (this.currentHTML.includes('</head>')) {
        this.currentHTML = this.currentHTML.replace('</head>', '<style>\n' + cssBlock + '\n</style>\n</head>');
      }
    }

    // 将 HTML 插入到 </body> 之前
    const indent = '  ';
    const indentedHTML = html.split('\n').map(line => indent + line).join('\n');
    this.currentHTML = this.currentHTML.replace('</body>', indentedHTML + '\n</body>');

    this.canvasBridge.loadHTML(this.currentHTML);
    this.componentsPanel.buildDOMTree(this.currentHTML);
    this.propertiesPanel.loadCSSVariables(this.currentHTML);
  }

  _insertRawHTMLToBody(rawHTML) {
    const indent = '  ';
    const indentedHTML = rawHTML.split('\n').map(line => indent + line).join('\n');
    this.currentHTML = this.currentHTML.replace('</body>', indentedHTML + '\n</body>');

    this.canvasBridge.loadHTML(this.currentHTML);
    this.componentsPanel.buildDOMTree(this.currentHTML);
    this.propertiesPanel.loadCSSVariables(this.currentHTML);
  }

  // ===== 画布模式切换 =====
  _bindCanvasMode() {
    document.querySelectorAll('input[name="canvasMode"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          this.canvasBridge.setMode(radio.value);
        }
      });
    });
  }

  // ===== 缩放 =====
  _bindZoom() {
    document.getElementById('btn-zoom-in').addEventListener('click', () => this._zoom(1));
    document.getElementById('btn-zoom-out').addEventListener('click', () => this._zoom(-1));

    // Ctrl + 滚轮缩放
    document.getElementById('canvas-container').addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        this._zoom(e.deltaY < 0 ? 1 : -1);
      }
    }, { passive: false });
  }

  _zoom(delta) {
    let newZoom = this.canvasBridge.zoomLevel + delta * 0.1;
    newZoom = Math.max(0.3, Math.min(2, newZoom));
    newZoom = Math.round(newZoom * 100) / 100;

    this.canvasBridge.setZoom(newZoom);
    document.getElementById('zoom-label').textContent = Math.round(newZoom * 100) + '%';
  }

  // ===== 核心操作 =====

  // 加载 HTML
  loadHTML(html) {
    this.currentHTML = html;
    this.undoManager.clear();
    this.canvasBridge.loadHTML(html);
    this.componentsPanel.buildDOMTree(html);
    this.propertiesPanel.loadCSSVariables(html);
    this.selectedInfo = null;
    this.selectedSelector = null;
    this.propertiesPanel.loadElement(null, null);
    this._updateBreadcrumb('');
    this._updateStatusBar();
  }

  // 撤销
  undo() {
    const prevState = this.undoManager.undo(this.currentHTML);
    if (prevState !== null) {
      this.currentHTML = prevState;
      this.canvasBridge.loadHTML(prevState);
      this.componentsPanel.buildDOMTree(prevState);
      this.propertiesPanel.loadCSSVariables(prevState);
      this.selectedInfo = null;
      this.selectedSelector = null;
      this.propertiesPanel.loadElement(null, null);
      this._updateBreadcrumb('');
      this._updateStatusBar();
    }
  }

  // 重做
  redo() {
    const nextState = this.undoManager.redo(this.currentHTML);
    if (nextState !== null) {
      this.currentHTML = nextState;
      this.canvasBridge.loadHTML(nextState);
      this.componentsPanel.buildDOMTree(nextState);
      this.propertiesPanel.loadCSSVariables(nextState);
      this.selectedInfo = null;
      this.selectedSelector = null;
      this.propertiesPanel.loadElement(null, null);
      this._updateBreadcrumb('');
      this._updateStatusBar();
    }
  }

  // 保存撤销状态
  _saveUndoState() {
    this.undoManager.push(this.currentHTML);
  }

  // 更新文本内容
  _updateTextContent(selector, newText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.currentHTML, 'text/html');

    try {
      const el = this._findElement(doc, selector);
      if (el) {
        el.innerHTML = newText;
        this.currentHTML = this._serializeDocument(doc);
        this.canvasBridge.loadHTML(this.currentHTML);
        this.componentsPanel.buildDOMTree(this.currentHTML);
      }
    } catch (e) {
      console.warn('更新文本失败:', e);
    }
  }

  // 应用属性修改到 HTML 源码
  _applyPropertyChanges(selector, changes) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.currentHTML, 'text/html');

    try {
      const el = this._findElement(doc, selector);
      if (!el) return;

      // 标签名
      if (changes.tagName && changes.tagName !== el.tagName.toLowerCase()) {
        const newEl = doc.createElement(changes.tagName);
        // 复制所有属性
        while (el.attributes.length > 0) {
          newEl.setAttribute(el.attributes[0].name, el.attributes[0].value);
          el.removeAttribute(el.attributes[0].name);
        }
        // 复制子节点
        while (el.firstChild) {
          newEl.appendChild(el.firstChild);
        }
        el.parentNode.replaceChild(newEl, el);
        // 替换后 el 失效
      }

      const targetEl = this._findElement(doc, selector) || el;

      // ID
      if (changes.id !== undefined) {
        if (changes.id) targetEl.setAttribute('id', changes.id);
        else targetEl.removeAttribute('id');
      }

      // Class
      if (changes.className !== undefined) {
        if (changes.className) targetEl.setAttribute('class', changes.className);
        else targetEl.removeAttribute('class');
      }

      // 常用属性
      if (changes.href !== undefined) {
        if (changes.href) targetEl.setAttribute('href', changes.href);
        else targetEl.removeAttribute('href');
      }
      if (changes.src !== undefined) {
        if (changes.src) targetEl.setAttribute('src', changes.src);
        else targetEl.removeAttribute('src');
      }
      if (changes.alt !== undefined) {
        if (changes.alt) targetEl.setAttribute('alt', changes.alt);
        else targetEl.removeAttribute('alt');
      }
      if (changes.placeholder !== undefined) {
        if (changes.placeholder) targetEl.setAttribute('placeholder', changes.placeholder);
        else targetEl.removeAttribute('placeholder');
      }
      if (changes.type !== undefined) {
        targetEl.setAttribute('type', changes.type);
      }

      // 自定义属性
      if (changes.customAttributes) {
        Object.keys(changes.customAttributes).forEach(key => {
          targetEl.setAttribute(key, changes.customAttributes[key]);
        });
      }

      // 文本内容
      if (changes.textContent !== undefined && !targetEl.children.length) {
        targetEl.textContent = changes.textContent;
      }

      // 样式
      if (changes.styles && Object.keys(changes.styles).length > 0) {
        const styleParts = [];
        Object.keys(changes.styles).forEach(prop => {
          const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          styleParts.push(cssProp + ': ' + changes.styles[prop]);
        });
        const styleStr = styleParts.join('; ') + ';';
        if (styleStr.trim() !== ';') {
          targetEl.setAttribute('style', styleStr);
        } else {
          targetEl.removeAttribute('style');
        }
      }

      this.currentHTML = this._serializeDocument(doc);
      this.canvasBridge.loadHTML(this.currentHTML);
      this.componentsPanel.buildDOMTree(this.currentHTML);

      // 延迟恢复选中
      setTimeout(() => {
        this.canvasBridge.highlightElement(selector);
      }, 200);

    } catch (e) {
      console.warn('应用属性修改失败:', e);
    }
  }

  // 更新 CSS 变量
  _updateCSSVariables(vars) {
    const varKeys = Object.keys(vars);
    if (varKeys.length === 0) return;

    const rootMatch = this.currentHTML.match(/:root\s*\{([^}]*)\}/);
    if (rootMatch) {
      let varBlock = rootMatch[1];
      varKeys.forEach(name => {
        const varRegex = new RegExp('(--' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*:\\s*)[^;]+;');
        if (varRegex.test(varBlock)) {
          varBlock = varBlock.replace(varRegex, '$1' + vars[name] + ';');
        } else {
          varBlock += '\n  --' + name + ': ' + vars[name] + ';';
        }
      });
      this.currentHTML = this.currentHTML.replace(/:root\s*\{[^}]*\}/, ':root {' + varBlock + '}');
    } else {
      // 没有 :root 块，创建一个
      let newRoot = ':root {\n';
      varKeys.forEach(name => {
        newRoot += '  --' + name + ': ' + vars[name] + ';\n';
      });
      newRoot += '}';

      const styleMatch = this.currentHTML.match(/<style[^>]*>/);
      if (styleMatch) {
        this.currentHTML = this.currentHTML.replace(styleMatch[0], styleMatch[0] + '\n  ' + newRoot);
      }
    }

    this.canvasBridge.loadHTML(this.currentHTML);
    this.canvasBridge.refresh();
  }

  // 删除元素
  _deleteElement(selector) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.currentHTML, 'text/html');

    try {
      const el = this._findElement(doc, selector);
      if (el && el.parentNode && el.tagName.toLowerCase() !== 'body' && el.tagName.toLowerCase() !== 'html') {
        el.parentNode.removeChild(el);
        this.currentHTML = this._serializeDocument(doc);
        this.canvasBridge.loadHTML(this.currentHTML);
        this.componentsPanel.buildDOMTree(this.currentHTML);

        this.selectedInfo = null;
        this.selectedSelector = null;
        this.propertiesPanel.loadElement(null, null);
      }
    } catch (e) {
      console.warn('删除元素失败:', e);
    }
  }

  // 复制元素
  _duplicateElement(selector) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.currentHTML, 'text/html');

    try {
      const el = this._findElement(doc, selector);
      if (el && el.parentNode && el.tagName.toLowerCase() !== 'body' && el.tagName.toLowerCase() !== 'html') {
        const clone = el.cloneNode(true);
        el.parentNode.insertBefore(clone, el.nextSibling);
        this.currentHTML = this._serializeDocument(doc);
        this.canvasBridge.loadHTML(this.currentHTML);
        this.componentsPanel.buildDOMTree(this.currentHTML);
      }
    } catch (e) {
      console.warn('复制元素失败:', e);
    }
  }

  // 在指定位置插入元素
  _insertElement(selector, position) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.currentHTML, 'text/html');

    try {
      const el = this._findElement(doc, selector);
      if (el && el.tagName.toLowerCase() !== 'html') {
        const newDiv = doc.createElement('div');
        newDiv.textContent = '新元素';
        newDiv.setAttribute('style', 'padding: 16px; background: #f5f5f7; border-radius: 8px; margin: 8px 0;');
        el.insertAdjacentElement(position, newDiv);

        this.currentHTML = this._serializeDocument(doc);
        this.canvasBridge.loadHTML(this.currentHTML);
        this.componentsPanel.buildDOMTree(this.currentHTML);
      }
    } catch (e) {
      console.warn('插入元素失败:', e);
    }
  }

  // 包裹元素
  _wrapElement(selector) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.currentHTML, 'text/html');

    try {
      const el = this._findElement(doc, selector);
      if (el && el.parentNode && el.tagName.toLowerCase() !== 'html') {
        const wrapper = doc.createElement('div');
        wrapper.setAttribute('style', 'padding: 16px; background: #f5f5f7; border-radius: 12px;');
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);

        this.currentHTML = this._serializeDocument(doc);
        this.canvasBridge.loadHTML(this.currentHTML);
        this.componentsPanel.buildDOMTree(this.currentHTML);
      }
    } catch (e) {
      console.warn('包裹元素失败:', e);
    }
  }

  // 显示编辑 HTML 模态框
  _showEditHTMLModal(selector) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.currentHTML, 'text/html');

    try {
      const el = this._findElement(doc, selector);
      if (!el) return;

      const overlay = document.getElementById('modal-overlay');
      const title = document.getElementById('modal-title');
      const body = document.getElementById('modal-body');
      const footer = document.getElementById('modal-footer');

      title.textContent = '编辑 HTML — ' + selector;

      body.innerHTML = `
        <textarea id="modal-html-editor">${this._escapeHTML(el.outerHTML)}</textarea>
      `;

      footer.innerHTML = `
        <button class="btn-secondary" id="modal-cancel">取消</button>
        <button class="btn-primary" id="modal-confirm">应用修改</button>
      `;

      overlay.classList.remove('hidden');

      document.getElementById('modal-close').onclick = () => overlay.classList.add('hidden');
      document.getElementById('modal-cancel').onclick = () => overlay.classList.add('hidden');
      document.getElementById('modal-confirm').onclick = () => {
        const newHTML = document.getElementById('modal-html-editor').value;

        const tempDoc = new DOMParser().parseFromString('<div>' + newHTML + '</div>', 'text/html');
        const newEl = tempDoc.body.firstChild;

        if (newEl && el.parentNode) {
          el.parentNode.replaceChild(doc.adoptNode(newEl), el);
          this.currentHTML = this._serializeDocument(doc);
          this.canvasBridge.loadHTML(this.currentHTML);
          this.componentsPanel.buildDOMTree(this.currentHTML);
        }

        overlay.classList.add('hidden');
        this.fileManager.markDirty();
      };
    } catch (e) {
      console.warn('编辑HTML失败:', e);
    }
  }

  // ===== 辅助方法 =====

  // 在文档中查找元素
  _findElement(doc, selector) {
    try {
      return doc.querySelector(selector);
    } catch (e) {
      // 如果选择器匹配失败，尝试更宽松的匹配
      const parts = selector.split(' > ');
      const lastPart = parts[parts.length - 1];
      return doc.querySelector(lastPart);
    }
  }

  // 序列化文档为 HTML 字符串
  _serializeDocument(doc) {
    const doctype = '<!DOCTYPE html>\n';
    const html = doc.documentElement.outerHTML;
    return doctype + html;
  }

  // HTML 转义
  _escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 更新面包屑
  _updateBreadcrumb(selector) {
    const bc = document.getElementById('breadcrumb');
    if (!selector) {
      bc.innerHTML = '<span class="breadcrumb-item">body</span>';
      return;
    }

    const parts = selector.split(' > ');
    bc.innerHTML = parts.map((p, i) => {
      const pathSoFar = parts.slice(0, i + 1).join(' > ');
      return `<span class="breadcrumb-item" data-selector="${pathSoFar}" title="${pathSoFar}">${p}</span>`;
    }).join(' <span style="color:#6c7086">›</span> ');

    // 点击面包屑导航
    bc.querySelectorAll('.breadcrumb-item').forEach(item => {
      item.addEventListener('click', () => {
        const sel = item.dataset.selector;
        this.canvasBridge.highlightElement(sel);
      });
    });
  }

  // 更新状态栏
  _updateStatusBar() {
    document.getElementById('status-element').textContent =
      this.selectedSelector || '未选中元素';

    document.getElementById('status-file').textContent =
      this.fileManager.isDirty ? '● 已修改' : '已保存';
  }
}

// ===== 启动编辑器 =====
let editor;
document.addEventListener('DOMContentLoaded', () => {
  editor = new Editor();
});

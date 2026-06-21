// ===== 画布通信桥 =====
// 管理 iframe 画布与编辑器之间的通信

class CanvasBridge {
  constructor(iframeId) {
    this.iframe = document.getElementById(iframeId);
    this.currentHTML = '';
    this.selectedSelector = null;
    this.selectedElementInfo = null;
    this.canvasMode = 'select'; // 'select' | 'edit' | 'move'
    this.listeners = {};
    this.zoomLevel = 1;

    this._initMessageListener();
  }

  // 注册事件监听
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // 触发事件
  _emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  // 初始化 postMessage 监听
  _initMessageListener() {
    window.addEventListener('message', (e) => {
      const msg = e.data;
      if (!msg || !msg.type) return;

      switch (msg.type) {
        case 'element-selected':
          this.selectedElementInfo = msg.info;
          this.selectedSelector = msg.selector;
          this._emit('elementSelected', msg.info);
          break;

        case 'element-modified':
          this._emit('elementModified', msg);
          break;

        case 'element-moved':
          this._emit('elementMoved', msg);
          break;

        case 'canvas-clicked':
          this._emit('canvasClicked', msg);
          break;

        case 'text-edited':
          this._emit('textEdited', msg);
          break;
      }
    });
  }

  // 加载 HTML 到画布
  loadHTML(html) {
    this.currentHTML = html;

    // 注入编辑器脚本到 HTML
    const editorScript = this._getInjectedScript();
    const modifiedHTML = this._injectScriptIntoHTML(html, editorScript);

    this.iframe.srcdoc = modifiedHTML;
  }

  // 刷新画布（重新注入源码）
  refresh() {
    if (this.currentHTML) {
      this.loadHTML(this.currentHTML);
    }
  }

  // 将 HTML 源码和编辑器脚本合并
  _injectScriptIntoHTML(html, script) {
    // 在 </body> 前注入脚本
    if (html.includes('</body>')) {
      return html.replace('</body>', `<script>${script}</script></body>`);
    }
    // 如果没有 body，追加到末尾
    return html + `\n<script>${script}</script>`;
  }

  // 生成注入到 iframe 的编辑器脚本
  _getInjectedScript() {
    const canvasMode = this.canvasMode;
    return `
(function() {
  'use strict';

  let selectedElement = null;
  let highlightOverlay = null;
  let mode = '${canvasMode}';

  // 创建高亮层
  function createHighlight() {
    if (highlightOverlay) return;
    highlightOverlay = document.createElement('div');
    highlightOverlay.id = '__editor_highlight__';
    highlightOverlay.style.cssText = 'position:fixed;pointer-events:none;z-index:99999;border:2px solid #007aff;background:rgba(0,122,255,0.08);transition:all 0.15s ease;display:none;';
    document.body.appendChild(highlightOverlay);
  }

  // 更新高亮位置
  function updateHighlight(el) {
    if (!highlightOverlay) createHighlight();
    const rect = el.getBoundingClientRect();
    highlightOverlay.style.display = 'block';
    highlightOverlay.style.left = rect.left + 'px';
    highlightOverlay.style.top = rect.top + 'px';
    highlightOverlay.style.width = rect.width + 'px';
    highlightOverlay.style.height = rect.height + 'px';
  }

  // 隐藏高亮
  function hideHighlight() {
    if (highlightOverlay) {
      highlightOverlay.style.display = 'none';
    }
  }

  // 获取元素的选择器路径
  function getElementSelector(el) {
    if (el === document.body) return 'body';
    if (el === document.documentElement) return 'html';

    const path = [];
    let current = el;
    while (current && current !== document.body && current !== document.documentElement) {
      let selector = current.tagName.toLowerCase();
      if (current.id) {
        selector = '#' + current.id;
        path.unshift(selector);
        break;
      }
      if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\\s+/).filter(c => c && !c.startsWith('__editor_'));
        if (classes.length > 0) {
          selector += '.' + classes.slice(0, 2).join('.');
        }
      }
      // 添加 nth-child
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(s => s.tagName === current.tagName);
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          selector += ':nth-child(' + index + ')';
        }
      }
      path.unshift(selector);
      current = current.parentElement;
    }
    return path.join(' > ');
  }

  // 获取元素详细信息
  function getElementInfo(el) {
    const attrs = {};
    if (el.attributes) {
      Array.from(el.attributes).forEach(attr => {
        if (!attr.name.startsWith('__')) {
          attrs[attr.name] = attr.value;
        }
      });
    }

    return {
      tagName: el.tagName.toLowerCase(),
      id: el.id || '',
      className: (typeof el.className === 'string') ? el.className.replace('__editor_selected__', '').trim() : '',
      textContent: (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) ? el.textContent.trim() : '',
      innerHTML: el.innerHTML,
      attributes: attrs,
      selector: getElementSelector(el),
      computedStyle: {
        display: getComputedStyle(el).display,
        width: getComputedStyle(el).width,
        height: getComputedStyle(el).height
      }
    };
  }

  // 选中元素
  function selectElement(el) {
    // 清除旧选中
    if (selectedElement) {
      selectedElement.classList.remove('__editor_selected__');
    }

    selectedElement = el;
    el.classList.add('__editor_selected__');
    updateHighlight(el);

    const info = getElementInfo(el);
    window.parent.postMessage({
      type: 'element-selected',
      info: info,
      selector: info.selector
    }, '*');
  }

  // 清除选中
  function clearSelection() {
    if (selectedElement) {
      selectedElement.classList.remove('__editor_selected__');
      selectedElement = null;
    }
    hideHighlight();
  }

  // 使元素可编辑
  function makeEditable(el) {
    el.contentEditable = 'true';
    el.focus();
    // 全选文本
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const onBlur = () => {
      el.contentEditable = 'false';
      el.removeEventListener('blur', onBlur);
      window.parent.postMessage({
        type: 'text-edited',
        selector: getElementSelector(el),
        newText: el.innerHTML
      }, '*');
    };
    el.addEventListener('blur', onBlur);
  }

  // 注入选中样式
  const style = document.createElement('style');
  style.textContent = '.__editor_selected__ { outline: 2px solid #007aff !important; outline-offset: 2px; }';
  document.head.appendChild(style);

  // 点击事件 — 选择元素
  document.addEventListener('click', function(e) {
    if (e.target.id === '__editor_highlight__') return;
    if (e.target.closest('#__editor_highlight__')) return;

    e.preventDefault();
    e.stopPropagation();

    if (mode === 'select') {
      selectElement(e.target);
    } else if (mode === 'edit') {
      e.target.contentEditable = 'true';
      e.target.focus();
    }
  }, true);

  // 双击 — 编辑文本
  document.addEventListener('dblclick', function(e) {
    if (e.target.id === '__editor_highlight__') return;
    e.preventDefault();
    e.stopPropagation();

    // 选中并进入编辑模式
    selectElement(e.target);
    makeEditable(e.target);
  }, true);

  // 鼠标悬停高亮
  document.addEventListener('mouseover', function(e) {
    if (e.target === document.body || e.target === document.documentElement) return;
    if (e.target.id === '__editor_highlight__') return;
    if (!selectedElement || e.target !== selectedElement) {
      if (mode === 'select' && !e.target.classList.contains('__editor_selected__')) {
        // 悬停预览
        updateHighlight(e.target);
      }
    }
  }, true);

  // 鼠标离开
  document.addEventListener('mouseout', function(e) {
    if (e.target === document.body) return;
    if (!selectedElement || e.target !== selectedElement) {
      // 恢复选中高亮
      if (selectedElement) {
        updateHighlight(selectedElement);
      }
    }
  }, true);

  // 点击空白区域取消选中
  document.addEventListener('click', function(e) {
    if (e.target === document.body || e.target === document.documentElement) {
      clearSelection();
      window.parent.postMessage({
        type: 'canvas-clicked',
        target: e.target.tagName.toLowerCase()
      }, '*');
    }
  });

  // 监听来自编辑器的消息
  window.addEventListener('message', function(e) {
    const msg = e.data;
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case 'editor:highlight-element':
        const el = document.querySelector(msg.selector);
        if (el) {
          selectElement(el);
        }
        break;

      case 'editor:set-mode':
        mode = msg.mode;
        break;

      case 'editor:scroll-to':
        const target = document.querySelector(msg.selector);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        break;
    }
  });

  createHighlight();
})();
`;
  }

  // 设置画布模式
  setMode(mode) {
    this.canvasMode = mode;
    this._sendToIframe({ type: 'editor:set-mode', mode });
  }

  // 高亮 iframe 中的元素
  highlightElement(selector) {
    this._sendToIframe({ type: 'editor:highlight-element', selector });
  }

  // 滚动到元素
  scrollToElement(selector) {
    this._sendToIframe({ type: 'editor:scroll-to', selector });
  }

  // 发送消息到 iframe
  _sendToIframe(msg) {
    try {
      this.iframe.contentWindow.postMessage(msg, '*');
    } catch (e) {
      // iframe 可能还未加载完成
    }
  }

  // 设置缩放
  setZoom(level) {
    this.zoomLevel = level;
    this.iframe.style.transform = `scale(${level})`;
    this.iframe.style.transformOrigin = 'top center';
  }

  // 获取选中元素信息
  getSelectedInfo() {
    return this.selectedElementInfo;
  }
}

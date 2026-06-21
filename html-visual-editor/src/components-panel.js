// ===== 左侧组件面板 + DOM 树 =====

class ComponentsPanel {
  constructor() {
    this.container = document.getElementById('component-categories');
    this.domTreeContainer = document.getElementById('dom-tree');
    this.selectedDOMNode = null;
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

  // 初始化组件面板
  initComponentLibrary() {
    const categories = getComponentsByCategory();
    this.container.innerHTML = '';

    Object.keys(categories).forEach(catName => {
      const catDiv = document.createElement('div');
      catDiv.className = 'comp-category';

      const titleEl = document.createElement('div');
      titleEl.className = 'cat-title';
      titleEl.textContent = catName;
      catDiv.appendChild(titleEl);

      const grid = document.createElement('div');
      grid.className = 'cat-grid';

      categories[catName].forEach(comp => {
        const item = document.createElement('div');
        item.className = 'comp-item';
        item.draggable = true;
        item.innerHTML = `
          <span class="comp-icon">${comp.icon}</span>
          <span class="comp-label">${comp.name}</span>
        `;

        // 拖拽开始
        item.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('application/component-id', comp.id);
          e.dataTransfer.setData('text/plain', comp.html + '\n<style>' + (comp.css || '') + '</style>');
          e.dataTransfer.effectAllowed = 'copy';
          item.style.opacity = '0.5';
        });

        item.addEventListener('dragend', () => {
          item.style.opacity = '1';
        });

        grid.appendChild(item);
      });

      catDiv.appendChild(grid);
      this.container.appendChild(catDiv);
    });
  }

  // 构建 DOM 树
  buildDOMTree(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    this.domTreeContainer.innerHTML = '';

    // 从 html 元素开始构建
    const htmlEl = doc.documentElement;
    if (htmlEl) {
      this.domTreeContainer.appendChild(this._buildDOMNode(htmlEl, 0));
    }
  }

  // 递归构建 DOM 树节点
  _buildDOMNode(element, depth) {
    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'dom-node';
    nodeDiv.dataset.selector = this._getPathSelector(element, depth);

    const expandBtn = document.createElement('span');
    expandBtn.className = 'dom-expand';

    const hasChildren = element.children && element.children.length > 0;
    const hasText = element.childNodes && Array.from(element.childNodes).some(
      n => n.nodeType === 3 && n.textContent.trim()
    );

    // 标签名
    const tagSpan = document.createElement('span');
    tagSpan.className = 'tag';
    tagSpan.textContent = element.tagName.toLowerCase();

    // ID
    let idSpan = null;
    if (element.id) {
      idSpan = document.createElement('span');
      idSpan.className = 'id-attr';
      idSpan.textContent = ` #${element.id}`;
    }

    // Class
    let classSpan = null;
    if (element.className && typeof element.className === 'string') {
      const classes = element.className.trim();
      if (classes) {
        classSpan = document.createElement('span');
        classSpan.className = 'class-attr';
        classSpan.textContent = ` .${classes.split(/\s+/).slice(0, 2).join('.')}${classes.split(/\s+/).length > 2 ? '…' : ''}`;
      }
    }

    // 文本预览
    let textPreview = null;
    if (!hasChildren && hasText) {
      const text = element.childNodes[0]?.textContent?.trim();
      if (text && text.length > 0) {
        textPreview = document.createElement('span');
        textPreview.className = 'text-preview';
        textPreview.textContent = ` "${text.substring(0, 30)}${text.length > 30 ? '…' : ''}"`;
      }
    }

    // 展开/折叠
    if (hasChildren) {
      expandBtn.textContent = '▼';
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const childrenDiv = nodeDiv.querySelector(':scope > .dom-children');
        if (childrenDiv) {
          const isHidden = childrenDiv.style.display === 'none';
          childrenDiv.style.display = isHidden ? '' : 'none';
          expandBtn.textContent = isHidden ? '▼' : '▶';
        }
      });
    } else {
      expandBtn.style.visibility = 'hidden';
    }

    // 组装标签行
    const tagLine = document.createElement('div');
    tagLine.style.cssText = 'padding-left:' + (depth * 0) + 'px;';
    tagLine.appendChild(expandBtn);
    tagLine.appendChild(tagSpan);
    if (idSpan) tagLine.appendChild(idSpan);
    if (classSpan) tagLine.appendChild(classSpan);
    if (textPreview) tagLine.appendChild(textPreview);

    nodeDiv.appendChild(tagLine);

    // 点击选中
    nodeDiv.addEventListener('click', (e) => {
      e.stopPropagation();
      this._selectNode(nodeDiv, element);
    });

    // 右键菜单
    nodeDiv.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._selectNode(nodeDiv, element);
      this._emit('contextMenu', { x: e.clientX, y: e.clientY, element, selector: nodeDiv.dataset.selector });
    });

    // 子节点
    if (hasChildren) {
      const childrenDiv = document.createElement('div');
      childrenDiv.className = 'dom-children';
      Array.from(element.children).forEach(child => {
        childrenDiv.appendChild(this._buildDOMNode(child, depth + 1));
      });
      nodeDiv.appendChild(childrenDiv);
    }

    return nodeDiv;
  }

  // 获取元素的选择器路径
  _getPathSelector(element, depth) {
    const parts = [];
    let current = element;
    while (current && current.tagName && current.tagName !== 'HTML') {
      let selector = current.tagName.toLowerCase();
      if (current.id) {
        selector = '#' + current.id;
        parts.unshift(selector);
        break;
      }
      if (current.className && typeof current.className === 'string') {
        const classes = current.className.trim().split(/\s+/).filter(c => c);
        if (classes.length > 0) {
          selector += '.' + classes[0];
        }
      }
      parts.unshift(selector);
      current = current.parentElement;
    }
    return parts.join(' > ');
  }

  // 选中 DOM 树节点
  _selectNode(nodeDiv, element) {
    // 清除旧选中
    if (this.selectedDOMNode) {
      this.selectedDOMNode.classList.remove('selected');
    }
    this.selectedDOMNode = nodeDiv;
    nodeDiv.classList.add('selected');

    const selector = nodeDiv.dataset.selector;
    this._emit('elementSelected', { element, selector });
  }

  // 高亮某个选择器对应的节点
  highlightBySelector(selector) {
    // 查找对应 DOM 节点
    const node = this.domTreeContainer.querySelector(`[data-selector="${selector}"]`);
    if (node) {
      if (this.selectedDOMNode) {
        this.selectedDOMNode.classList.remove('selected');
      }
      this.selectedDOMNode = node;
      node.classList.add('selected');
      node.scrollIntoView({ block: 'nearest' });
    }
  }
}

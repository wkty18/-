// ===== 右侧属性 + CSS 面板 =====

class PropertiesPanel {
  constructor() {
    this.currentElement = null;
    this.currentSelector = null;
    this.listeners = {};
    this._initControls();
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

  // 初始化控件事件
  _initControls() {
    // 属性控件
    ['prop-tag', 'prop-id', 'prop-class', 'prop-text', 'prop-href',
     'prop-src', 'prop-alt', 'prop-placeholder', 'prop-type'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this._onPropertyChanged());
        el.addEventListener('change', () => this._onPropertyChanged());
      }
    });

    // 样式控件
    const styleInputs = [
      'style-display', 'style-width', 'style-height',
      'style-margin-top', 'style-margin-right', 'style-margin-bottom', 'style-margin-left',
      'style-padding-top', 'style-padding-right', 'style-padding-bottom', 'style-padding-left',
      'style-font-family', 'style-font-size', 'style-font-weight', 'style-color',
      'style-line-height', 'style-text-align', 'style-bg-color', 'style-bg-image',
      'style-bg-color-hex', 'style-border-width', 'style-border-color', 'style-border-style',
      'style-border-radius', 'style-shadow-x', 'style-shadow-y', 'style-shadow-blur',
      'style-shadow-spread', 'style-shadow-color', 'style-shadow-color-hex',
      'style-opacity', 'style-transition', 'style-font-size-unit', 'style-color-hex'
    ];

    styleInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this._onStyleChanged());
        el.addEventListener('change', () => this._onStyleChanged());
      }
    });

    // 颜色选择器联动
    this._bindColorPicker('style-color', 'style-color-hex');
    this._bindColorPicker('style-bg-color', 'style-bg-color-hex');
    this._bindColorPicker('style-border-color', 'style-border-color-hex');
    this._bindColorPicker('style-shadow-color', 'style-shadow-color-hex');

    // 圆角滑块
    const borderRadiusSlider = document.getElementById('style-border-radius');
    if (borderRadiusSlider) {
      borderRadiusSlider.addEventListener('input', () => {
        document.getElementById('border-radius-val').textContent = borderRadiusSlider.value + 'px';
        this._onStyleChanged();
      });
    }

    // 透明度滑块
    const opacitySlider = document.getElementById('style-opacity');
    if (opacitySlider) {
      opacitySlider.addEventListener('input', () => {
        document.getElementById('opacity-val').textContent = opacitySlider.value + '%';
        this._onStyleChanged();
      });
    }

    // 阴影预设
    const shadowPreset = document.getElementById('style-shadow-preset');
    if (shadowPreset) {
      shadowPreset.addEventListener('change', () => {
        const value = shadowPreset.value;
        if (value) {
          // 解析预设值
          const match = value.match(/^([\d.]+)px\s+([\d.]+)px\s+([\d.]+)px\s+(.+)$/);
          if (match) {
            document.getElementById('style-shadow-x').value = match[1];
            document.getElementById('style-shadow-y').value = match[2];
            document.getElementById('style-shadow-blur').value = match[3];
            document.getElementById('style-shadow-spread').value = '0';
            document.getElementById('style-shadow-color-hex').value = match[4];
            document.getElementById('style-shadow-color').value = this._toHexColor(match[4]);
          }
          this._onStyleChanged();
        }
      });
    }

    // 渐变预设
    const gradientPreset = document.getElementById('style-bg-gradient-preset');
    if (gradientPreset) {
      gradientPreset.addEventListener('change', () => {
        this._onStyleChanged();
      });
    }

    // 添加自定义属性
    const btnAddAttr = document.getElementById('btn-add-attr');
    if (btnAddAttr) {
      btnAddAttr.addEventListener('click', () => this._addCustomAttr());
    }

    // 添加 CSS 变量
    const btnAddVar = document.getElementById('btn-add-css-var');
    if (btnAddVar) {
      btnAddVar.addEventListener('click', () => this._addCSSVar());
    }
  }

  _bindColorPicker(colorId, hexId) {
    const colorInput = document.getElementById(colorId);
    const hexInput = document.getElementById(hexId);
    if (!colorInput || !hexInput) return;

    colorInput.addEventListener('input', () => {
      hexInput.value = colorInput.value;
      this._onStyleChanged();
    });

    hexInput.addEventListener('input', () => {
      const val = hexInput.value;
      if (/^#[0-9a-fA-F]{6}$/.test(val) || /^#[0-9a-fA-F]{3}$/.test(val)) {
        colorInput.value = val;
      }
      this._onStyleChanged();
    });
  }

  _toHexColor(str) {
    // 尝试从 rgba 字符串提取颜色
    if (str.startsWith('#')) return str;
    if (str.startsWith('rgb')) {
      const match = str.match(/[\d.]+/g);
      if (match && match.length >= 3) {
        return '#' + match.slice(0, 3).map(x => {
          const hex = parseInt(x).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        }).join('');
      }
    }
    return '#000000';
  }

  // 当选中元素时，加载其属性到面板
  loadElement(elementInfo, selector) {
    this.currentElement = elementInfo;
    this.currentSelector = selector;

    if (!elementInfo) {
      this._clearAll();
      return;
    }

    const { tagName, id, className, textContent, attributes } = elementInfo;

    // 基础属性
    document.getElementById('prop-tag').value = tagName || '';
    document.getElementById('prop-id').value = id || '';
    document.getElementById('prop-class').value = className || '';
    document.getElementById('prop-text').value = textContent || '';

    // 常用属性 — 根据标签名显示/隐藏
    const isA = tagName === 'a';
    const isImg = tagName === 'img';
    const isInput = tagName === 'input';
    const isTextarea = tagName === 'textarea';

    document.getElementById('prop-href-row').style.display = isA ? '' : 'none';
    document.getElementById('prop-src-row').style.display = isImg ? '' : 'none';
    document.getElementById('prop-alt-row').style.display = isImg ? '' : 'none';
    document.getElementById('prop-placeholder-row').style.display = (isInput || isTextarea) ? '' : 'none';
    document.getElementById('prop-type-row').style.display = isInput ? '' : 'none';

    if (attributes) {
      if (isA) document.getElementById('prop-href').value = attributes.href || '';
      if (isImg) {
        document.getElementById('prop-src').value = attributes.src || '';
        document.getElementById('prop-alt').value = attributes.alt || '';
      }
      if (isInput) {
        document.getElementById('prop-placeholder').value = attributes.placeholder || '';
        document.getElementById('prop-type').value = attributes.type || 'text';
      }
    }

    // 自定义属性
    this._renderCustomAttrs(attributes || {});

    // 样式 — 从元素信息中加载
    this._loadStyles(elementInfo);
  }

  _loadStyles(elementInfo) {
    // 尝试从 computedStyle 或 inline style 加载
    // 这里从当前选中元素的 style 属性解析
    const styles = {};
    if (elementInfo.attributes && elementInfo.attributes.style) {
      const styleStr = elementInfo.attributes.style;
      styleStr.split(';').forEach(rule => {
        const [prop, val] = rule.split(':').map(s => s.trim());
        if (prop && val) {
          styles[prop] = val;
        }
      });
    }

    // 填充到控件
    document.getElementById('style-display').value = styles.display || '';
    document.getElementById('style-width').value = styles.width || '';
    document.getElementById('style-height').value = styles.height || '';
    document.getElementById('style-margin-top').value = styles['margin-top'] || '';
    document.getElementById('style-margin-right').value = styles['margin-right'] || '';
    document.getElementById('style-margin-bottom').value = styles['margin-bottom'] || '';
    document.getElementById('style-margin-left').value = styles['margin-left'] || '';
    document.getElementById('style-padding-top').value = styles['padding-top'] || '';
    document.getElementById('style-padding-right').value = styles['padding-right'] || '';
    document.getElementById('style-padding-bottom').value = styles['padding-bottom'] || '';
    document.getElementById('style-padding-left').value = styles['padding-left'] || '';
    document.getElementById('style-font-family').value = styles['font-family'] || '';
    document.getElementById('style-font-size').value = (styles['font-size'] || '').replace(/[^0-9.]/g, '');
    document.getElementById('style-font-weight').value = styles['font-weight'] || '';
    document.getElementById('style-color-hex').value = styles.color || '';
    document.getElementById('style-color').value = this._toHexColor(styles.color || '#000000');
    document.getElementById('style-line-height').value = styles['line-height'] || '';
    document.getElementById('style-text-align').value = styles['text-align'] || '';

    // 背景
    document.getElementById('style-bg-color-hex').value = styles['background-color'] || '';
    document.getElementById('style-bg-color').value = this._toHexColor(styles['background-color'] || '#ffffff');
    document.getElementById('style-bg-image').value = styles['background-image'] || '';
    document.getElementById('style-bg-gradient-preset').value = '';

    // 边框
    document.getElementById('style-border-width').value = styles['border-width'] || '';
    document.getElementById('style-border-color-hex').value = styles['border-color'] || '';
    document.getElementById('style-border-color').value = this._toHexColor(styles['border-color'] || '#000000');
    document.getElementById('style-border-style').value = styles['border-style'] || '';
    document.getElementById('style-border-radius').value = (styles['border-radius'] || '0').replace(/[^0-9.]/g, '');
    document.getElementById('border-radius-val').textContent = (styles['border-radius'] || '0px');

    // 阴影
    document.getElementById('style-shadow-x').value = styles['--shadow-x'] || '';
    document.getElementById('style-shadow-y').value = styles['--shadow-y'] || '';
    document.getElementById('style-shadow-blur').value = styles['--shadow-blur'] || '';
    document.getElementById('style-shadow-spread').value = styles['--shadow-spread'] || '';
    document.getElementById('style-shadow-color-hex').value = '';
    document.getElementById('style-shadow-color').value = '#000000';
    document.getElementById('style-shadow-preset').value = '';

    // 效果
    document.getElementById('style-opacity').value = (parseFloat(styles.opacity) || 1) * 100;
    document.getElementById('opacity-val').textContent = ((parseFloat(styles.opacity) || 1) * 100) + '%';
    document.getElementById('style-transition').value = styles.transition || '';
  }

  _clearAll() {
    document.getElementById('prop-tag').value = '';
    document.getElementById('prop-id').value = '';
    document.getElementById('prop-class').value = '';
    document.getElementById('prop-text').value = '';
  }

  _renderCustomAttrs(attributes) {
    const container = document.getElementById('custom-attrs');
    container.innerHTML = '';

    // 过滤掉 style, class, id, href, src, alt, placeholder, type
    const customKeys = Object.keys(attributes).filter(k =>
      !['style', 'class', 'id', 'href', 'src', 'alt', 'placeholder', 'type'].includes(k)
    );

    customKeys.forEach(key => {
      const pair = document.createElement('div');
      pair.className = 'attr-pair';
      pair.innerHTML = `
        <input type="text" value="${this._escapeAttr(key)}" placeholder="属性名" class="attr-name">
        <input type="text" value="${this._escapeAttr(attributes[key])}" placeholder="值" class="attr-value">
        <button class="attr-delete" title="删除">×</button>
      `;

      pair.querySelector('.attr-delete').addEventListener('click', () => {
        pair.remove();
        this._onPropertyChanged();
      });
      pair.querySelector('.attr-name').addEventListener('input', () => this._onPropertyChanged());
      pair.querySelector('.attr-value').addEventListener('input', () => this._onPropertyChanged());

      container.appendChild(pair);
    });
  }

  _escapeAttr(str) {
    return (str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  _addCustomAttr() {
    const container = document.getElementById('custom-attrs');
    const pair = document.createElement('div');
    pair.className = 'attr-pair';
    pair.innerHTML = `
      <input type="text" value="" placeholder="属性名" class="attr-name">
      <input type="text" value="" placeholder="值" class="attr-value">
      <button class="attr-delete" title="删除">×</button>
    `;

    pair.querySelector('.attr-delete').addEventListener('click', () => {
      pair.remove();
      this._onPropertyChanged();
    });
    pair.querySelector('.attr-name').addEventListener('input', () => this._onPropertyChanged());
    pair.querySelector('.attr-value').addEventListener('input', () => this._onPropertyChanged());

    container.appendChild(pair);
  }

  // 获取当前面板中的所有修改
  getPropertyChanges() {
    const changes = {
      tagName: document.getElementById('prop-tag').value,
      id: document.getElementById('prop-id').value,
      className: document.getElementById('prop-class').value,
      textContent: document.getElementById('prop-text').value,
    };

    // 常用属性
    const tagName = changes.tagName;
    if (tagName === 'a') changes.href = document.getElementById('prop-href').value;
    if (tagName === 'img') {
      changes.src = document.getElementById('prop-src').value;
      changes.alt = document.getElementById('prop-alt').value;
    }
    if (tagName === 'input' || tagName === 'textarea') {
      changes.placeholder = document.getElementById('prop-placeholder').value;
    }
    if (tagName === 'input') {
      changes.type = document.getElementById('prop-type').value;
    }

    // 自定义属性
    const customAttrs = {};
    document.querySelectorAll('#custom-attrs .attr-pair').forEach(pair => {
      const name = pair.querySelector('.attr-name').value.trim();
      const value = pair.querySelector('.attr-value').value.trim();
      if (name) customAttrs[name] = value;
    });
    changes.customAttributes = customAttrs;

    // 样式
    changes.styles = this._collectStyles();

    return changes;
  }

  _collectStyles() {
    const styles = {};

    const display = document.getElementById('style-display').value;
    if (display) styles.display = display;

    const width = document.getElementById('style-width').value;
    if (width) styles.width = width;

    const height = document.getElementById('style-height').value;
    if (height) styles.height = height;

    // Margin
    ['top', 'right', 'bottom', 'left'].forEach(side => {
      const val = document.getElementById('style-margin-' + side).value;
      if (val) styles['margin-' + side] = val;
    });

    // Padding
    ['top', 'right', 'bottom', 'left'].forEach(side => {
      const val = document.getElementById('style-padding-' + side).value;
      if (val) styles['padding-' + side] = val;
    });

    // 文字
    const fontFamily = document.getElementById('style-font-family').value;
    if (fontFamily) styles['font-family'] = fontFamily;

    const fontSize = document.getElementById('style-font-size').value;
    if (fontSize) {
      const unit = document.getElementById('style-font-size-unit').value;
      styles['font-size'] = fontSize + unit;
    }

    const fontWeight = document.getElementById('style-font-weight').value;
    if (fontWeight) styles['font-weight'] = fontWeight;

    const color = document.getElementById('style-color-hex').value;
    if (color) styles.color = color;

    const lineHeight = document.getElementById('style-line-height').value;
    if (lineHeight) styles['line-height'] = lineHeight;

    const textAlign = document.getElementById('style-text-align').value;
    if (textAlign) styles['text-align'] = textAlign;

    // 背景
    const bgColor = document.getElementById('style-bg-color-hex').value;
    if (bgColor) styles['background-color'] = bgColor;

    const bgImage = document.getElementById('style-bg-image').value;
    if (bgImage) styles['background-image'] = bgImage;

    const gradient = document.getElementById('style-bg-gradient-preset').value;
    if (gradient) styles['background'] = gradient;

    // 边框
    const borderWidth = document.getElementById('style-border-width').value;
    if (borderWidth) styles['border-width'] = borderWidth;

    const borderColor = document.getElementById('style-border-color-hex').value;
    if (borderColor) styles['border-color'] = borderColor;

    const borderStyle = document.getElementById('style-border-style').value;
    if (borderStyle) styles['border-style'] = borderStyle;

    // 如果有边框三要素，合成 border
    if (borderWidth && borderStyle && borderColor) {
      styles.border = borderWidth + ' ' + borderStyle + ' ' + borderColor;
    }

    const borderRadius = document.getElementById('style-border-radius').value;
    if (borderRadius && borderRadius !== '0') styles['border-radius'] = borderRadius + 'px';

    // 阴影
    const sx = document.getElementById('style-shadow-x').value || '0';
    const sy = document.getElementById('style-shadow-y').value || '0';
    const sblur = document.getElementById('style-shadow-blur').value || '0';
    const sspread = document.getElementById('style-shadow-spread').value || '0';
    const scolor = document.getElementById('style-shadow-color-hex').value || 'rgba(0,0,0,0.1)';
    if (sx !== '0' || sy !== '0' || sblur !== '0') {
      styles['box-shadow'] = `${sx} ${sy} ${sblur} ${sspread} ${scolor}`;
    }

    // 效果
    const opacity = document.getElementById('style-opacity').value;
    if (opacity && opacity !== '100') styles.opacity = parseFloat(opacity) / 100;

    const transition = document.getElementById('style-transition').value;
    if (transition) styles.transition = transition;

    return styles;
  }

  _onPropertyChanged() {
    if (!this.currentSelector) return;
    const changes = this.getPropertyChanges();
    this._emit('propertiesChanged', {
      selector: this.currentSelector,
      changes
    });
  }

  _onStyleChanged() {
    if (!this.currentSelector) return;
    const changes = this.getPropertyChanges();
    this._emit('propertiesChanged', {
      selector: this.currentSelector,
      changes
    });
  }

  // ===== CSS 变量编辑器 =====
  loadCSSVariables(htmlString) {
    const container = document.getElementById('css-vars-list');
    if (!container) return;
    container.innerHTML = '';

    // 解析 :root 块
    const rootMatch = htmlString.match(/:root\s*\{([^}]+)\}/);
    if (!rootMatch) return;

    const varBlock = rootMatch[1];
    const varRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
    let match;

    while ((match = varRegex.exec(varBlock)) !== null) {
      const varName = match[1].trim();
      const varValue = match[2].trim();
      this._renderCSSVarItem(container, varName, varValue);
    }
  }

  _renderCSSVarItem(container, name, value) {
    const item = document.createElement('div');
    item.className = 'css-var-item';
    item.dataset.varName = name;

    const nameEl = document.createElement('span');
    nameEl.className = 'var-name';
    nameEl.textContent = '--' + name;

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.className = 'var-value';
    valueInput.value = value;

    // 如果是颜色值，显示颜色预览
    let colorPreview = null;
    if (value.startsWith('#') || value.startsWith('rgb')) {
      colorPreview = document.createElement('input');
      colorPreview.type = 'color';
      colorPreview.className = 'var-color';
      colorPreview.value = this._toHexColor(value);
      colorPreview.addEventListener('input', () => {
        valueInput.value = colorPreview.value;
        this._onCSSVarChanged();
      });
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'var-delete';
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', () => {
      item.remove();
      this._onCSSVarChanged();
    });

    valueInput.addEventListener('input', () => this._onCSSVarChanged());

    item.appendChild(nameEl);
    if (colorPreview) item.appendChild(colorPreview);
    item.appendChild(valueInput);
    item.appendChild(deleteBtn);

    container.appendChild(item);
  }

  _addCSSVar() {
    const container = document.getElementById('css-vars-list');
    this._renderCSSVarItem(container, 'new-var', '#000000');
    this._onCSSVarChanged();
  }

  _onCSSVarChanged() {
    const vars = {};
    document.querySelectorAll('.css-var-item').forEach(item => {
      const name = item.dataset.varName || item.querySelector('.var-name').textContent.replace('--', '');
      const valueInput = item.querySelector('.var-value');
      if (valueInput) {
        vars[name] = valueInput.value;
      }
    });
    this._emit('cssVarsChanged', vars);
  }
}

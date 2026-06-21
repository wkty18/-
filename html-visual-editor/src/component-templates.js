// ===== 组件模板库 =====
// 每个模板包含：id, name, icon, category, html, css (可选)

const COMPONENT_TEMPLATES = [
  // ========== 布局 ==========
  {
    id: 'flex-container',
    name: 'Flex 容器',
    icon: '⬜',
    category: '布局',
    html: '<div class="flex-container">\n  <div>项目 1</div>\n  <div>项目 2</div>\n  <div>项目 3</div>\n</div>',
    css: `.flex-container {\n  display: flex;\n  gap: 16px;\n  padding: 16px;\n  background: #f5f5f7;\n  border-radius: 12px;\n}`
  },
  {
    id: 'grid-container',
    name: 'Grid 容器',
    icon: '🔲',
    category: '布局',
    html: '<div class="grid-container">\n  <div>项目 1</div>\n  <div>项目 2</div>\n  <div>项目 3</div>\n  <div>项目 4</div>\n</div>',
    css: `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n  padding: 16px;\n}`
  },
  {
    id: 'section-block',
    name: 'Section 区块',
    icon: '📐',
    category: '布局',
    html: '<section class="section-block">\n  <h2>区块标题</h2>\n  <p>这是区块的描述文字，介绍这个区域的内容。</p>\n</section>',
    css: `.section-block {\n  padding: 48px 24px;\n  max-width: 800px;\n  margin: 0 auto;\n}\n.section-block h2 {\n  font-size: 2rem;\n  font-weight: 700;\n  margin-bottom: 12px;\n}\n.section-block p {\n  color: #86868b;\n  line-height: 1.6;\n}`
  },

  // ========== 文本 ==========
  {
    id: 'heading',
    name: '标题',
    icon: '🔤',
    category: '文本',
    html: '<h1>这是一个标题</h1>',
    css: `h1 {\n  font-size: 2rem;\n  font-weight: 700;\n  color: #1d1d1f;\n  margin-bottom: 8px;\n}`
  },
  {
    id: 'paragraph',
    name: '段落',
    icon: '¶',
    category: '文本',
    html: '<p>这是一段示例文本。你可以双击编辑这段文字，修改成你想要的内容。</p>',
    css: `p {\n  font-size: 16px;\n  line-height: 1.6;\n  color: #1d1d1f;\n  margin-bottom: 12px;\n}`
  },
  {
    id: 'link',
    name: '链接',
    icon: '🔗',
    category: '文本',
    html: '<a href="https://example.com">点击访问</a>',
    css: `a {\n  color: #007aff;\n  text-decoration: none;\n}\na:hover {\n  text-decoration: underline;\n}`
  },

  // ========== 表单 ==========
  {
    id: 'button',
    name: '按钮',
    icon: '🔘',
    category: '表单',
    html: '<button class="btn">点击按钮</button>',
    css: `.btn {\n  display: inline-block;\n  padding: 12px 24px;\n  background: #007aff;\n  color: #fff;\n  border: none;\n  border-radius: 10px;\n  font-size: 15px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.btn:hover {\n  background: #0062cc;\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(0,122,255,0.3);\n}`
  },
  {
    id: 'input',
    name: '输入框',
    icon: '📝',
    category: '表单',
    html: '<input type="text" class="input-field" placeholder="请输入...">',
    css: `.input-field {\n  width: 100%;\n  max-width: 300px;\n  padding: 12px 16px;\n  background: #f5f5f7;\n  border: 1px solid #e5e5ea;\n  border-radius: 10px;\n  font-size: 15px;\n  outline: none;\n  transition: border-color 0.2s ease;\n}\n.input-field:focus {\n  border-color: #007aff;\n  background: #fff;\n}`
  },
  {
    id: 'select',
    name: '下拉框',
    icon: '📋',
    category: '表单',
    html: '<select class="select-field">\n  <option>选项 1</option>\n  <option>选项 2</option>\n  <option>选项 3</option>\n</select>',
    css: `.select-field {\n  padding: 12px 16px;\n  background: #f5f5f7;\n  border: 1px solid #e5e5ea;\n  border-radius: 10px;\n  font-size: 15px;\n  outline: none;\n  cursor: pointer;\n}`
  },
  {
    id: 'checkbox',
    name: '复选框',
    icon: '☑️',
    category: '表单',
    html: '<label class="checkbox-label">\n  <input type="checkbox">\n  <span>同意条款</span>\n</label>',
    css: `.checkbox-label {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  cursor: pointer;\n  font-size: 15px;\n}`
  },
  {
    id: 'switch',
    name: '开关',
    icon: '🔛',
    category: '表单',
    html: '<label class="switch">\n  <input type="checkbox">\n  <span class="switch-slider"></span>\n  <span class="switch-label">开启通知</span>\n</label>',
    css: `.switch {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  cursor: pointer;\n}\n.switch input { display: none; }\n.switch-slider {\n  width: 48px;\n  height: 28px;\n  background: #e5e5ea;\n  border-radius: 14px;\n  position: relative;\n  transition: background 0.3s ease;\n}\n.switch-slider::after {\n  content: '';\n  position: absolute;\n  top: 3px;\n  left: 3px;\n  width: 22px;\n  height: 22px;\n  background: #fff;\n  border-radius: 50%;\n  transition: transform 0.3s ease;\n  box-shadow: 0 1px 3px rgba(0,0,0,0.15);\n}\n.switch input:checked + .switch-slider {\n  background: #34c759;\n}\n.switch input:checked + .switch-slider::after {\n  transform: translateX(20px);\n}\n.switch-label {\n  font-size: 15px;\n}`
  },

  // ========== 媒体 ==========
  {
    id: 'image',
    name: '图片',
    icon: '🖼️',
    category: '媒体',
    html: '<img src="https://placehold.co/400x300/e5e5ea/86868b?text=图片" alt="示例图片" class="image">',
    css: `.image {\n  max-width: 100%;\n  border-radius: 12px;\n  display: block;\n}`
  },
  {
    id: 'icon-placeholder',
    name: '图标',
    icon: '⭐',
    category: '媒体',
    html: '<span class="icon">⭐</span>',
    css: `.icon {\n  font-size: 32px;\n  display: inline-block;\n}`
  },

  // ========== 装饰 ==========
  {
    id: 'glass-card',
    name: '玻璃卡片',
    icon: '🪟',
    category: '装饰',
    html: '<div class="glass-card">\n  <h3>玻璃卡片</h3>\n  <p>这是一个毛玻璃效果卡片</p>\n</div>',
    css: `.glass-card {\n  padding: 24px;\n  background: rgba(255,255,255,0.7);\n  backdrop-filter: blur(20px);\n  -webkit-backdrop-filter: blur(20px);\n  border: 1px solid rgba(255,255,255,0.6);\n  border-radius: 16px;\n  box-shadow: 0 8px 32px rgba(0,0,0,0.08);\n}\n.glass-card h3 {\n  font-size: 1.3rem;\n  font-weight: 700;\n  margin-bottom: 8px;\n}\n.glass-card p {\n  color: #86868b;\n}`
  },
  {
    id: 'badge',
    name: '徽章',
    icon: '🏷️',
    category: '装饰',
    html: '<span class="badge">新功能</span>',
    css: `.badge {\n  display: inline-block;\n  padding: 4px 12px;\n  background: linear-gradient(135deg, #007aff, #5856d6);\n  color: #fff;\n  font-size: 12px;\n  font-weight: 600;\n  border-radius: 20px;\n  letter-spacing: 0.3px;\n}`
  },
  {
    id: 'divider',
    name: '分割线',
    icon: '➖',
    category: '装饰',
    html: '<hr class="divider">',
    css: `.divider {\n  border: none;\n  height: 1px;\n  background: linear-gradient(to right, transparent, #e5e5ea, transparent);\n  margin: 24px 0;\n}`
  },

  // ========== 复合组件 ==========
  {
    id: 'navbar',
    name: '导航栏',
    icon: '🧭',
    category: '复合',
    html: '<nav class="navbar">\n  <div class="nav-brand">Logo</div>\n  <div class="nav-links">\n    <a href="#">首页</a>\n    <a href="#">关于</a>\n    <a href="#">服务</a>\n    <a href="#">联系</a>\n  </div>\n</nav>',
    css: `.navbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 32px;\n  background: rgba(255,255,255,0.8);\n  backdrop-filter: blur(20px);\n  -webkit-backdrop-filter: blur(20px);\n  border-bottom: 1px solid rgba(0,0,0,0.05);\n}\n.nav-brand {\n  font-size: 20px;\n  font-weight: 700;\n  color: #1d1d1f;\n}\n.nav-links {\n  display: flex;\n  gap: 24px;\n}\n.nav-links a {\n  color: #86868b;\n  text-decoration: none;\n  font-size: 15px;\n  font-weight: 500;\n  transition: color 0.2s ease;\n}\n.nav-links a:hover {\n  color: #1d1d1f;\n}`
  },
  {
    id: 'hero',
    name: 'Hero 区域',
    icon: '🚀',
    category: '复合',
    html: '<section class="hero">\n  <h1>让创意成为现实</h1>\n  <p>用最优雅的方式，构建令人惊叹的网页体验。</p>\n  <button class="hero-btn">开始使用</button>\n</section>',
    css: `.hero {\n  text-align: center;\n  padding: 80px 24px;\n  background: linear-gradient(180deg, #f5f5f7, #fff);\n}\n.hero h1 {\n  font-size: 3rem;\n  font-weight: 800;\n  background: linear-gradient(135deg, #007aff, #5856d6);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  margin-bottom: 16px;\n}\n.hero p {\n  font-size: 1.2rem;\n  color: #86868b;\n  margin-bottom: 32px;\n  max-width: 500px;\n  margin-left: auto;\n  margin-right: auto;\n}\n.hero-btn {\n  padding: 14px 36px;\n  background: #007aff;\n  color: #fff;\n  border: none;\n  border-radius: 12px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.hero-btn:hover {\n  background: #0062cc;\n  transform: translateY(-2px);\n  box-shadow: 0 8px 24px rgba(0,122,255,0.3);\n}`
  },
  {
    id: 'card-list',
    name: '卡片列表',
    icon: '🃏',
    category: '复合',
    html: '<div class="card-list">\n  <div class="card">\n    <h4>卡片 1</h4>\n    <p>卡片描述文字</p>\n  </div>\n  <div class="card">\n    <h4>卡片 2</h4>\n    <p>卡片描述文字</p>\n  </div>\n  <div class="card">\n    <h4>卡片 3</h4>\n    <p>卡片描述文字</p>\n  </div>\n</div>',
    css: `.card-list {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n  padding: 24px;\n}\n.card {\n  padding: 24px;\n  background: #fff;\n  border: 1px solid rgba(0,0,0,0.06);\n  border-radius: 16px;\n  box-shadow: 0 2px 12px rgba(0,0,0,0.04);\n  transition: all 0.3s ease;\n}\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 12px 32px rgba(0,0,0,0.08);\n}\n.card h4 {\n  font-size: 1.1rem;\n  font-weight: 700;\n  margin-bottom: 8px;\n}\n.card p {\n  color: #86868b;\n  font-size: 14px;\n}`
  },
  {
    id: 'footer',
    name: '页脚',
    icon: '👣',
    category: '复合',
    html: '<footer class="footer">\n  <div class="footer-col">\n    <h5>产品</h5>\n    <a href="#">功能</a>\n    <a href="#">定价</a>\n    <a href="#">更新</a>\n  </div>\n  <div class="footer-col">\n    <h5>公司</h5>\n    <a href="#">关于</a>\n    <a href="#">博客</a>\n    <a href="#">招聘</a>\n  </div>\n  <div class="footer-bottom">\n    <p>© 2026 版权所有</p>\n  </div>\n</footer>',
    css: `.footer {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 32px;\n  padding: 48px 32px 24px;\n  background: #f5f5f7;\n  border-top: 1px solid #e5e5ea;\n}\n.footer-col h5 {\n  font-size: 14px;\n  font-weight: 700;\n  margin-bottom: 12px;\n  color: #1d1d1f;\n}\n.footer-col a {\n  display: block;\n  color: #86868b;\n  text-decoration: none;\n  font-size: 14px;\n  margin-bottom: 6px;\n}\n.footer-col a:hover {\n  color: #1d1d1f;\n}\n.footer-bottom {\n  grid-column: 1 / -1;\n  text-align: center;\n  padding-top: 24px;\n  border-top: 1px solid #e5e5ea;\n  color: #aeaeb2;\n  font-size: 13px;\n}`
  },
  {
    id: 'modal',
    name: '模态框',
    icon: '💬',
    category: '复合',
    html: '<div class="modal-overlay-custom" id="modal1">\n  <div class="modal-custom">\n    <h3>提示</h3>\n    <p>这是一条模态框消息。</p>\n    <div class="modal-actions">\n      <button class="modal-btn-cancel">取消</button>\n      <button class="modal-btn-confirm">确认</button>\n    </div>\n  </div>\n</div>',
    css: `.modal-overlay-custom {\n  position: fixed;\n  inset: 0;\n  background: rgba(0,0,0,0.4);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 1000;\n}\n.modal-custom {\n  background: #fff;\n  border-radius: 16px;\n  padding: 32px;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.15);\n  max-width: 400px;\n  width: 90%;\n}\n.modal-custom h3 {\n  font-size: 1.2rem;\n  font-weight: 700;\n  margin-bottom: 8px;\n}\n.modal-custom p {\n  color: #86868b;\n  margin-bottom: 24px;\n}\n.modal-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n}\n.modal-btn-cancel {\n  padding: 10px 20px;\n  background: #f5f5f7;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 14px;\n}\n.modal-btn-confirm {\n  padding: 10px 20px;\n  background: #007aff;\n  color: #fff;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 14px;\n  font-weight: 600;\n}`
  }
];

// 按分类分组
function getComponentsByCategory() {
  const categories = {};
  COMPONENT_TEMPLATES.forEach(comp => {
    if (!categories[comp.category]) {
      categories[comp.category] = [];
    }
    categories[comp.category].push(comp);
  });
  return categories;
}

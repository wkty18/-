# 「从夯到拉排序」Windows 桌面软件 — 产品规格说明书 (SPEC)

> 版本: v1.0.3-draft  
> 日期: 2026-06-20  
> 状态: 待评审 / 待确认  
> 作者: Claude (AI Assistant) + 用户协作

---

## 目录

1. [产品概述](#1-产品概述)
2. [目标用户与使用场景](#2-目标用户与使用场景)
3. [功能需求](#3-功能需求)
4. [非功能需求](#4-非功能需求)
5. [UI/UX 设计规范](#5-uiux-设计规范)
6. [技术架构方案](#6-技术架构方案)
7. [数据流与模块设计](#7-数据流与模块设计)
8. [导出规格](#8-导出规格)
9. [开发环境与国内镜像配置](#9-开发环境与国内镜像配置)
10. [项目里程碑与排期](#10-项目里程碑与排期)
11. [风险与约束](#11-风险与约束)
12. [待与用户确认事项](#12-待与用户确认事项)

---

## 1. 产品概述

### 1.1 产品名称

**「排个锤子」** (英文: RankWhat — HangToLa Tier Maker)

> 定位：不只是「夯到拉」的模板工具，而是一个**万能分级排名器**。用户可以创造任意分级体系（3~15级），自定义每级名称和颜色，用图片或文字卡片填充，一键导出高清排行图。

### 1.2 产品一句话描述

一款 Windows 桌面 EXE 软件，让用户**完全自由定义分级体系**（等级数量、名称、颜色均可自定义），通过拖拽图片/文字快速生成可视化梯队排名图片，一键导出分享到社交媒体。

### 1.2b 核心差异化卖点

> 🔥 **不是「从夯到拉」的模板工具，而是「任意分级体系」的万能排名器。**

| 对比维度 | 现有工具 (iOS/Web) | 本软件 |
|----------|-------------------|--------|
| 等级数量 | 固定 5 级 | **3~15 级自由增减** |
| 等级名称 | 固定「夯/顶级/人上人/NPC/拉」 | **完全自定义，中文/英文/Emoji 均可** |
| 行颜色 | 固定红→橙→黄渐变 | **每行独立取色 + 10 套预设主题** |
| 文字内容 | 仅图片模式 | **图片 + 文字双模式，文字支持富格式** |
| 模板 | 手动调整 | **一键套用预设 + 自定义保存模板** |

### 1.3 产品背景

「从夯到拉」是 2024-2026 年在中文互联网（B站、抖音、小红书）爆火的五级评价体系：

| 等级 | 标签文案（可自定义） | 含义 | 视觉色 |
|------|---------------------|------|--------|
| **S** | 夯 | 最强/最顶/神中神 | 🔴 红色 #E74C3C |
| **A** | 顶级 | 行业标杆，几乎无瑕疵 | 🟠 橙色 #F39C12 |
| **B** | 人上人 | 中上游，值得推荐 | 🟡 黄色 #F1C40F |
| **C** | NPC | 普通平庸，可有可无 | 🟢 浅绿 #95A5A6 |
| **D** | 拉完了 | 最差/拉胯/不推荐 | ⚪ 灰白 #BDC3C7 |

> 注：等级标签文案和颜色均应支持用户自定义。

### 1.4 市场现状

| 平台 | 现有方案 | 不足 |
|------|----------|------|
| iOS | 从夯到拉生成器 (¥1.00) | 仅 iOS，无 Windows 版 |
| Android | 夯到拉排名 (3.5MB) | 功能简陋，仅手机 |
| Web | TierKing / 宝藏App / TierMaker | 依赖网络，隐私风险，无法离线批处理 |
| **Windows** | **🈚 市场空白** | **本项目填补** |

---

## 2. 目标用户与使用场景

### 2.1 目标用户画像

| 用户类型 | 特征 | 核心需求 |
|----------|------|----------|
| 内容创作者 | B站UP主/抖音博主/小红书博主 | 快速出图、批量生成、高质量导出 |
| 游戏玩家 | Steam/手游玩家 | 给角色/装备/武器排梯队 |
| 普通网民 | 跟风玩梗、社交分享 | 简单易用、免费、一键出图 |
| 数码评测 | 科技博主 | 产品对比、购买推荐排序 |

### 2.2 典型使用场景

1. **游戏角色排名** — 导入游戏角色头像 → 拖拽到五个梯队 → 导出 9:16 竖版图发抖音/小红书
2. **美食排名** — 文字模式输入各地美食 → 自动排版 → 导出 3:4 图发朋友圈
3. **品牌对比** — 上传品牌Logo → 按主观喜好排序 → 导出 16:9 横版做视频封面
4. **课程/科目吐槽** — 纯文字模式快速输入 → 生成「大学科目从夯到拉」梗图

---

## 3. 功能需求

### 3.1 核心功能 (MVP — 必须实现)

#### F1. 完全自定义分级体系 ⭐ 核心卖点

> 用户不受「夯/顶级/人上人/NPC/拉」五级限制，可创造任意分级体系。

**F1.1 等级数量自由控制**
- 默认 5 行，支持 **3 ~ 15 行**自由增减（滑块或 +/- 按钮）
- 预设快捷选择：3行 / 5行 / 7行 / 10行
- 增减行时，已有卡片智能保留（多出的行追加空白行，减少的行内容回收到素材区）

**F1.2 等级标签完全自定义**
- 双击左侧标签进入编辑态，输入任意文字（最长 20 字）
- 支持中英文、数字、Emoji（如 🥇🔥💩）
- 常见模板快速套用：

| 场景 | 分级体系示例 |
|------|-------------|
| 游戏角色 | 神中神 / T0 / T1 / T2 / T3 / 仓管 |
| 美食 | 此生必吃 / 值得排队 / 路过可买 / 算了别去 / 避雷 |
| 数码产品 | 闭眼入 / 性价比高 / 中庸 / 不值 / 智商税 |
| 学科课程 | 神课 / 好课 / 水课 / 坑课 / 快跑 |
| 综艺/影视 | 神作 / 好看 / 能看 / 烂但有趣 / 纯烂 |
| NBA 球员 | GOAT / 超巨 / 全明星 / 首发 / 替补 / 饮水机 |
| 自定义 | 用户完全自由输入 |

**F1.3 每行独立配色**
- 点击行颜色条 → 弹出取色器 → 单行颜色即时生效
- 支持三种调色模式：
  - **纯色**：自由选取任一颜色
  - **预设色板**：10 套主题一键切换整表（见 F5）
  - **拾取图片色**：从导入的图片中取主色调

**F1.4 行排序与拖拽**
- 行与行之间可以上下拖拽调换顺序（如把「拉」拖到最上面变成「拉→夯」倒序）
- 右键行标签 → 菜单：「上移」「下移」「重置名称」「删除此行」

**F1.5 行高级设置**
- 每行可设置：最小卡片高度、允许的最大卡片数
- 「锁定此行」：防止误拖入/误删

#### F2. 图片导入与管理 — 全场景图片支持 ⭐

**F2.1 卡片图片导入**
- **导入方式**：
  - 点击「导入图片」按钮选择本地文件
  - 拖拽图片文件/文件夹到素材区（支持批量拖入）
  - 从剪贴板粘贴截图 (Ctrl+V / Ctrl+Shift+V)
  - 从网页直接拖入图片（浏览器图片拖放）
- **支持格式**：PNG, JPG, JPEG, WebP, BMP, GIF（首帧）, AVIF, SVG
- **图片预处理**：自动裁剪为 1:1 正方形缩略图（圆角 12px），原图保留在内存供导出使用
- **素材暂存区**：所有导入的图片先显示在顶部素材区，缩略图可自由拖入梯队行
- **批量导入**：一次选择多张图片同时导入，显示导入进度条

**F2.2 自定义背景图片**
- 支持上传自定义图片作为整个排行画布的背景
- 背景图片模式：
  - **填充 (Cover)**：铺满画布，超出裁剪
  - **包含 (Contain)**：完整显示，留白区域用纯色填充
  - **平铺 (Tile)**：小图重复平铺
  - **模糊填充**：高斯模糊背景（可调模糊强度 0-50px）
- 背景透明度滑块（0-100%），控制图片与底色混合程度
- 点击「替换背景」或「移除背景」快速操作

**F2.3 自定义等级行图标**
- 每行标签处可上传小图标/Emoji 替代纯文字
- 例：🥇→神中神，🔥→夯，💩→拉完了
- 支持图片图标和 Emoji 两种模式
- 图标大小可调（16-48px）

**F2.4 图片编辑轻功能（行内）**
- 选中图片卡 → 右键 → 菜单：
  - **裁剪**：自由裁剪 / 固定比例裁剪（1:1, 4:3, 16:9）
  - **旋转**：90° 旋转 / 水平翻转 / 垂直翻转
  - **缩放**：拖拽角手柄缩放（保持比例）
  - **圆角调节**：拖动滑块从直角(0px) 到圆形(50%)
  - **滤镜**：亮度 / 对比度 / 饱和度 / 模糊 快速调节
  - **重置**：恢复原始图片
- 所有编辑非破坏性（保留原图，仅记录变换参数）

**F2.5 素材区管理**
- 素材排序：按导入时间 / 按文件名 / 手动拖动排序
- 素材搜索：按文件名模糊搜索（素材超过 20 张时自动显示搜索框）
- 素材多选：Ctrl+点选 或 Shift+范围选 → 批量拖入行
- 素材删除：右键删除 / 选中按 Delete / 批量清空（需确认）
- 素材数量上限：100 张（超出提示，避免性能下降）

#### F3. 拖拽交互

- **素材区 → 梯队行**：拖动图片卡片到目标梯队行
- **行内排序**：梯队行内左右拖动调整图片顺序
- **跨行移动**：将卡片从一行拖到另一行
- **移除卡片**：拖回素材区或拖到删除区域（垃圾桶图标）
- **触摸板/触屏支持**：长按拖拽（面向 Surface 等触屏 Windows 设备）

#### F4. 文字卡片模式 ⭐ 与图片模式平级

**F4.1 切换到文字模式**
- 工具栏提供「图片模式 / 文字模式」切换按钮
- **混合模式**：同一行内可以既有图片卡片又有文字卡片（默认支持）
- 纯文字模式：隐藏素材区，界面更简洁

**F4.2 文字输入方式**
- **逐行输入**：点击梯队行的「+ 添加文字」→ 弹出输入框 → 回车确认 → 文字卡片即时生成
- **批量导入**：点击「批量输入」→ 弹窗文本框 → 每行一个条目，逗号或换行分隔 → 自动生成所有文字卡片
- **粘贴导入**：从 Excel/记事本 复制列表 → Ctrl+V 粘贴到行内

**F4.3 文字卡片样式（每张卡可独立设置）**
- 字体大小：跟随行设置 / 独立调节 (8-48px)
- 字体粗细：细/常规/粗体/特粗
- 文字颜色：自动（黑/白根据背景亮度） / 手动指定
- 卡片背景色：跟随行色 / 独立设置
- 卡片形状：圆角矩形 / 椭圆 / 尖角标签
- 卡片边框：无 / 实线 / 虚线，颜色可调

**F4.4 文字卡片操作**
- 双击文字卡片 → 直接编辑文字
- 右键 → 菜单：「编辑」「复制」「删除」「切换为图片」
- 多选文字卡片 → 批量改样式

**F4.5 文字预设风格**
- 6 套文字卡片视觉风格：简约白底 / 霓虹灯 / 便签纸 / 印章 / 渐变 / 像素风

#### F5. 外观自定义与模板系统 ⭐

**F5.1 全局主题预设（10 套）**
| 主题 | 风格 | 适用场景 |
|------|------|----------|
| 经典红橙 | 红→橙→黄→绿→灰 渐变 | 通用排名 |
| 莫兰迪 | 低饱和度高级灰 | 文艺/审美类 |
| 赛博朋克 | 霓虹紫/青/品红/黄 | 游戏/科技 |
| 黑白极简 | 黑→深灰→灰→浅灰→白 | 专业评测 |
| 糖果色 | 粉/橙/黄/绿/蓝 活泼 | 生活日常 |
| 黑金 | 黑底+金色渐变边框 | 高端/奢侈品 |
| 水彩 | 柔和渐变水彩色 | 小清新 |
| 像素复古 | 8bit 风格色块 | 怀旧游戏 |
| B站粉蓝 | 粉蓝白配色 | ACG 文化 |
| 自定义 | 用户自建主题保存 | 个人专属 |

**F5.2 逐行自定义**
- 点击行 → 右侧属性面板：标签文字、行颜色、文字颜色、边框样式
- 颜色取色器（支持 HEX/RGB/HSL 输入和色盘取色）
- 「取色笔」工具：从画布上任意图片吸取颜色

**F5.3 全局样式**
- 背景类型：纯色 / 线性渐变 / 径向渐变 / 自定义图片 / 透明
- 卡片统一设置：圆角半径、间距、阴影强度
- 标题文字：顶部大标题（可选显示/隐藏），字体/大小/颜色可调

**F5.4 自定义模板保存**
- 用户调整好分级体系 + 配色 → 「保存为模板」
- 模板保存内容：分级数量 + 每行标签 + 每行颜色 + 全局样式
- 模板出现在左侧「分级模板库」面板
- 右键模板 → 重命名 / 删除 / 导出模板文件 (.hangtolatem)
- 支持导入他人分享的模板文件 (.hangtolatem 双击安装)

**F5.5 分级模板库面板（左侧常驻）**
- 内置 6 套场景模板，开箱即用：

| 模板名 | 分级体系 | 适用场景 |
|--------|---------|----------|
| 🎮 游戏角色 | 神中神 / T0 / T1 / T2 / T3 / 仓管 | 二游/竞技游戏角色评价 |
| 🍔 美食评价 | 此生必吃 / 值得排队 / 路过可买 / 算了别去 / 避雷 | 餐厅/零食/探店评测 |
| 📱 数码评测 | 闭眼入 / 性价比高 / 中庸 / 不值 / 智商税 | 手机/电脑/外设推荐 |
| 📚 学科吐槽 | 神课 / 好课 / 水课 / 坑课 / 快跑 | 大学选课/学习体验 |
| 🏀 体育球员 | GOAT / 超巨 / 全明星 / 首发 / 替补 / 饮水机 | NBA/足球/电竞 |
| ⭐ 经典夯到拉 | 夯 / 顶级 / 人上人 / NPC / 拉完了 | 原生梗，通用场景 |

- 双击模板 → 一键套用（替换当前分级体系，保留卡片映射到最接近的行）
- 套用模板时：如果模板行数 > 当前行数，多出行空白；如果 < 当前行数，多余行卡片回收素材区

**F5.6 黑夜/白天模式 ⭐ 用户自主切换**

> 用户可以随时在黑夜模式（深色）和白天模式（浅色）之间自由切换，并非系统强制跟随。

**三种模式选项**（工具栏右侧 ☀️🌙 按钮）：

| 模式 | 图标 | 行为 |
|------|------|------|
| **☀️ 白天模式** | 太阳 | 始终浅色，不受系统影响 |
| **🌙 黑夜模式** | 月亮 | 始终深色，适合夜间使用 / 暗色爱好者 |
| **🖥️ 跟随系统** | 半日半夜 | 默认，跟随 Windows 系统设置自动切换 |

**切换方式：**
- 工具栏右侧常驻 ☀️/🌙 图标按钮，点击弹出三选一菜单
- 快捷键：`Ctrl+Shift+D` 在三种模式间轮换
- 切换动画：背景色 400ms 淡入淡出过渡，无闪烁

**黑夜模式的独立视觉设定：**

| 元素 | 白天模式 | 黑夜模式 |
|------|----------|----------|
| 窗口底色 | #F5F5F7 暖灰 | #0D0D0D 真黑 |
| 主画布 | #FFFFFF 纯白 | #1A1A1A 深灰 |
| 卡片底色 | #FAFAFA | #242424 |
| 文字主色 | #1A1A2E 深黑 | #E5E5E7 浅白 |
| 边框 | #E5E5E7 淡灰 | #333333 暗灰 |
| 侧面板 | 白底半透明毛玻璃 | 黑底半透明毛玻璃 |
| 阴影 | 黑色 5-16% 透明度 | 纯黑 20-40% 透明度（需更深才有层次） |
| 选中高亮 | rgba(99,102,241,0.12) | rgba(99,102,241,0.20) |

**黑夜模式的特殊处理：**
- 行背景色自动加深 15%（避免亮色在暗底上刺眼）
- 文字卡片自动切换文字色为浅色
- 导出时：以当前模式配色导出，也可勾选「同时导出浅色/深色两个版本」
- 取色器中提供「浅色/深色预览切换」，方便调色时检查两种模式下的效果

**模式状态持久化：**
- 用户选择「白天」或「黑夜」→ 写入本地配置，下次启动保持
- 默认安装后首次启动 = 「跟随系统」

#### F6. 导出功能

- **导出格式**：PNG（默认）/ JPG / WebP
- **导出比例**：
  - 3:4（小红书/朋友圈竖版）
  - 4:3（横版通用）
  - 9:16（抖音/快手/Reels 全屏竖版）
  - 16:9（B站视频封面 / YouTube 缩略图）
  - 1:1（Instagram）
  - 自定义比例（自由输入宽高比）
- **自适应画布**：导出区域随实际行数（3~15）自动伸缩，每行高度按卡片内容自适应
- **导出分辨率**：1x / 2x / 3x（最高 4K）
- **导出路径**：弹出保存对话框，默认桌面
- **一键复制到剪贴板**（Ctrl+C 直接复制图片）
- **批量导出**：多个比例一键同时导出

#### F7. 项目管理

- **保存项目**：保存为 `.hangtolaproject` 文件（JSON + 图片 base64 打包）
- **打开项目**：双击 `.hangtolaproject` 文件或从菜单打开，恢复编辑状态
- **自动保存**：每 5 分钟自动保存临时恢复文件
- **最近项目**：文件菜单显示最近 5 个项目

### 3.2 进阶功能 (V1.1 — 后续迭代)

#### F8. 模板市场

- 内置 10+ 常用模板（游戏角色排名、美食排名、品牌对比等）
- 一键套用模板的配色、字体、布局
- 用户可保存自定义模板

#### F9. AI 辅助

- **AI 自动抠图**：导入图片自动去背景（集成 rembg 本地模型）
- **AI 智能排序**：输入主题，AI 自动联网搜索并生成初始排序建议
- **AI 文案生成**：为每个梯队自动生成说明文字

#### F10. 视频导出

- 生成「从夯到拉」解说视频（类似 TierRanker）
- 支持录音旁白 / TTS 语音合成
- 卡片逐个出现的动画效果
- 导出 MP4 1080p/4K

#### F11. 分享与社区

- 一键分享到剪切板（带水印/不带水印可选）
- 生成带二维码的分享图（扫码打开在线版本）
- 上传到社区相册（需后端支持）

---

## 4. 非功能需求

### 4.1 性能

| 指标 | 目标值 |
|------|--------|
| 冷启动时间 | ≤ 3 秒 |
| 导入 50 张图片 | ≤ 2 秒 |
| 导出 4K PNG | ≤ 5 秒 |
| 内存占用（空闲） | ≤ 150 MB |
| 内存占用（50 张图） | ≤ 500 MB |
| 安装包大小 | ≤ 80 MB |

### 4.2 兼容性

| 项目 | 要求 |
|------|------|
| 操作系统 | **Windows 11（主要）**, Windows 10 21H2+（兼容） |
| 架构 | x64（首期）, ARM64（后续） |
| 最低分辨率 | 1366×768 |
| 推荐分辨率 | 1920×1080+ |
| 高 DPI 支持 | 125%/150%/200% 缩放完美适配 |
| 设计语言 | Win11 Fluent Design (Mica + Acrylic + 圆角 + Snap) |

### 4.3 可靠性

- 崩溃自动恢复：异常退出后下次启动提示恢复未保存项目
- 导出失败重试：导出出错时自动重试 3 次
- 图片加载容错：损坏图片跳过并提示，不阻断整体流程

### 4.4 安全性

- 完全离线运行，无网络请求（除用户主动检查更新）
- 不上传任何用户数据
- 图片仅在本地处理，不留存
- 代码签名证书（避免 Windows Defender 误报）

### 4.5 可用性

- 首次启动显示 3 步引导教程
- 所有操作支持 Ctrl+Z 撤销（最近 50 步）
- 键盘快捷键覆盖所有核心操作
- 状态栏显示当前项目图片数量、行数

### 4.6 Windows 11 窗口原生适配 ⭐

> 本软件窗口深度适配 Windows 11 Fluent Design System，使用原生材质打造沉浸体验。

#### 4.6.1 窗口材质体系 — Mica + Acrylic

| 材质 | 应用区域 | 视觉效果 |
|------|----------|----------|
| **Mica** | 窗口背景底层 | 半透明云母，透出桌面壁纸色调，仅首帧渲染（高性能） |
| **Acrylic** | 侧面板 / 标题栏 / 状态栏 | 实时高斯模糊 + 噪点纹理 + 色调混合 |
| **Solid** | 主画布编辑区 | 纯色不透明，确保编辑区色彩准确 |

```
┌──────────────────────────────────────────────┐
│  🏠 标题栏 — Acrylic 模糊 + 底部 1px 分割线  │
├───────────────┬──────────────┬───────────────┤
│ 📁 素材区      │ 📋 主画布      │ ⚙️ 属性面板   │
│ Acrylic 模糊   │ Solid 纯色    │ Acrylic 模糊   │
│               │ (色彩准确)    │               │
├───────────────┴──────────────┴───────────────┤
│  📊 状态栏 — Acrylic 模糊                    │
└──────────────────────────────────────────────┘
           ↑ Mica 底层透出桌面壁纸 ↑
```

#### 4.6.2 窗口圆角与边框

- **Win11 原生圆角**：调用 DWM API `DwmSetWindowAttribute` + `DWMWA_WINDOW_CORNER_PREFERENCE` 启用系统级圆角
- Win10 回退：Tauri `decorations: false` 自绘 8px CSS 圆角
- 窗口边框：`DWMWA_BORDER_COLOR` 透明处理，融入 Mica

#### 4.6.3 自定义标题栏（Win11 风格，36px）

- 自绘标题栏替代系统原生：
  - 左：App 图标(16px) + 标题文字(13px, weight 500)
  - 中：`data-tauri-drag-region` 可拖拽区域
  - 右：Snap 悬停触发区 + 最小化(─) / 最大化(□/❐) / 关闭(✕) 按钮组（46px 宽/个，悬停背景色）
- 最大化/还原自动检测切换
- 背景：Acrylic 模糊

#### 4.6.4 Snap Layouts 贴靠布局（原生）

- 不拦截最大化按钮区域，Win11 自动弹出 Snap Layouts 面板
- 窗口最小尺寸 680×480，防止极小贴靠崩溃
- 响应式断点：
  - `< 900px` → 侧面板自动折叠为浮动抽屉
  - `< 680px` → 工具栏折叠为「…」溢出菜单

#### 4.6.5 右键菜单 — Win11 Acrylic 风格

- 自定义 contextmenu 替代浏览器默认：
  - Acrylic 模糊背景 + 圆角 8px + 1px 半透明边框
  - 菜单项 36px 高，图标+文字+快捷键布局
  - 弹出动画：scale(0.95→1) + opacity 淡入 (150ms ease-out)

#### 4.6.6 Win11 强调色跟随

- 读取 Windows 个性化「强调色」设置
- 应用 accent 色自动跟随（可在设置中覆盖为自定义色）
- `windows-rs` 读取 `UISettings.GetColorValue()`

#### 4.6.7 Win11 原生通知

- 导出完成 → Windows 原生 Toast 通知
- `tauri-plugin-notification`，带应用图标 + 操作按钮

#### 4.6.8 Win10 兼容降级

| Win11 功能 | Win10 退路 |
|-----------|-----------|
| Mica 材质 | 纯色背景（跟随深浅模式） |
| Acrylic 模糊 | CSS 半透明纯色模拟 |
| Snap Layouts | 仅响应式断点生效 |
| DWM 圆角 | Tauri 自绘 8px CSS 圆角 |
| 原生通知 | 应用内 Toast 替代 |
| 强调色读取 | 使用默认 Indigo #6366F1 |

#### 4.6.9 Tauri 配置

**tauri.conf.json:**
```json
{
  "app": {
    "windows": [{
      "title": "从夯到拉排序",
      "width": 1200, "height": 800,
      "minWidth": 680, "minHeight": 480,
      "decorations": false,
      "transparent": false,
      "center": true,
      "additionalBrowserArgs": "--enable-features=msEdgeWindowsMica"
    }]
  }
}
```

**Rust 端 Mica 启用 (src-tauri/src/main.rs):**
```rust
use window_vibrancy::apply_mica;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            #[cfg(target_os = "windows")]
            apply_mica(window, None).ok();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error");
}
```

---

## 5. UI/UX 设计规范 — 视觉精装修 ⭐

> 目标：打造 **Windows 桌面端最美 Tier List 工具**，对标 Linear / Notion / Figma 级别的 UI 质感。

---

### 5.1 Design System — 设计令牌

#### 5.1.1 色彩系统

```
┌─ 基础色盘 (CSS Variables) ─────────────────────────────┐
│                                                         │
│  --color-bg-primary:        #FFFFFF / #0D0D0D           │
│  --color-bg-secondary:      #F8F9FA / #1A1A1A           │
│  --color-bg-tertiary:       #F0F1F3 / #242424           │
│  --color-bg-elevated:       #FFFFFF / #2A2A2A           │
│                                                         │
│  --color-surface-glass:     rgba(255,255,255,0.72)      │
│                             / rgba(30,30,30,0.72)       │
│                                                         │
│  --color-text-primary:      #1A1A2E / #F0F0F0           │
│  --color-text-secondary:    #6B7280 / #9CA3AF           │
│  --color-text-tertiary:     #9CA3AF / #6B7280           │
│                                                         │
│  --color-border-default:    #E5E7EB / #333333           │
│  --color-border-hover:      #C4C4C4 / #555555           │
│  --color-border-focus:      #6366F1 (Indigo)            │
│                                                         │
│  --color-accent:            #6366F1 (主强调色)           │
│  --color-accent-hover:      #5558E8                     │
│  --color-danger:            #EF4444                     │
│  --color-success:           #10B981                     │
│  --color-warning:           #F59E0B                     │
│                                                         │
│  Tier 行渐变 (经典主题):                                 │
│  --tier-s:  #EF4444 → #E74C3C (夯/神中神)              │
│  --tier-a:  #F59E0B → #F39C12 (顶级/T0)               │
│  --tier-b:  #EAB308 → #F1C40F (人上人/T1)             │
│  --tier-c:  #6B7280 → #95A5A6 (NPC/T2)                │
│  --tier-d:  #9CA3AF → #BDC3C7 (拉/仓管)               │
└────────────────────────────────────────────────────────┘
```

#### 5.1.2 字体系统

| Token | 大小 | 行高 | 字重 | 用途 |
|-------|------|------|------|------|
| `text-xs` | 11px | 1.4 | 400 | 辅助信息、水印 |
| `text-sm` | 13px | 1.5 | 400 | 状态栏、标签副文本 |
| `text-base` | 15px | 1.6 | 400 | 正文、卡片文字 |
| `text-lg` | 18px | 1.5 | 500 | 行标签、面板标题 |
| `text-xl` | 22px | 1.4 | 600 | 工具栏标题 |
| `text-2xl` | 28px | 1.3 | 700 | 导出标题 |
| `text-3xl` | 36px | 1.2 | 800 | Hero 标题 |

**字体族：**
- 中文 UI：`"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif`
- 英文/数字：`"Inter", "SF Pro Display", system-ui, sans-serif`
- 等宽（代码/坐标）：`"JetBrains Mono", "Cascadia Code", monospace`

#### 5.1.3 间距系统（4px 基数）

| Token | 值 | 用途 |
|-------|-----|------|
| `space-1` | 4px | 紧凑间距（图标与文字） |
| `space-2` | 8px | 卡片内边距 |
| `space-3` | 12px | 卡片间距 |
| `space-4` | 16px | 面板内边距 |
| `space-5` | 20px | 行间距 |
| `space-6` | 24px | 段落/区块间距 |
| `space-8` | 32px | 大区块间距 |
| `space-10` | 40px | 面板间间距 |
| `space-12` | 48px | 页面边距 |

#### 5.1.4 阴影层级

| 层级 | 值 | 用途 |
|------|-----|------|
| `shadow-none` | none | 平板 |
| `shadow-xs` | 0 1px 2px rgba(0,0,0,0.05) | 卡片默认 |
| `shadow-sm` | 0 2px 8px rgba(0,0,0,0.06) | 卡片悬停、按钮 |
| `shadow-md` | 0 4px 16px rgba(0,0,0,0.08) | 下拉菜单、弹出层 |
| `shadow-lg` | 0 8px 32px rgba(0,0,0,0.12) | 对话框、模态框 |
| `shadow-xl` | 0 16px 48px rgba(0,0,0,0.16) | 抽屉、侧面板 |
| `shadow-drag` | 0 20px 60px rgba(0,0,0,0.25) | 拖拽中的元素 |
| `shadow-glow` | 0 0 16px rgba(99,102,241,0.4) | 选中发光 |

#### 5.1.5 圆角

| Token | 值 | 用途 |
|-------|-----|------|
| `radius-sm` | 6px | 小标签、徽章 |
| `radius-md` | 8px | 按钮、输入框 |
| `radius-lg` | 12px | 卡片、图片缩略图 |
| `radius-xl` | 16px | 面板、对话框 |
| `radius-2xl` | 20px | 大面板 |
| `radius-full` | 9999px | 胶囊按钮、头像 |

---

### 5.2 整体布局

```
┌──────────────────────────────────────────────────────────────────┐
│  🏠 菜单栏 (36px)  文件 | 编辑 | 视图 | 导出 | 帮助              │
├──────────────────────────────────────────────────────────────────┤
│  🛠️ 工具栏 (48px)                                                 │
│  [📷图片] [📝文字] │ [🎨主题▼] [⚙️行数:5▼] │ [↩][↪] [💾导出▼] [🌙] │
├────────────────┬────────────────────────────────┬────────────────┤
│                │  ┌─ 标题栏 (可选) ──────────┐  │                │
│  📁 素材区     │  │  🏷️ 大学课程从夯到拉      │  │  ⚙️ 属性面板  │
│  (200px)       │  └──────────────────────────┘  │  (240px)       │
│  ┌──────────┐  │                                │  ┌──────────┐  │
│  │🔍搜索... │  │  ┌──── 行1 ────────────────┐   │  │ 🏷️ 标签   │  │
│  │          │  │  │ 🔴 神中神                │   │  │ 神中神    │  │
│  │ [🖼️][🖼️]│  │  │ [高数][大物][线代][C++] │   │  │           │  │
│  │ [🖼️][🖼️]│  │  └────────────────────────┘   │  │ 🎨 行色   │  │
│  │ [🖼️][🖼️]│  │                                │  │ 🔴 [色盘] │  │
│  │ [🖼️]    │  │  ┌──── 行2 ────────────────┐   │  │           │  │
│  │          │  │  │ 🟠 好课                  │   │  │ 📐 高度   │  │
│  │ 拖入或   │  │  │ [英语][数据结构]         │   │  │ ──●── 72  │  │
│  │ 点击导入 │  │  └────────────────────────┘   │  │           │  │
│  └──────────┘  │                                │  │ 🔒 锁定   │  │
│                │  ┌──── 行3 ────────────────┐   │  │ [  OFF ]  │  │
│  📋 模板库     │  │ 🟡 水课                  │   │  │           │  │
│  ┌──────────┐  │  │ [思修][体育]             │   │  │ 📏 边栏   │  │
│  │🎮 游戏角色│  │  └────────────────────────┘   │  │ [无][实线]│  │
│  │🍔 美食   │  │                                │  └──────────┘  │
│  │📱 数码   │  │  ┌──── 行4 ────────────────┐   │                │
│  │📚 学科   │  │  │ 🟢 坑课                  │   │  🎨 全局样式   │
│  │🏀 体育   │  │  │ [形式政策]               │   │  ┌──────────┐  │
│  │⭐ 自定义  │  │  └────────────────────────┘   │  │ 背景: 纯色 │  │
│  └──────────┘  │                                │  │ 圆角: 12px │  │
│                │  ┌──── 行5 ────────────────┐   │  │ 间距: 8px  │  │
│  底部可以      │  │ ⚪ 快跑                  │   │  │ 字体: 雅黑 │  │
│  [+ 添加行]   │  │ [毛概]                   │   │  └──────────┘  │
│                │  └────────────────────────┘   │                │
├────────────────┴────────────────────────────────┴────────────────┤
│  📊 状态栏 (28px)  🖼️ 12张 | 📝 8个 | 📏 5行 | 📐 3:4 | 💾 已保存 │
└──────────────────────────────────────────────────────────────────┘
```

---

### 5.3 视觉风格

#### 5.3.1 核心风格：**Glassmorphism + 微拟物 融合**

| 元素 | 风格处理 |
|------|----------|
| **窗口背景** | 深色/浅色根据系统，15% 噪点纹理叠加（模拟纸张质感） |
| **侧边面板** | 毛玻璃效果 `backdrop-filter: blur(20px)` + 半透明背景 + 细边框 |
| **卡片 (图片/文字)** | 微拟物：浅底色 + 轻投影 + 悬停浮起 2px + 圆角 12px |
| **按钮** | 扁平微立体：浅渐变底色 + 1px 内阴影高光线 |
| **输入框** | 玻璃态：半透明底 + 底部边框高亮动画 |
| **梯行背景** | 每条行独立渐变背景（左深右浅），行间 4px 分隔缝 |
| **选中态** | Indigo (#6366F1) 2px 发光描边 + 外发光阴影 |
| **拖拽态** | 卡片放大 105% + shadow-drag + 轻微旋转(±1°) + backdrop-blur 原位置 |

#### 5.3.2 深浅双模

| 区域 | 浅色模式 | 深色模式 |
|------|----------|----------|
| 窗口底色 | #F5F5F7 (Apple 风格暖灰) | #0D0D0D (真黑) |
| 主画布 | #FFFFFF | #1A1A1A |
| 侧面板 | rgba(255,255,255,0.85) + blur(20px) | rgba(30,30,30,0.85) + blur(20px) |
| 卡片 | #FAFAFA → 悬停 #FFFFFF | #242424 → 悬停 #2E2E2E |
| 边框 | #E5E5E7 | #333333 |
| 文字 | #1A1A2E | #E5E5E7 |
| 选中高亮 | rgba(99,102,241,0.12) | rgba(99,102,241,0.2) |

#### 5.3.3 窗口圆角

- 主窗口启用 **8px 圆角**（Tauri `decorations: false` + 自定义标题栏）
- 自定义标题栏高度 36px，拖拽区域、最小化/最大化/关闭按钮
- 窗口边框：1px 半透明描边（`rgba(0,0,0,0.08)` / `rgba(255,255,255,0.06)`）

---

### 5.4 动效与过渡

#### 5.4.1 动画时间令牌

| Token | 时长 | 缓动 | 用途 |
|-------|------|------|------|
| `duration-instant` | 80ms | ease | 悬停反应、选中切换 |
| `duration-fast` | 150ms | ease-out | 按钮点击、卡片入场 |
| `duration-normal` | 250ms | ease-in-out | 面板展开、对话框弹出 |
| `duration-slow` | 400ms | ease-out | 页面过渡、大量元素入场 |
| `duration-spring` | 600ms | spring(1,0.8,15) | 拖拽释放弹性回弹 |

#### 5.4.2 关键动画明细

**A. 卡片入场动画**
```
卡片从素材区拖入梯队行时：
  0ms:   透明度 0, 缩放 0.8, 位移 Y: -8px
  200ms: 透明度 1, 缩放 1.0, 位移 Y: 0
  缓动: cubic-bezier(0.34, 1.56, 0.64, 1)  // 超出回弹
  级联: 同一行多个卡片逐张延迟 40ms (stagger)
```

**B. 拖拽拾取动画**
```
卡片被抓起时:
  0ms:   原地状态
  100ms: scale(1.05), shadow-drag, z-index: 1000
  缓动: ease-out
  原位置: 透明度降低至 0.3 + 保留占位空间 (防晃动)
```

**C. 拖拽放置弹性动画**
```
卡片放入新行:
  0ms:   跟随光标位置
  400ms: 弹入最终位置 (spring physics)
  参数:  tension=300, friction=20, mass=1
  效果:  轻微的 overshoot + 回弹
```

**D. 行高亮闪烁**
```
目标行接收到拖入卡片时:
  背景亮度瞬间提升 15% → 150ms 渐回原位
  边框颜色切换到 --color-accent → 300ms 渐回
```

**E. 面板展开/折叠**
```
侧面板:
  宽度: 0 → 240px (250ms ease-in-out)
  内容: 延迟 100ms 淡入 (150ms ease-out)
  折叠时反向
```

**F. 导出进度**
```
导出渲染中:
  工具栏右侧出现环形进度条 (SVG stroke-dashoffset 动画)
  + 百分比数字跳动
  完成: 进度条替换为 ✅ + 淡出 500ms
```

**G. 颜色切换过渡**
```
主题/行色切换:
  所有颜色属性 300ms ease-in-out 渐变过渡
  (CSS transition: background-color, border-color, color)
```

**H. 空状态引导动画**
```
无卡片时:
  虚线框 border-dash 缓慢流动 (CSS @keyframes dash-move)
  提示文字轻微上下浮动
  上传图标微微脉冲
```

#### 5.4.3 微交互清单

| 交互 | 微动效 |
|------|--------|
| 按钮按下 | scale(0.96) + 阴影缩小 |
| 按钮悬停 | 背景色加深 8% + 上浮 1px |
| 开关切换 | 圆点滑动 + 背景色渐变 + 轻微弹性 |
| 滑块拖动 | 轨道颜色实时跟随 + 数值跳动 |
| 取色器 | 色盘打开时从点击位置放大弹出 (transform-origin: clickXY) |
| 标签编辑 | 双击后文字变为输入框 + 光标闪烁 + 边框高亮 |
| 卡片删除 | 缩小 + 旋转 + 淡出 (200ms) → 后方卡片平滑左移 |
| 撤销/重做 | 卡片/行从原位置瞬移出现（无过渡，避免混淆） |
| 菜单弹出 | transform-origin: top-left → scale(0.95→1) + 淡入 |

---

### 5.5 各状态 UI

#### 5.5.1 空状态 (Empty State)

```
┌────────────────────────────────────────┐
│                                        │
│         📋  (浮动动画)                  │
│                                        │
│      还没有任何内容                     │
│   拖拽图片到此处，或点击下方按钮开始     │
│                                        │
│   [📷 导入图片]   [📝 输入文字]        │
│                                        │
│   ── 或者从模板开始 ──                 │
│   [🎮游戏] [🍔美食] [📱数码] [⭐经典]  │
│                                        │
└────────────────────────────────────────┘
```

#### 5.5.2 加载状态 (Loading)

- 导入大图 (>10MB)：卡片位置显示 shimmer 骨架屏 + 文件名 + 进度条
- 导出渲染：工具栏右侧显示环形进度 + 「渲染中…」
- 应用启动：启动屏 (Splash Screen) — logo + 产品名 + 「版本 x.x.x」

#### 5.5.3 错误状态 (Error)

- 不支持的格式：卡片显示 ⚠️ + 「格式不支持」+ 点击查看详情
- 图片过大 (>50MB)：提示压缩或跳过
- 导出失败：Toast 通知 + 「重试」按钮

#### 5.5.4 Toast 通知系统

```
┌────────────────────────────────────────┐
│  ✅  导出成功！已保存到桌面             │
│      📂 打开文件夹    [3秒后消失]       │
└────────────────────────────────────────┘
```

位置：右下角，堆叠显示（最多 3 条），滑入动画 (translateX + opacity)

---

### 5.6 键盘快捷键

| 快捷键 | 操作 |
|--------|------|
| `Ctrl+N` | 新建项目 |
| `Ctrl+O` | 打开项目 |
| `Ctrl+S` | 保存项目 |
| `Ctrl+Shift+S` | 另存为… |
| `Ctrl+E` | 导出图片 |
| `Ctrl+Z` | 撤销 |
| `Ctrl+Y` / `Ctrl+Shift+Z` | 重做 |
| `Ctrl+V` | 从剪贴板粘贴图片 |
| `Ctrl+A` | 全选当前行卡片 |
| `Delete` | 删除选中卡片 |
| `Ctrl+D` | 复制选中卡片 |
| `Ctrl+Scroll` | 缩放画布 |
| `Ctrl+0` | 重置缩放 100% |
| `Ctrl+1/2/3/4/5` | 快速选择第 1-5 行 |
| `Space+拖拽` | 临时切换到抓手工具（画布平移） |
| `Shift+点选` | 范围多选卡片 |
| `Ctrl+点选` | 独立多选卡片 |
| `F11` | 全屏模式（专注编辑） |
| `Esc` | 取消选择 / 关闭弹窗 |

---

### 5.7 技术实现方向 (Tauri + React 前端)

```
UI 技术栈:
  ├── TailwindCSS 4.x           # 样式框架
  ├── framer-motion             # 动画引擎 (spring physics, layout animations)
  ├── @dnd-kit/core + sortable  # 拖拽系统 (传感器: 鼠标 + 触摸)
  ├── shadcn/ui                 # 基础组件 (Button, Dialog, Slider, Switch...)
  ├── iconfont.cn               # 图标库 ⭐ 阿里巴巴矢量图标库 (默认图标源)
  ├── cmdk (⌘K)                # 命令面板 (Ctrl+K 快速搜索操作)
  └── sonner                    # Toast 通知

  图标方案:
  主源: iconfont.cn (阿里巴巴矢量图标库)
  ├── 创建本项目专属图标项目，统一管理所有图标
  ├── 使用 Font Class 方式引入（CSS class 直接使用，支持颜色/大小覆盖）
  ├── 或下载 SVG 文件 → 放入 src/assets/icons/ → 封装为 <Icon name="xxx" /> React 组件
  ├── 推荐图标包: 「扁平线形」「Material Design」「Ant Design Icons」
  └── 备选: 如果 iconfont.cn 缺少特定图标 → Phosphor Icons 补充

  毛玻璃效果:
  CSS backdrop-filter: blur() saturate()
  + 半透明背景色
  + 1px 边框 (内外各一条, 模拟玻璃厚度)

  自定义标题栏:
  Tauri v2: decorations: false
  + data-tauri-drag-region 属性
  + 自定义最小化/最大化/关闭按钮
```

---

## 6. 技术架构方案

### 6.1 技术选型对比

| 维度 | Tauri + React | Electron + React | .NET WPF | Flutter Desktop |
|------|---------------|------------------|----------|-----------------|
| 安装包大小 | ⭐⭐⭐ 5-15MB | ⭐ 150MB+ | ⭐⭐ 50-80MB | ⭐⭐ 40-80MB |
| 内存占用 | ⭐⭐⭐ 低 | ⭐⭐ 中 | ⭐⭐⭐ 低 | ⭐⭐ 中 |
| 开发效率 | ⭐⭐⭐ 高（React） | ⭐⭐⭐ 高 | ⭐⭐ 中 | ⭐⭐ 中 |
| 中文生态 | ⭐⭐ 一般 | ⭐⭐⭐ 好 | ⭐⭐⭐ 好 | ⭐⭐ 一般 |
| 原生能力 | ⭐⭐⭐ 强（Rust） | ⭐⭐ 中 | ⭐⭐⭐ 强 | ⭐⭐ 中 |
| 社区成熟度 | ⭐⭐ 成长中 | ⭐⭐⭐ 成熟 | ⭐⭐⭐ 成熟 | ⭐⭐ 成长中 |
| GPU 渲染 | ⭐⭐⭐ WebView2 | ⭐⭐ Chromium | ⭐⭐⭐ DirectX | ⭐⭐⭐ Skia |
| 国内镜像 | ⭐⭐ 需配置 | ⭐⭐ 需配置 | ⭐⭐⭐ NuGet有 | ⭐⭐ 需配置 |

### 6.2 推荐方案：Tauri v2 + React + TypeScript

**推荐理由：**
1. **安装包极小**（~8MB），用户下载体验极佳
2. 使用系统 WebView2（Windows 10+ 内置），无需捆绑 Chromium
3. Rust 后端处理图片 I/O、导出渲染，性能优异
4. React 生态成熟，UI 组件库丰富
5. 支持 Windows 原生 API（文件对话框、剪贴板、注册表）

**替代方案：Electron + React**（如 Tauri 遇到兼容性问题时启用）

### 6.3 技术栈明细

```
┌─────────────────────────────────────────┐
│              前端 (UI Layer)             │
│  React 19 + TypeScript 5.x              │
│  TailwindCSS 4.x + shadcn/ui            │
│  @dnd-kit/core (拖拽)                   │
│  html-to-image (DOM → 图片导出)         │
│  Zustand (状态管理)                      │
├─────────────────────────────────────────┤
│              后端 (Native Layer)         │
│  Tauri v2 (Rust)                       │
│  image-rs (图片编解码/缩放)             │
│  resvg (SVG → PNG 渲染)                │
│  zip-rs (项目文件打包)                  │
├─────────────────────────────────────────┤
│              构建 & 分发                 │
│  Tauri Bundler → .msi / .exe           │
│  GitHub Actions (CI/CD)                │
│  代码签名 (可选 OV/EV Certificate)      │
└─────────────────────────────────────────┘
```

### 6.4 核心依赖清单

#### Rust (Cargo.toml)
```toml
[dependencies]
tauri = { version = "2", features = ["tray-icon"] }
tauri-plugin-dialog = "2"        # 文件对话框
tauri-plugin-clipboard-manager = "2"  # 剪贴板
tauri-plugin-fs = "2"            # 文件系统
tauri-plugin-shell = "2"         # 系统命令
image = "0.25"                   # 图片处理
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

#### Node (package.json)
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-dialog": "^2.0.0",
    "@tauri-apps/plugin-clipboard-manager": "^2.0.0",
    "@tauri-apps/plugin-fs": "^2.0.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "html-to-image": "^1.11.0",
    "zustand": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "lucide-react": "^0.400.0"
  }
}
```

---

## 7. 数据流与模块设计

### 7.1 核心数据模型

```typescript
// ── 项目数据结构 ──
interface Project {
  version: string;           // 格式版本 "1.0"
  metadata: {
    title: string;
    createdAt: string;       // ISO 8601
    updatedAt: string;
    templateName?: string;   // 来源模板名
  };
  tiers: Tier[];             // 梯队数组（3~15 行）
  assets: Asset[];           // 图片素材数组
  settings: ProjectSettings;
}

// ── 单个梯队行 ──
interface Tier {
  id: string;                // UUID
  label: string;             // 标签文案 (如 "神中神", "T0", "此生必吃")
  color: string;             // 行背景色 (如 "#E74C3C")
  textColor: string;         // 文字颜色 (如 "#FFFFFF")
  borderStyle: 'none' | 'solid' | 'dashed';
  borderColor: string;
  minCardHeight: number;     // 最小卡片高度 px
  maxCards: number | null;   // 最大卡片数（null=不限）
  locked: boolean;           // 是否锁定
  sortOrder: number;         // 显示排序（支持倒序）
  items: TierItem[];         // 该行的卡片列表
}

// ── 卡片条目（图片/文字统一模型） ──
interface TierItem {
  id: string;
  type: 'image' | 'text';
  sortOrder: number;

  // 图片模式
  assetId?: string;

  // 文字模式
  text?: string;

  // 文字卡片独立样式（仅 type='text' 生效）
  textStyle?: {
    fontSize: number;          // 8-48px
    fontWeight: 300 | 400 | 600 | 800;
    fontColor: string;        // 独立文字颜色（覆盖行默认）
    bgColor: string;          // 独立背景色（覆盖行默认）
    shape: 'rounded' | 'pill' | 'sharp' | 'tag';
    borderStyle: 'none' | 'solid' | 'dashed';
    borderColor: string;
  };
}

// ── 图片素材 ──
interface Asset {
  id: string;
  fileName: string;
  data: string;              // base64
  mimeType: string;
  width: number;
  height: number;
  dominantColor?: string;    // 图片主色调（取色笔用）
}

// ── 项目全局设置 ──
interface ProjectSettings {
  aspectRatio: '3:4' | '4:3' | '9:16' | '16:9' | '1:1' | 'custom';
  customRatio?: { w: number; h: number };
  backgroundColor: string;
  backgroundType: 'solid' | 'gradient-linear' | 'gradient-radial' | 'image' | 'transparent';
  backgroundImageAssetId?: string;
  cardCornerRadius: number;   // 卡片圆角 px
  gapSize: number;            // 卡片间距 px
  rowGapSize: number;         // 行间距 px
  fontFamily: string;
  titleText: string;          // 顶部大标题
  titleFontSize: number;
  titleColor: string;
  titleVisible: boolean;
  watermark: string;          // 水印文字（空=无水印）
  watermarkPosition: 'tl' | 'tr' | 'bl' | 'br';
  themeName?: string;         // 当前使用的主题名
}

// ── 模板数据结构（保存/分享用） ──
interface TierTemplate {
  version: string;
  name: string;              // 模板名称
  description: string;       // 模板说明
  icon: string;              // Emoji 图标
  tiers: {
    label: string;
    color: string;
    textColor: string;
    borderStyle: string;
    borderColor: string;
  }[];                       // 仅保存分级结构，不含卡片内容
  settings: Pick<ProjectSettings,
    'backgroundColor' | 'backgroundType' |
    'cardCornerRadius' | 'gapSize' | 'rowGapSize' |
    'fontFamily' | 'aspectRatio'
  >;
}
```

### 7.2 状态管理架构 (Zustand)

```
useProjectStore                    // 项目状态
├── project: Project               // 当前项目数据
├── history: Project[]             // 撤销历史栈
├── historyIndex: number           // 当前位置
├── isDirty: boolean               // 是否有未保存修改
├── selectedTierId: string | null  // 当前选中的行（右侧面板联动）
├── selectedItemIds: Set<string>   // 多选卡片
├── actions:
│   ├── addAsset()                 // 导入图片
│   ├── moveItem()                 // 拖拽移动卡片
│   ├── reorderItem()              // 行内排序
│   ├── updateTierLabel()          // 编辑标签
│   ├── updateTierColor()          // 改行颜色
│   ├── addTier() / removeTier()   // 增减分级行
│   ├── reorderTiers()             // 行排序
│   ├── selectTier()               // 选中行
│   ├── undo() / redo()            // 撤销/重做
│   ├── exportImage()              // 导出
│   ├── saveProject() / loadProject()
│   └── applyTemplate()           // 套用模板

useTemplateStore                   // 模板状态
├── builtinTemplates: TierTemplate[]  // 内置模板
├── customTemplates: TierTemplate[]   // 用户自定义模板
├── actions:
│   ├── saveAsTemplate()
│   ├── deleteTemplate()
│   ├── exportTemplate()           // 导出 .hangtolatem
│   └── importTemplate()           // 导入 .hangtolatem

useUIStore                         // UI 状态
├── mode: 'image' | 'text' | 'mixed'
├── sidebarCollapsed: boolean
├── assetPanelCollapsed: boolean
├── settingsPanelCollapsed: boolean
├── themeMode: 'light' | 'dark' | 'system'
└── ...
```

### 7.3 模块划分

```
src/
├── main.tsx                    # React 入口
├── App.tsx                     # 根组件
├── components/
│   ├── layout/
│   │   ├── MenuBar.tsx         # 顶部菜单
│   │   ├── Toolbar.tsx         # 工具栏
│   │   └── StatusBar.tsx       # 底部状态栏
│   ├── tier/
│   │   ├── TierPanel.tsx       # 主画布（含所有行）
│   │   ├── TierRow.tsx         # 单行梯队
│   │   ├── TierLabel.tsx       # 左侧标签
│   │   └── TierDropZone.tsx    # 放置区域
│   ├── card/
│   │   ├── ImageCard.tsx         # 图片卡片
│   │   └── TextCard.tsx          # 文字卡片（含富样式）
│   ├── asset/
│   │   ├── AssetPanel.tsx        # 素材暂存区（可折叠）
│   │   └── AssetThumb.tsx        # 素材缩略图
│   ├── settings/
│   │   ├── ColorPicker.tsx       # 颜色选择器（色盘+HEX+取色笔）
│   │   ├── RatioSelector.tsx     # 比例选择
│   │   ├── ThemeSelector.tsx     # 主题选择
│   │   ├── TierSettings.tsx      # 行属性面板（右侧联动）
│   │   └── GlobalSettings.tsx    # 全局样式设置
│   ├── template/
│   │   ├── TemplateLibrary.tsx   # 模板库面板（左侧）
│   │   ├── TemplateCard.tsx      # 单个模板卡片
│   │   └── TemplateSaveDialog.tsx # 保存模板对话框
│   └── export/
│       └── ExportDialog.tsx    # 导出对话框
├── stores/
│   ├── projectStore.ts           # 项目状态
│   ├── templateStore.ts           # 模板状态
│   └── uiStore.ts                 # UI 状态
├── hooks/
│   ├── useDragAndDrop.ts       # 拖拽逻辑
│   ├── useExport.ts            # 导出逻辑
│   └── useKeyboard.ts         # 快捷键
├── utils/
│   ├── image.ts                # 图片处理工具
│   ├── render.ts               # 画布渲染
│   └── file.ts                 # 文件读写
└── types/
    └── index.ts                # 类型定义

src-tauri/
├── Cargo.toml
├── tauri.conf.json
├── capabilities/
│   └── default.json            # 权限声明
└── src/
    ├── main.rs                 # Rust 入口
    ├── lib.rs                  # Tauri 插件注册
    ├── commands/
    │   ├── mod.rs
    │   ├── image.rs            # 图片处理命令
    │   ├── export.rs           # 导出渲染命令
    │   └── project.rs          # 项目文件读写
    └── utils/
        ├── mod.rs
        └── image_utils.rs      # image-rs 封装
```

---

## 8. 导出规格

### 8.1 导出画布构成

```
┌────────────────────────────────────────┐
│            [标题文字: 可选]             │
│                                        │
│  ┌──────┐  ┌──────────────────────┐    │
│  │ 夯   │  │ [卡] [卡] [卡] [卡]  │    │
│  ├──────┤  ├──────────────────────┤    │
│  │ 顶级 │  │ [卡] [卡] [卡]       │    │
│  ├──────┤  ├──────────────────────┤    │
│  │人上人│  │ [卡] [卡]            │    │
│  ├──────┤  ├──────────────────────┤    │
│  │ NPC  │  │ [卡] [卡] [卡] [卡]  │    │
│  ├──────┤  ├──────────────────────┤    │
│  │ 拉   │  │ [卡]                 │    │
│  └──────┘  └──────────────────────┘    │
│                                        │
│        [水印/签名: 可选]               │
└────────────────────────────────────────┘
```

### 8.2 导出参数对照表

| 比例 | 1x 分辨率 | 2x 分辨率 | 3x 分辨率 | 适用场景 |
|------|----------|----------|----------|----------|
| 3:4 | 900×1200 | 1800×2400 | 2700×3600 | 小红书/朋友圈 |
| 4:3 | 1200×900 | 2400×1800 | 3600×2700 | 横版通用 |
| 9:16 | 1080×1920 | 2160×3840 | — | 抖音/快手 |
| 16:9 | 1920×1080 | 3840×2160 | — | B站封面 |
| 1:1 | 1080×1080 | 2160×2160 | — | Instagram |
| 自定义 | 按比例算 | — | — | 用户自定 |

### 8.3 导出流程

```
用户点击导出 → 弹出 ExportDialog
  → 选择比例 (可多选)
  → 选择分辨率 (1x/2x/3x)
  → 选择格式 (PNG/JPG/WebP)
  → 选择保存路径
  → [开始导出]
    → Rust 端读取画布状态 JSON
    → resvg 按比例渲染 SVG → 按分辨率缩放
    → image-rs 编码输出
    → 写入磁盘 + 通知前端完成
```

---

## 9. 开发环境与国内镜像配置

> ⚠️ **重要：以下所有下载操作必须使用国内镜像，确保速度和稳定性。**

### 9.1 Node.js / npm 镜像

```bash
# 1. 设置 npm 镜像（永久生效）
npm config set registry https://registry.npmmirror.com

# 2. 验证
npm config get registry
# 应输出: https://registry.npmmirror.com

# 3. 安装 nrm 方便切换
npm install -g nrm --registry=https://registry.npmmirror.com
nrm use taobao
```

**备选镜像源：**
| 镜像 | 地址 |
|------|------|
| 阿里云 npmmirror (推荐) | `https://registry.npmmirror.com` |
| 腾讯云 | `https://mirrors.cloud.tencent.com/npm/` |
| 华为云 | `https://repo.huaweicloud.com/repository/npm/` |

### 9.2 Rust / Cargo 镜像

```bash
# 方法1：设置环境变量（推荐）
# Windows PowerShell 管理员运行：
[System.Environment]::SetEnvironmentVariable('RUSTUP_DIST_SERVER', 'https://mirrors.tuna.tsinghua.edu.cn/rustup', 'User')
[System.Environment]::SetEnvironmentVariable('RUSTUP_UPDATE_ROOT', 'https://mirrors.tuna.tsinghua.edu.cn/rustup/rustup', 'User')

# 方法2：配置 cargo 镜像（创建或编辑 %USERPROFILE%\.cargo\config.toml）
```

**`~/.cargo/config.toml` 配置内容：**
```toml
[source.crates-io]
replace-with = 'tuna'

[source.tuna]
registry = 'https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git'

[source.ustc]
registry = 'https://mirrors.ustc.edu.cn/crates.io-index.git'

[source.rsproxy]
registry = 'https://rsproxy.cn/crates.io-index.git'

[net]
git-fetch-with-cli = true
```

**备选 Cargo 镜像：**
| 镜像 | 地址 |
|------|------|
| 清华 tuna (推荐) | `https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git` |
| 中科大 USTC | `https://mirrors.ustc.edu.cn/crates.io-index.git` |
| RSProxy (字节) | `https://rsproxy.cn/crates.io-index.git` |

### 9.3 Rust 工具链安装

```bash
# 下载 rustup-init.exe（从国内镜像）
# 地址: https://mirrors.tuna.tsinghua.edu.cn/rustup/rustup/init/windows/x86_64/rustup-init.exe

# 安装时自动使用国内镜像：
# 在安装向导中，选择 "2) Customize installation"
# 修改 default host triple: x86_64-pc-windows-msvc
# 修改 default toolchain: stable
# 修改 profile: default
# 修改 modify PATH: y
# 然后输入: RUSTUP_DIST_SERVER=https://mirrors.tuna.tsinghua.edu.cn/rustup
#         RUSTUP_UPDATE_ROOT=https://mirrors.tuna.tsinghua.edu.cn/rustup/rustup

# 验证安装
rustc --version
cargo --version
```

### 9.4 Tauri 依赖 (Windows)

```bash
# 1. 安装 Microsoft Visual Studio Build Tools 2022
#    国内下载: https://visualstudio.microsoft.com/zh-hans/downloads/
#    或使用 VS2022 Community (免费)
#    必须勾选: "使用 C++ 的桌面开发" 工作负载

# 2. 安装 WebView2 (Windows 10 21H2+ 已内置，Win11 已内置)
#    如需手动安装: https://developer.microsoft.com/zh-cn/microsoft-edge/webview2/

# 3. 安装 Tauri CLI
npm install -g @tauri-apps/cli --registry=https://registry.npmmirror.com
# 或
cargo install tauri-cli --registry=tuna
```

### 9.5 Python (可选，AI 功能开发时)

```bash
# pip 配置清华源
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/
pip config set install.trusted-host pypi.tuna.tsinghua.edu.cn

# 或使用 uv (更快)
# 下载 uv: https://github.com/astral-sh/uv/releases
uv config set index-url https://pypi.tuna.tsinghua.edu.cn/simple/
```

### 9.6 其他工具国内镜像

| 工具 | 国内镜像/加速 |
|------|--------------|
| Git for Windows | https://registry.npmmirror.com/binary.html?path=git-for-windows/ |
| Node.js 安装包 | https://registry.npmmirror.com/binary.html?path=node/ |
| VS Code | https://vscode.cdn.azure.cn (Azure CDN 中国) |
| GitHub Release | https://ghproxy.com/ 或 https://gh.llkk.cc/ (代理加速) |
| 7-Zip | https://www.7-zip.org/ (较小，直连也可) |

---

## 10. 项目里程碑与排期

### 10.1 开发阶段

| 阶段 | 内容 | 预计时间 | 交付物 |
|------|------|----------|--------|
| **P0: 预备** | 环境搭建、技术验证、UI 原型 | 1 周 | 可运行的 Tauri Hello World |
| **P1: MVP 核心** | F1-F4 (面板+导入+拖拽+文字) | 3-4 周 | 可拖拽排序的可运行版本 |
| **P2: 外观定制** | F5 (配色+字体+背景) | 1-2 周 | 完整编辑体验 |
| **P3: 导出系统** | F6 (多格式多比例导出) | 2-3 周 | 高质量导出功能 |
| **P4: 项目管理** | F7 (保存/打开/自动保存) | 1 周 | 完整工作流闭环 |
| **P5: 打磨发布** | 测试、优化、签名、打包 | 2 周 | 正式版 v1.0.0 |
| **P6: 迭代** | F8-F11 (模板/AI/视频/社区) | 持续迭代 | v1.1+ |

### 10.2 MVP 发布标准

- [ ] 可导入 10+ 张图片
- [ ] 拖拽操作流畅（60fps）
- [ ] 五级梯队完整渲染
- [ ] 至少 2 种比例导出 PNG
- [ ] 基础配色切换
- [ ] 保存/打开项目
- [ ] Windows 10/11 兼容
- [ ] 安装包 < 50MB

---

## 11. 风险与约束

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| Tauri v2 API 不稳定 | 中 | 高 | 锁定稳定版，提前验证核心 API |
| WebView2 未安装 (旧Win10) | 低 | 中 | 安装包检测并引导安装 |
| 大图导出内存溢出 | 中 | 中 | 分块渲染，限制最大分辨率 |
| 国内 Rust 生态不熟 | 中 | 低 | 预留充足学习时间，Electron 作为 fallback |
| 图片版权/内容合规 | 低 | 低 | 本地处理不上传，免责声明 |
| Windows 杀软误报 | 高 | 中 | 代码签名证书，向 WD 提交审核 |

---

## 12. 待与用户确认事项

> ⚠️ **以下事项需要你明确回复，我将据此调整 SPEC 并开始开发。**

### 🔴 必须确认 (阻塞开发)

#### Q1: 技术栈选择
**推荐方案 A**：Tauri v2 + React（安装包 ~8MB，性能好，但 Rust 上手曲线陡）

**备选方案 B**：Electron + React（安装包 ~150MB，技术成熟，中文教程多）

**备选方案 C**：Python + PyInstaller + PyQt6（开发最快，但 UI 美观度有限）

> 👉 **我的推荐是方案 A (Tauri)**，你倾向哪个？是否有 Rust 开发经验？

#### Q2: 目标用户群体优先级
你更看重哪类用户？

- [ ] **A. 内容创作者**（需要高质量导出、批量处理、视频封面比例）
- [ ] **B. 普通网民**（需要极其简单、一键出图、免费）
- [ ] **C. 两者兼顾**（MVP 优先保证简单性，导出功能做完善）

#### Q3: 盈利模式
- [ ] **A. 完全免费开源**（MIT / GPL 协议）
- [ ] **B. 免费 + 捐赠**（保留打赏入口）
- [ ] **C. 免费基础版 + 付费专业版**（进阶功能收费，如 AI 功能、视频导出）
- [ ] **D. 一次性买断**（如 ¥6-12 定价）

#### Q4: AI 功能优先级
是否需要 v1.0 就包含 AI 功能（自动抠图、AI 排序建议）？

- [ ] **A. v1.0 不需要**，先做好核心编辑和导出体验
- [ ] **B. v1.0 需要基础 AI**（至少自动抠图）
- [ ] **C. v1.0 需要全部 AI 功能**

> 注：AI 功能需要额外集成 Python/ONNX 模型，会增加安装包体积（+200MB+）

### 🟡 建议确认 (影响方向)

#### Q5: 界面语言
- [ ] **A. 仅中文**（符合目标受众，开发快）
- [ ] **B. 中英双语**（预留国际化框架，方便后续扩展）

#### Q5b: 黑夜/白天模式 — 默认选项 ⭐ 新增
工具栏提供 ☀️白天 / 🌙黑夜 / 🖥️跟随系统 三选一。首次启动默认应该是什么？

- [ ] **A. 跟随系统**（推荐 — Windows 设什么就什么）
- [ ] **B. 白天模式**（亮色优先，符合大多数用户的习惯）
- [ ] **C. 黑夜模式**（暗色优先，UI 更酷更护眼）

#### Q5c: UI 视觉风格确认
上面 §5 设计规范采用了 **Glassmorphism（毛玻璃）+ 微拟物 + 深浅双模** 风格，对标 Linear/Notion 级别质感。是否认可这个方向？

- [ ] **A. 认可，就按这个来**
- [ ] **B. 更简约**（减少毛玻璃，更扁平）
- [ ] **C. 更炫酷**（增加霓虹/光效/粒子背景）
- [ ] **D. 我有参考图**（请发给我看看）

#### Q6: 自带素材
是否需要内置一批默认图片/图标素材供用户使用？（会增加安装包体积）

- [ ] **A. 不需要**，用户自己导入图片
- [ ] **B. 需要内置**（常见分类图标、等级 Emoji 贴纸等）
- [ ] **C. 仅内置 Emoji 图标集**（轻量，用于等级标签）

#### Q7: 品牌命名
- [ ] **A.** 「从夯到拉排序」— 直接明了
- [ ] **B.** 「夯拉排行」— 简洁
- [ ] **C.** 「TierMaker Pro」— 国际化
- [ ] **D.** 你有其他想法？

### 🟢 可选确认 (锦上添花)

#### Q8: 是否需要安装包同时提供便携版（免安装绿色版 .zip）？

#### Q9: 是否需要在软件中内置「使用教程/视频教程」入口？

#### Q10: 是否需要支持插件系统（允许社区开发自定义模板/主题）？

#### Q11: 除 6 套内置模板外，还需要哪些场景模板？
> 目前计划内置：🎮 游戏角色 / 🍔 美食评价 / 📱 数码评测 / 📚 学科吐槽 / 🏀 体育球员 / ⭐ 经典夯到拉

- [ ] 这 6 套够了
- [ ] 还需要：________（请补充）

#### Q12: 模板文件交换格式
模板文件 (.hangtolatem) 应包含什么？

- [ ] **A. 仅分级结构**（标签+颜色+数量，不含图片/卡片内容）
- [ ] **B. 分级结构 + 卡片文字内容**（可附带文字卡片预设）
- [ ] **C. 完整项目**（含嵌入图片，文件较大）

---

## 附录 A: 参考资料

- [从夯到拉生成器 - App Store](https://apps.apple.com/cn/app/%E4%BB%8E%E5%A4%AF%E5%88%B0%E6%8B%89%E7%94%9F%E6%88%90%E5%99%A8/id6766392888)
- [TierKing 夯到拉表格制作器](https://www.tierking.com/maker/hang-to-la)
- [从夯到拉模板生成器](https://t.baozangapp.com/hangdaola/)
- [TierRanker 视频生成器](https://www.appmiao.com/article/1936)
- [Tauri v2 官方文档](https://v2.tauri.app/)
- [Shadcn/ui 组件库](https://ui.shadcn.com/)
- [dnd-kit 拖拽库](https://dndkit.com/)

## 附录 B: 术语表

| 术语 | 英文 | 含义 |
|------|------|------|
| 夯 | Hot/Top | 五级中最高评价 |
| 拉 | Trash/Worst | 五级中最低评价 |
| 梯队 | Tier | 一个等级行 |
| 卡片 | Card | 梯队中的单个条目 |
| 素材 | Asset | 导入的原始图片 |
| 画布 | Canvas | 最终可见的排列区域 |

---

> 📌 **下一步**：请逐一确认第 12 节中的待确认事项（共 14 个问题）。确认后我将更新 SPEC 为最终版，并开始搭建开发环境（全程使用国内镜像 — 清华/阿里源）。

---

## 📊 更新摘要

### v1.0.3-draft (当前版本)

| 更新项 | 内容 |
|--------|------|
| **§4.6 Win11 适配** | 新增完整章节：Mica + Acrylic 材质体系、DWM 原生圆角、自绘 Win11 标题栏(36px)、Snap Layouts 原生贴靠、Acrylic 右键菜单、Win11 强调色跟随、原生 Toast 通知、Win10 兼容降级表、Tauri + Rust 配置代码 |
| §4.2 兼容性 | Win11 标记为主要目标平台，新增 Fluent Design 语言要求 |
| 图标方案 | lucide-react → **iconfont.cn**（阿里巴巴矢量图标库），写入长期记忆 |

### v1.0.2-draft

| 更新项 | 内容 |
|--------|------|
| **F2 图片系统** | 从 4 行 → 5 大子功能：卡片图片 / 自定义背景图片 / 等级行图标 / 图片轻编辑（裁剪旋转滤镜）/ 素材区管理 |
| **§5 UI 设计** | 从 20 行 → 270 行完整设计规范：Design System、Glassmorphism + 微拟物、深浅双模、8 种动画、10+ 微交互、全状态设计、15 快捷键 |
| **F5.6 黑夜/白天** | 三模式切换（白天/黑夜/跟随系统）、独立视觉调校、导出双版本 |
| Q5b/Q5c/Q6 扩展 | UI 风格确认 + 黑夜默认 + Emoji 图标集 |
| 确认问题 | 从 12 → 15 个 |

### v1.0.1-draft

| 更新项 | 内容 |
|--------|------|
| 产品定位 | 从「五级夯到拉工具」升级为 **万能分级排名器**（3~15 级自由定义） |
| F1 分级体系 | 新增 6 项子功能：数量自由控制、标签完全自定义、每行独立配色、行排序拖拽、行高级设置、场景模板快速套用 |
| F4 文字模式 | 新增 5 项子功能：批量导入、独立卡片样式、文字预设风格、混合模式、粘贴导入 |
| F5 模板系统 | 10 套全局主题 + 6 套内置场景模板 + 自定义模板保存/导入/导出 (.hangtolatem) |
| UI 布局 | 增加模板库面板（左侧）+ 行属性联动面板（右侧） |
| 数据模型 | 扩展 `Tier`, `TierItem`, `ProjectSettings` 支持完全自定义，新增 `TierTemplate` 接口 |
| 状态管理 | 新增 `templateStore`，增加 `selectedTierId`/`selectedItemIds` 联动状态 |
| 模块目录 | 新增 `template/` 和扩展 `settings/` 组件目录 |
| 确认问题 | 从 10 个扩展到 12 个（+Q11 场景模板 + Q12 模板交换格式） |

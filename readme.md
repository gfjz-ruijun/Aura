# Aura - 科技感个人网站主题

## 介绍

Aura 是一个充满科技感与未来主义风格的个人网站主题，专为展示您的作品、技能和博客而设计。它融合了毛玻璃、流光粒子和动态发光效果等现代视觉元素，营造出独特的视觉“光环”与沉浸式体验，帮助您在众多个人网站中脱颖而出。

## 特点

*   **科技感设计**: 运用毛玻璃、发光和粒子效果，打造前卫的视觉风格。
*   **响应式布局**: 适配不同设备，提供流畅的浏览体验。
*   **平滑滚动**: 优化页面滚动效果，提升用户体验。
*   **逐字显示动画**: 吸引眼球的文本加载动画。
*   **背景音乐控制**: 可选的背景音乐播放功能。
*   **RSS 博客集成**: 方便展示您的最新博客文章。
*   **可定制性**: 通过修改 CSS 变量轻松调整主题颜色和样式。

## 使用方法

1.  **下载主题**: 将本主题的所有文件下载到您的本地。
2.  **部署文件**: 将 `index.html`, `style.css`, `script.js`, `loading.js`, `particles.js` (如果包含), 字体文件 (`.ttf`), 图片文件 (`.png`, `.jpg`) 以及音频文件 (`.mp3`) 等部署到您的 Web 服务器或托管平台。
3.  **配置内容**: 
    *   修改 `index.html` 文件中的文本内容，替换为您的个人信息、项目、技能和联系方式。
    *   更新图片文件 (`placeholder-profile.jpg`, `sitelogo_new.png`) 为您自己的图片。
    *   替换背景音乐文件 (`61tfq-qdrmd.mp3`) 为您喜欢的音乐，并更新 `index.html` 中 `<audio>` 标签的 `src` 属性。
    *   修改 RSS Feed URL (`script.js` 文件中的 `rssFeedUrl`) 为您的博客 RSS 地址。
4.  **定制样式**: 
    *   编辑 `style.css` 文件。
    *   修改 `:root` 中定义的 CSS 变量（如 `--primary-color`, `--background-color`, `--text-color` 等）来调整主题颜色。
    *   根据需要调整其他 CSS 规则来进一步定制布局和样式。
5.  **移动端适配**: 主题已包含基础的移动端适配样式。如果您需要进一步调整，请修改 `style.css` 文件中的 `@media (max-width: 768px)` 媒体查询部分。

## 文件结构
├── index.html          # 网站主页结构
├── style.css           # 网站样式文件
├── script.js           # 网站交互脚本
├── loading.js          # 加载动画脚本 (如果独立)
├── particles.js        # 粒子效果库 (如果使用)
├── AiNiZaiHuangHunRiLuoShouXieTi-2.ttf # 字体文件
├── 61tfq-qdrmd.mp3     # 背景音乐文件
├── placeholder-profile.jpg # 示例图片
├── sitelogo_new.png    # 网站Logo
└── readme.md           # 主题介绍与使用文档
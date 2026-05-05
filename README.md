# wordbook-plugin

单词本 Chrome 插件，支持批量收藏单词到有道词典。

## 技术栈

- Manifest V3（最新版 Chrome 扩展标准）
- Vanilla JS（无依赖）
- Chrome Cookies API（跨域获取登录态）
- Fetch API（调用有道词典接口）

## 安装/打包

1. 打开 `chrome://extensions/`
2. 开启 **开发者模式**
3. 点击 **"打包扩展程序"**
4. 选择本文件夹，生成 `.crx` 文件

## 使用

1. 加载扩展：点击 **"加载已解压的扩展程序"** → 选择本文件夹
2. 在弹出窗口输入有道词典页面 URL 和单词列表
3. 点击提交批量收藏

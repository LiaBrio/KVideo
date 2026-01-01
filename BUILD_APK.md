# APK 打包指南

本指南说明如何将 KVideo 项目打包成 Android APK 文件。

## ⚠️ 重要说明

**静态导出限制：**
- 使用 `output: 'export'` 进行静态导出时，Next.js 会**跳过所有 API 路由**
- API 路由无法在静态站点中运行
- 这意味着 `/api/*` 路径的功能将无法使用

**解决方案：**
如果需要 API 功能，可以考虑：
1. 使用客户端直接调用外部 API（需要处理 CORS）
2. 使用代理服务
3. 或者使用 Vercel 等平台部署，然后通过 WebView 加载

## 📋 前置要求

1. **Node.js** 18+ 已安装
2. **Android Studio** 已安装
3. **Java JDK** 11+ 已安装
4. **Android SDK** 已配置

## 🚀 构建步骤

### 方法一：使用构建脚本（推荐）

```bash
# Windows
build-apk.bat

# Linux/Mac
BUILD_APK=true npm run build
```

### 方法二：手动构建

```bash
# 1. 设置环境变量启用静态导出
export BUILD_APK=true  # Linux/Mac
set BUILD_APK=true     # Windows

# 2. 构建静态文件
npm run build

# 3. 静态文件会生成在 out 目录中
```

## 📦 使用 Capacitor 打包 APK

### 1. 安装 Capacitor Android

```bash
npm install @capacitor/android
```

### 2. 初始化 Android 项目

```bash
npx cap add android
```

### 3. 配置 Capacitor

创建或编辑 `capacitor.config.ts`：

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kvideo.app',
  appName: 'KVideo',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

### 4. 同步文件

```bash
npx cap sync android
```

### 5. 在 Android Studio 中构建

1. 打开 Android Studio
2. 选择 `File > Open`，选择项目中的 `android` 目录
3. 等待 Gradle 同步完成
4. 选择 `Build > Build Bundle(s) / APK(s) > Build APK(s)`
5. APK 文件会生成在 `android/app/build/outputs/apk/debug/app-debug.apk`

## 🔧 配置说明

### next.config.ts

项目已配置为根据 `BUILD_APK` 环境变量自动切换：

- **未设置 BUILD_APK**：使用默认模式（支持 API 路由，适合 Vercel 部署）
- **BUILD_APK=true**：使用静态导出（适合 APK 打包）

### API 路由处理

所有 API 路由已添加 `export const dynamic = 'force-dynamic'` 配置，但在静态导出时仍会被跳过。

## 📝 注意事项

1. **API 路由限制**：静态导出不支持服务端 API，需要改为客户端调用
2. **图片优化**：静态导出时，Next.js 图片优化功能受限
3. **环境变量**：客户端环境变量需要使用 `NEXT_PUBLIC_` 前缀
4. **文件大小**：静态导出会生成所有页面的 HTML 文件，可能较大

## 🐛 常见问题

### Q: 构建时提示 API 路由错误？

A: 这是正常的，静态导出会跳过 API 路由。如果不需要 API 功能，可以忽略这些警告。

### Q: APK 中无法使用搜索功能？

A: 搜索功能依赖 API 路由，需要改为客户端直接调用视频源 API，或使用代理服务。

### Q: 如何测试静态导出？

A: 构建完成后，可以使用 `npx serve out` 在本地测试静态文件。

## 📚 相关资源

- [Next.js 静态导出文档](https://nextjs.org/docs/advanced-features/static-html-export)
- [Capacitor 文档](https://capacitorjs.com/docs)
- [Android Studio 下载](https://developer.android.com/studio)


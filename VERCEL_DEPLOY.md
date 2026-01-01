# Vercel 部署指南

本指南将帮助你将 KVideo 项目部署到 Vercel。

## 📋 前置要求

1. **GitHub 账号**：确保你的代码已推送到 GitHub 仓库
2. **Vercel 账号**：如果没有，可以访问 [vercel.com](https://vercel.com) 免费注册

## 🚀 部署步骤

### 方法一：通过 Vercel Dashboard 部署（推荐）

1. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 **"Add New Project"** 或 **"Import Project"**
   - 选择你的 GitHub 仓库（KVideo）
   - 点击 **"Import"**

3. **配置项目**
   - **Framework Preset**: 自动检测为 `Next.js`（无需修改）
   - **Root Directory**: 保持默认（`./`）
   - **Build Command**: `npm run build`（自动填充）
   - **Output Directory**: `.next`（自动填充）
   - **Install Command**: `npm install`（自动填充）

4. **环境变量（可选）**
   如果需要设置密码保护或订阅源，可以添加以下环境变量：
   
   - `ACCESS_PASSWORD`: 全局访问密码
   - `NEXT_PUBLIC_SUBSCRIPTION_SOURCES`: 订阅源配置（JSON 格式）
   
   示例：
   ```
   ACCESS_PASSWORD=your_secret_password
   NEXT_PUBLIC_SUBSCRIPTION_SOURCES=[{"name":"源名称","url":"https://example.com/api.json"}]
   ```

5. **部署**
   - 点击 **"Deploy"** 按钮
   - 等待构建完成（通常 2-5 分钟）
   - 部署成功后，你会获得一个 `*.vercel.app` 的域名

### 方法二：使用 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   # 在项目根目录执行
   vercel
   ```
   
   首次部署会提示：
   - 是否链接到现有项目？选择 `N`（新建项目）
   - 项目名称：输入项目名或直接回车使用默认
   - 目录：直接回车使用当前目录
   - 是否覆盖设置：直接回车

4. **生产环境部署**
   ```bash
   vercel --prod
   ```

## ⚙️ 配置说明

### vercel.json

项目已包含 `vercel.json` 配置文件，包含以下优化：

- **区域设置**: 默认使用香港区域 (`hkg1`)，可根据需要修改
- **安全头**: 自动添加安全相关的 HTTP 头
- **框架检测**: 自动识别 Next.js 框架

### next.config.ts

已针对 Vercel 优化：
- 移除了 `standalone` 输出模式（Vercel 使用 serverless 函数）
- 保留了图片优化配置
- 保留了远程图片域名配置

## 🔄 自动部署

Vercel 会自动：
- 监听 GitHub 仓库的推送
- 在每次推送后自动重新部署
- 为每个 Pull Request 创建预览部署

## 🌍 自定义域名

1. 在 Vercel Dashboard 中进入项目设置
2. 点击 **"Domains"** 标签
3. 添加你的自定义域名
4. 按照提示配置 DNS 记录

## 📊 监控和分析

项目已集成 `@vercel/analytics`，部署后会自动启用：
- 页面访问统计
- 性能监控
- 错误追踪

## 🔧 常见问题

### 1. 构建失败

**问题**: 构建过程中出现错误

**解决方案**:
- 检查 `package.json` 中的依赖是否正确
- 确保 Node.js 版本兼容（推荐 18.x 或更高）
- 查看 Vercel 构建日志中的详细错误信息

### 2. API 路由超时

**问题**: API 请求超时

**解决方案**:
- 项目使用 Edge Runtime，有 30 秒的硬限制
- 如果请求时间较长，考虑优化 API 逻辑或使用流式响应

### 3. 环境变量未生效

**问题**: 设置的环境变量没有生效

**解决方案**:
- 确保环境变量名称正确
- 对于 `NEXT_PUBLIC_*` 前缀的变量，需要重新部署才能生效
- 检查变量值格式是否正确（特别是 JSON 格式）

### 4. 图片加载失败

**问题**: 远程图片无法加载

**解决方案**:
- 检查 `next.config.ts` 中的 `remotePatterns` 配置
- 确保图片域名已添加到允许列表
- 某些图片源可能需要代理

## 📝 注意事项

1. **免费计划限制**:
   - 每月 100GB 带宽
   - Serverless 函数执行时间限制
   - Edge Runtime 30 秒超时限制

2. **区域选择**:
   - 默认使用香港区域 (`hkg1`)
   - 可在 `vercel.json` 中修改 `regions` 配置
   - 建议选择距离用户最近的区域

3. **构建优化**:
   - Vercel 会自动优化 Next.js 构建
   - 静态页面会自动使用 CDN 加速
   - API 路由使用 Edge Runtime 实现低延迟

## 🎉 完成！

部署成功后，你的 KVideo 应用就可以通过 Vercel 提供的域名访问了！

如有问题，请查看：
- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [项目 Issues](https://github.com/KuekHaoYang/KVideo/issues)


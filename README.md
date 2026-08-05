[English](./README.en.md)

# WorkDay 工作日看板

<!-- codex-github-rules:bilingual-summary -->
> **中文简介**：工作日数据看板

> **English summary**: A workday data dashboard

---

WorkDay 是一个面向办公室与知识工作者的工作日时间看板。默认首页聚焦下班倒计时和剩余时间分配，长期计划、时间洞察与数据设置通过独立页面或抽屉进入。

## 功能

- 实时下班倒计时与工作日进度
- 按可配置分钟数拆分剩余时间块
- 时间分区建立、编辑和时间块分配
- 长期事项倒计时管理
- 年度进度与计划数量洞察
- 浅色、深色主题
- 本地 JSON 与 Google Drive 备份
- 兼容旧版 WorkDay JSON 和分散的 `localStorage` 数据

## 本地开发

```powershell
npm install
npm run dev
```

## 验证

```powershell
npm run typecheck
npm test
npm run build
```

## 技术栈

React、TypeScript、Vite、Vitest、Zod 和 Lucide Icons。主分支通过 GitHub Actions 构建并发布到 GitHub Pages。

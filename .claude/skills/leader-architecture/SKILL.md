---
name: leader-architecture
description: |
  创建或编辑 LiteSaaS 技术架构文档。当用户说"架构文档"、"leader-architecture"、"创建架构"、"编辑架构"时触发。
---

# 架构文档管理

> 你是 LiteSaaS 项目的主导者，执行架构文档管理流程。

## 流程

### 1. 身份验证

读取 `CLAUDE.md`，确认 `role: leader`。

### 2. 前置检查

检查需求文档 `_bmad-output/planning-artifacts/requirements.md` 是否存在：
- 如果不存在 → 提醒"架构依赖需求文档，请先运行 /leader-requirement"
- 如果存在 → 继续

### 3. 检查现有文档

检查 `_bmad-output/implementation-artifacts/architecture.md` 是否存在：
- 如果存在 → 询问是「查看」还是「编辑」
- 如果不存在 → 引导创建

### 4. 引导内容

架构文档应包含以下章节：
1. **系统架构** - 架构图、分层说明
2. **模块划分** - 模块列表、职责
3. **数据库设计** - 表结构、关系
4. **API 规范** - 接口规范、命名约定
5. **目录结构** - 前后端目录结构

### 5. 输出

文件路径：`_bmad-output/implementation-artifacts/architecture.md`

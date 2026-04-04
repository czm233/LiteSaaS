---
name: leader-requirement
description: |
  创建或编辑 LiteSaaS 需求文档。当用户说"需求文档"、"leader-requirement"、"创建需求"、"编辑需求"时触发。
---

# 需求文档管理

> 你是 LiteSaaS 项目的主导者，执行需求文档管理流程。

## 流程

### 1. 身份验证

读取 `AGENTS.md`，确认 `role: leader`。

### 2. 检查现有文档

检查 `_bmad-output/planning-artifacts/requirements.md` 是否存在：
- 如果存在 → 询问是「查看」还是「编辑」
- 如果不存在 → 引导创建

### 3. 引导内容

需求文档应包含以下章节：
1. **产品定位** - 产品是什么，解决什么问题
2. **核心功能** - 功能清单
3. **权限模型** - 权限层级、数据权限
4. **技术栈** - 前后端技术栈
5. **非功能需求** - 性能、安全等

### 4. 输出

文件路径：`_bmad-output/planning-artifacts/requirements.md`

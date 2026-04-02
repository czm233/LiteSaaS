---
name: leader-status
description: |
  查看 LiteSaaS 项目当前状态，包含文档完成度和 Story 统计。
  当用户说"项目状态"、"leader-status"、"查看进度"时触发。
---

# 查看项目状态

> 你是 LiteSaaS 项目的主导者，执行项目状态检测流程。

## 流程

### 1. 身份验证

读取项目根目录的 `CLAUDE.md`，获取用户 `role`：
- 如果 `role: collaborator` → 提醒"这是主导者命令"
- 如果 `role: leader` → 继续

### 2. 检测文档完成度

检查以下文件是否存在及内容完整性：

| 文件 | 路径 |
|------|------|
| 需求文档 | `_bmad-output/planning-artifacts/requirements.md` |
| 架构文档 | `_bmad-output/implementation-artifacts/architecture.md` |
| Story 文件 | `_bmad-output/implementation-artifacts/stories/*.md` |
| 任务板 | `docs/TASKBOARD.md` |

### 3. 统计 Story 状态

扫描所有 Story 文件，统计各状态数量：
- 待开始
- 进行中
- 待审核
- 已完成

### 4. 输出结果

```
📊 LiteSaaS 项目状态

## 文档完成度
| 文档 | 状态 | 完成度 |
|------|------|--------|
| 需求文档 | ✅/🟡/❌ | x% |
| 架构文档 | ✅/🟡/❌ | x% |
| Story 拆分 | ✅/🟡/❌ | x% |

## Story 统计
| 状态 | 数量 |
|------|------|
| 待开始 | x |
| 进行中 | x |
| 待审核 | x |
| 已完成 | x |

## 建议下一步
根据当前状态，建议运行：/leader-xxx
```

---
name: litesaas-leader
description: |
  LiteSaaS 主导者工作流。用于：需求管理、架构设计、Story 拆分、任务分配、代码审核。
  当用户说"主导者"、"leader"、"我的工作流"、"规划需求"、"拆分任务"、"审核代码"时触发。
---

# LiteSaaS 主导者工作流

> 你是 LiteSaaS 项目的主导者，负责需求规划、架构设计、任务分配和代码审核。

## 👤 身份验证

首先读取 `CLAUDE.md` 确认用户身份：
- 如果 `role: leader` → 继续
- 如果 `role: collaborator` → 提醒用户这不是他的 workflow

## 📊 项目状态检测

检测以下文件是否存在并评估完成度：

| 文件 | 路径 | 检测内容 |
|------|------|----------|
| 需求文档 | `_bmad-output/planning-artifacts/requirements.md` | 是否存在、内容完整性 |
| 架构文档 | `_bmad-output/implementation-artifacts/architecture.md` | 是否存在、内容完整性 |
| Story 文件 | `_bmad-output/implementation-artifacts/stories/*.md` | 数量、分配情况 |
| 任务板 | `docs/TASKBOARD.md` | 是否存在、状态 |

## 🎯 可用命令

### /leader-status

**功能**：查看项目当前状态

**输出**：
```
📊 LiteSaaS 项目状态

## 文档完成度
| 文档 | 状态 | 完成度 |
|------|------|--------|
| 需求文档 | ✅ 已完成 | 100% |
| 架构文档 | 🟡 进行中 | 50% |
| Story 拆分 | ❌ 未开始 | 0% |

## Story 统计
| 状态 | 数量 |
|------|------|
| 待开始 | 0 |
| 进行中 | 0 |
| 待审核 | 0 |
| 已完成 | 0 |

## 建议下一步
根据当前状态，建议运行：/leader-architecture
```

---

### /leader-requirement

**功能**：创建或编辑需求文档

**流程**：
1. 检查是否已存在需求文档
2. 如果存在，询问是「查看」还是「编辑」
3. 如果不存在，引导用户创建

**输出文件**：`_bmad-output/planning-artifacts/requirements.md`

**模板**：
```markdown
# LiteSaaS 需求文档

## 1. 产品定位
<!-- 产品是什么，解决什么问题 -->

## 2. 核心功能
<!-- 功能清单 -->

## 3. 权限模型
<!-- 权限层级、数据权限 -->

## 4. 技术栈
<!-- 前后端技术栈 -->

## 5. 非功能需求
<!-- 性能、安全等 -->
```

---

### /leader-architecture

**功能**：创建或编辑架构文档

**流程**：
1. 检查需求文档是否存在（架构依赖需求）
2. 引导用户设计：
   - 系统分层（前端、后端、数据库）
   - 模块划分
   - 数据库设计
   - API 规范

**输出文件**：`_bmad-output/implementation-artifacts/architecture.md`

**模板**：
```markdown
# LiteSaaS 技术架构

## 1. 系统架构
<!-- 架构图、分层说明 -->

## 2. 模块划分
<!-- 模块列表、职责 -->

## 3. 数据库设计
<!-- 表结构、关系 -->

## 4. API 规范
<!-- 接口规范、命名约定 -->

## 5. 目录结构
<!-- 前后端目录结构 -->
```

---

### /leader-create-story

**功能**：创建新的 Story

**流程**：
1. 检查架构文档是否存在（Story 依赖架构）
2. 询问 Story 信息：
   - 标题
   - 描述
   - Owner（协作者名字）
   - 优先级
3. 生成 Story 文件

**输出文件**：`_bmad-output/implementation-artifacts/stories/STORY-xxx.md`

**模板**：
```markdown
# STORY-xxx: [标题]

## 基本信息
- **Owner**: [协作者名字]
- **状态**: 待开始
- **优先级**: P0 | P1 | P2
- **预计工时**: [x天/x小时]

## 需求描述
<!-- 详细描述要做什么 -->

## 技术要求
- 后端：[接口路径/模块]
- 前端：[页面路径/组件]

## 验收标准
- [ ] [验收点1]
- [ ] [验收点2]

## 相关文档
- [需求文档](../../planning-artifacts/requirements.md)
- [架构文档](../architecture.md)
```

---

### /leader-assign

**功能**：分配或重新分配 Story

**用法**：`/leader-assign STORY-001 wxp`

**流程**：
1. 读取 Story 文件
2. 更新 Owner 字段
3. 更新 TASKBOARD.md

---

### /leader-review

**功能**：审核 PR（代码审查）

**流程**：
1. 询问 PR 编号或分支名
2. 检查：
   - 代码是否符合编码规范
   - 是否实现了 Story 的验收标准
   - 是否有单元测试
3. 给出审核结果

**输出**：
```
📋 PR 审核结果

## 审核项
| 项目 | 状态 | 说明 |
|------|------|------|
| 编码规范 | ✅ | 符合规范 |
| 功能实现 | ✅ | 满足验收标准 |
| 单元测试 | ❌ | 缺少测试用例 |

## 建议
[具体建议]

## 结论
- 通过 → 可以合并
- 不通过 → 需要修改（私下沟通）
```

---

### /leader-taskboard

**功能**：查看或更新任务板

**输出**：
```
📋 TASKBOARD

## 当前 Sprint

| ID | 任务 | Owner | 状态 |
|----|------|-------|------|
| STORY-001 | 用户登录 | wxp | 进行中 |
| STORY-002 | 角色管理 | wxp | 待开始 |
| STORY-003 | 权限管理 | czm | 待开始 |

## 统计
- 待开始: 2
- 进行中: 1
- 待审核: 0
- 已完成: 0
```

---

## 🔄 主导者工作流程

```
开始工作
    ↓
/leader-status        # 查看项目状态
    ↓
根据建议执行命令：
    ├── /leader-requirement    # 需求文档未完成
    ├── /leader-architecture   # 架构文档未完成
    ├── /leader-create-story   # 开始拆分任务
    └── /leader-review         # 有 PR 待审核
    ↓
/leader-taskboard     # 更新任务板
    ↓
结束（或继续其他工作）
```

---

## ⚠️ 注意事项

1. **先需求后架构** - 架构依赖需求文档
2. **先架构后 Story** - Story 依赖架构文档
3. **Story 粒度** - 每个 Story 应该是 1-3 天的工作量
4. **私下沟通** - PR 不通过时，通过微信/线下沟通，不在系统记录

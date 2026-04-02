# BMad 多人协作指南

> LiteSaaS 团队的 BMad 工作流程

---

## 🎯 核心原则

1. **共享的规划，独立的执行**
2. **冲突即信号** - 如果 BMad 状态文件冲突，说明分工需要调整
3. **透明可见** - 每个人都能看到其他人的进度

---

## 📁 目录结构

```
LiteSaaS/
│
├── _bmad/                       # 🔗 共享的方法论配置（推送）
│   ├── bmm/                     # BMad Method 技能
│   ├── core/                    # 核心技能
│   └── */config.yaml            # 模块配置
│
├── _bmad-output/                # 🔗 BMad 输出目录（推送）
│   │
│   ├── planning-artifacts/      # 📋 共享规划文档
│   │   ├── prd/                 # 产品需求文档
│   │   ├── architecture/        # 架构设计
│   │   └── ux-design/           # UX 设计
│   │
│   ├── implementation-artifacts/# 📋 共享实现规格
│   │   ├── epics/               # Epic 定义
│   │   └── stories/             # Story 定义
│   │
│   ├── czm/                     # 👤 czm 的个人状态目录
│   │   ├── sprint-status.yaml   # Sprint 进度
│   │   ├── current-task.md      # 当前任务
│   │   └── notes/               # 个人笔记
│   │
│   └── wxp/                     # 👤 wxp 的个人状态目录
│       ├── sprint-status.yaml   # Sprint 进度
│       ├── current-task.md      # 当前任务
│       └── notes/               # 个人笔记
│
├── CLAUDE.md                    # 🔒 本地私有配置（不推送）
└── .claude/                     # 🔒 本地 Claude 配置（不推送）
```

---

## 👤 个人状态文件模板

### sprint-status.yaml

```yaml
# 位于: _bmad-output/<你的名字>/sprint-status.yaml

owner: czm  # 你的名字
sprint: Sprint-1
period: 2026-04-01 ~ 2026-04-14

current_epic: EPIC-001
current_story: STORY-001
current_task: 实现用户登录功能

status: in_progress  # in_progress | blocked | completed

progress:
  STORY-001:
    status: in_progress
    tasks:
      - name: 设计数据模型
        status: completed
      - name: 实现登录接口
        status: in_progress
      - name: 编写单元测试
        status: pending

blockers: []  # 如果有阻塞，在这里说明

last_update: 2026-04-01T10:30:00
```

### current-task.md

```markdown
# 当前任务

**任务**: STORY-001 用户登录功能
**负责人**: czm
**开始时间**: 2026-04-01

## 进度

- [x] 设计数据模型
- [ ] 实现登录接口
- [ ] 编写单元测试

## 备注

正在处理 JWT token 生成逻辑...

## 下一步

完成登录接口后，需要和 wxp 的前端对接。
```

---

## 🔄 工作流程

### 1. 开始新任务

```bash
# 1. 确保在最新的 main 上
git checkout main
git pull origin main

# 2. 创建功能分支
git checkout -b feature/czm/user-login

# 3. 更新你的状态文件
# 编辑 _bmad-output/czm/current-task.md
# 编辑 _bmad-output/czm/sprint-status.yaml

# 4. 推送状态（让队友知道你在做什么）
git add _bmad-output/czm/
git commit -m "chore(bmad): 更新个人状态 - 开始 STORY-001"
git push origin feature/czm/user-login
```

### 2. 任务进行中

```bash
# 定期更新状态
# 编辑 _bmad-output/czm/sprint-status.yaml

# 查看队友状态
cat _bmad-output/wxp/sprint-status.yaml
```

### 3. 任务完成

```bash
# 1. 更新状态
# 编辑 _bmad-output/czm/sprint-status.yaml
# status: completed

# 2. 更新共享的 Story 文件（如果适用）
# 编辑 _bmad-output/implementation-artifacts/stories/STORY-001.md

# 3. 提交 PR
```

---

## 📋 共享文档的编辑规则

### 谁可以编辑？

| 文档类型 | 主导者 (czm) | 协作者 (wxp) |
|----------|-------------|-------------|
| PRD | ✅ 主编辑 | 🔍 可提议修改 |
| 架构设计 | ✅ 主编辑 | 🔍 可提议修改 |
| Epic 定义 | ✅ 主编辑 | 🔍 可提议修改 |
| Story 定义 | ✅ 分配后可编辑 | ✅ 负责的 Story 可编辑 |

### 修改共享文档的流程

1. **小改动**（错别字、补充说明）
   - 直接修改，在 commit message 中说明

2. **大改动**（功能变更、架构调整）
   - 先在群里讨论
   - 创建 PR，标注 `[讨论]`
   - 等待对方确认后合并

---

## ⚠️ 冲突处理

### 如果个人状态文件冲突

```bash
# 这不应该发生！如果发生，说明：
# 1. 两个人编辑了同一个文件
# 2. 分支太久没同步

# 解决方法：保留两边的修改，手动合并
```

### 如果共享文档冲突

```bash
# 这说明分工出了问题！
# 1. 立即停止，在群里沟通
# 2. 确定由谁来负责这部分
# 3. 调整分工，避免再次冲突
```

---

## 🎯 BMad 工作流分工

| 阶段 | 主要负责 | 协作方式 |
|------|----------|----------|
| 产品简报 | czm | wxp 可参与讨论 |
| PRD | czm | wxp 可提议修改 |
| 架构设计 | czm | wxp 可提议修改 |
| UX 设计 | 根据分工 | 各自负责的模块 |
| Epic/Story 定义 | czm 主导 | wxp 参与评审 |
| Story 开发 | 根据 Story Owner | 独立开发 |
| 代码审查 | czm | wxp 也可审查 |

---

## 📝 检查清单

### 每日开始工作前

- [ ] `git pull` 获取最新代码
- [ ] 查看队友的状态文件
- [ ] 更新自己的状态文件

### 每日结束工作时

- [ ] 更新状态文件
- [ ] 推送到远程分支
- [ ] 如有阻塞，在群里说明

### 创建 PR 前

- [ ] 确保共享文档（如有修改）已同步
- [ ] 更新 Story 状态
- [ ] 检查是否影响其他人的工作

---

> 💡 **核心理念**：BMad 的状态文件就像一个「看板」，让每个人都能看到项目的全貌和每个人的进度。冲突不是问题，而是提醒我们需要调整分工的信号。

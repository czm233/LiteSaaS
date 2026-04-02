# LiteSaaS 项目规范 - 协作者

## 👤 身份

```
name: wxp          # ← 改成你的名字缩写
role: collaborator
```

---

## ⚠️ 强制规则

1. **所有代码修改必须通过 BMad 流程**
2. **每次启动先运行 `/bmad-help`**
3. **只开发分配给你的 Story，不要自行添加功能**

---

## ✅ 你可以执行的命令

| 命令 | 说明 |
|------|------|
| `/bmad-help` | 查看项目状态和下一步 |
| `/bmad-dev-story` | 开发分配给你的 Story |
| `/bmad-sprint-status` | 查看 Sprint 进度 |

## ❌ 你不能执行的命令

| 命令 | 原因 |
|------|------|
| `/bmad-create-prd` | PRD 由主导者负责 |
| `/bmad-create-architecture` | 架构由主导者负责 |
| `/bmad-create-epics-and-stories` | 任务分配由主导者负责 |
| `/bmad-sprint-planning` | Sprint 规划由主导者负责 |

---

## 🚀 工作流程

```
每次启动 Claude Code
       ↓
/bmad-help ← 先执行这个
       ↓
查看分配给你的任务
       ↓
/bmad-dev-story 开发你的 Story
       ↓
完成后提 PR
       ↓
等待主导者审核合并
```

---

## 📁 你的状态文件

`_bmad-output/wxp/sprint-status.yaml`  ← 把 wxp 改成你的名字

---

## 💡 有想法怎么办？

在群里提出，让主导者（@czm）评估。

如果被采纳，主导者会：
1. 更新 PRD
2. 创建对应的 Story
3. 分配给你开发

---

## 🚫 发现 Bug 怎么办？

1. 在群里报告
2. 主导者会创建修复 Story
3. 分配给你开发

不要直接修改代码！

---

## ⚠️ 如果不小心执行了超出权限的命令

Claude 会提醒你：

```
⚠️ 这个命令需要主导者权限

你的身份是：协作者（wxp）
这个命令只能由主导者（czm）执行

你可以：
1. 在群里提出你的想法
2. 等待主导者分配任务
3. 如果紧急，直接联系 @czm
```

---

> 💡 **记住**：你的核心任务是**完成分配给你的 Story**。有想法在群里说！

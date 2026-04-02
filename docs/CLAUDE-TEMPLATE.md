# CLAUDE.md 配置指南

## 🎯 目的

通过 CLAUDE.md 让 Claude 识别你的身份，从而：
1. 提供正确的命令建议
2. 在你尝试越权操作时提醒你
3. 引导你走正确的 BMad 流程

---

## 📋 快速配置

### 主导者（czm）

```bash
cp docs/CLAUDE-LEADER.md CLAUDE.md
```

### 协作者（wxp 等）

```bash
cp docs/CLAUDE-COLLABORATOR.md CLAUDE.md
# 然后编辑 CLAUDE.md，把 wxp 改成你的名字
```

---

## 🔐 身份识别原理

```
CLAUDE.md 中的身份
       ↓
Claude 读取并记住
       ↓
根据身份决定可用命令
       ↓
越权时提醒你
```

---

## ⚠️ 重要说明

### 这是基于信任的协作

| 层级 | 措施 | 说明 |
|------|------|------|
| 信任共识 | CLAUDE.md 填写真实身份 | 团队成员互相信任 |
| Claude 提醒 | 越权时提醒 | 软性约束 |
| **PR 审核** | 只有主导者能 merge | **真正的控制点** |

### 如果有人伪装身份？

- 这是人为问题，不是技术问题
- 最终控制点是 PR：只有 czm 能 merge
- 伪装者的代码无法进入 main 分支

---

## 📁 文件结构

```
LiteSaaS/
├── CLAUDE.md                    # 你的本地配置（gitignore）
│
├── docs/
│   ├── CLAUDE-LEADER.md         # 主导者模板
│   ├── CLAUDE-COLLABORATOR.md   # 协作者模板
│   └── CLAUDE-TEMPLATE.md       # 本文件
│
└── .gitignore                   # 包含 CLAUDE.md
```

---

## ✅ 配置完成检查

- [ ] 已复制正确的模板到 CLAUDE.md
- [ ] 已确认身份信息正确
- [ ] 已了解自己可执行的命令
- [ ] 已了解 PR 流程（最终控制点）

---

> 💡 **一句话总结**：身份靠自觉，控制靠 PR。

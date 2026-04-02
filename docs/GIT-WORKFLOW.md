# Git 工作流指南

> LiteSaaS 多人协作 Git 工作规范

---

## 🌿 分支策略

### 分支结构

```
main                        # 主分支，由主导者 czm 管理
│
├── feature/czm/xxx         # czm 的功能开发分支
├── feature/wxp/xxx         # wxp 的功能开发分支
│
├── fix/czm/xxx             # czm 的 bug 修复分支
├── fix/wxp/xxx             # wxp 的 bug 修复分支
│
└── hotfix/xxx              # 紧急热修复分支
```

### 分支命名规范

| 类型 | 命名格式 | 示例 |
|------|----------|------|
| 功能 | `feature/<作者>/<功能名>` | `feature/wxp/user-frontend` |
| 修复 | `fix/<作者>/<问题描述>` | `fix/czm/login-error` |
| 热修复 | `hotfix/<问题描述>` | `hotfix/security-patch` |

---

## 📋 协作者工作流程

### 1. 首次设置

```bash
# 克隆仓库
git clone <仓库地址>
cd LiteSaaS

# 设置你的 Git 信息（如果还没设置）
git config user.name "wxp"
git config user.email "wxp@example.com"
```

### 2. 开始新功能

```bash
# 确保在最新的 main 上
git checkout main
git pull origin main

# 创建你的功能分支
git checkout -b feature/wxp/<功能名>

# 例如：
# git checkout -b feature/wxp/user-frontend
# git checkout -b feature/wxp/dashboard
```

### 3. 日常开发

```bash
# 查看当前状态
git status

# 添加修改的文件
git add <文件>
# 或添加所有
git add .

# 提交（遵循提交规范）
git commit -m "feat(frontend): 完成用户列表页面"

# 推送到远程
git push origin feature/wxp/<功能名>

# 如果是第一次推送该分支
git push -u origin feature/wxp/<功能名>
```

### 4. 保持分支更新

```bash
# 定期同步 main 分支的最新变更
git checkout main
git pull origin main

# 切回你的分支
git checkout feature/wxp/<功能名>

# 合并 main 到你的分支
git merge main

# 如果有冲突，解决后继续
git add .
git commit -m "chore: 合并 main 分支"
```

### 5. 创建 Pull Request

```bash
# 确保代码已推送
git push origin feature/wxp/<功能名>
```

然后在 GitHub 上：
1. 进入仓库页面
2. 点击 "Compare & pull request"
3. 填写 PR 标题和描述
4. 目标分支选择 `main`
5. 点击 "Create pull request"

### 6. 等待审核

- 主导者会审核你的代码
- 如有修改意见，在你的分支上继续修改并推送
- 审核通过后，主导者会合并你的 PR

---

## 📋 主导者工作流程

### 1. 审核 PR

1. 查看 PR 的变更内容
2. 检查代码质量和规范
3. 在 PR 中添加评论或批准
4. 如需修改，通知协作者

### 2. 合并 PR

```bash
# 方式一：在 GitHub 网页上合并（推荐）
# 点击 "Merge pull request"

# 方式二：本地合并（需要时）
git checkout main
git pull origin main
git merge feature/wxp/<功能名>
git push origin main
```

### 3. 清理已合并的分支

```bash
# 删除本地分支
git branch -d feature/wxp/<功能名>

# 删除远程分支
git push origin --delete feature/wxp/<功能名>
```

---

## 🚨 常见问题

### Q: 提交后发现写错了 commit message？

```bash
# 修改最后一次提交的 message
git commit --amend -m "正确的 message"

# 如果已经推送，需要强制推送（谨慎使用）
git push -f origin feature/wxp/<功能名>
```

### Q: 合并时出现冲突？

```bash
# 查看冲突文件
git status

# 手动编辑冲突文件，解决冲突标记
# <<<<<<< HEAD
# 你的修改
# =======
# main 的修改
# >>>>>>> main

# 解决后
git add <解决冲突的文件>
git commit -m "chore: 解决合并冲突"
```

### Q: 不小心提交到了 main？

```bash
# 立即通知主导者！
# 如果还没推送
git reset HEAD~1

# 如果已经推送
# 让主导者处理回滚
```

### Q: 想要放弃当前分支的所有修改？

```bash
# ⚠️ 危险操作，会丢失所有未提交的修改
git checkout .
git clean -fd
```

---

## ✅ 检查清单

### 提交前检查

- [ ] 代码能正常运行
- [ ] 遵循编码规范
- [ ] commit message 符合规范
- [ ] 没有提交敏感信息（密码、密钥等）
- [ ] 没有提交不必要的文件（node_modules、.env 等）

### PR 前检查

- [ ] 功能完整实现
- [ ] 本地测试通过
- [ ] 已同步最新的 main
- [ ] PR 描述清晰

---

> 💡 **提示**：如有任何 Git 相关问题，及时在群里沟通！

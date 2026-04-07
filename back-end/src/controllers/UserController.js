import * as UserService from '../services/UserService.js';
import { success, fail } from '../utils/response.js';

/**
 * 用户列表
 */
export async function list(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { page, pageSize, username, name, status } = ctx.query;
    const result = await UserService.getUserList(tenantId, {
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      username,
      name,
      status,
    });
    success(ctx, result);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 用户详情
 */
export async function detail(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    const user = await UserService.getUserById(id, tenantId);
    success(ctx, user);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 创建用户
 */
export async function create(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { username, name, email, phone, status, level, orgRoles } = ctx.request.body;

    if (!username || !name) {
      return fail(ctx, 1001, '用户名和姓名不能为空');
    }

    const user = await UserService.createUser(tenantId, {
      username,
      name,
      email,
      phone,
      status,
      level,
      orgRoles,
    });
    success(ctx, user, '创建成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 更新用户
 */
export async function update(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    const { username, name, email, phone, status, level, orgRoles } = ctx.request.body;

    const user = await UserService.updateUser(id, tenantId, {
      username,
      name,
      email,
      phone,
      status,
      level,
      orgRoles,
    });
    success(ctx, user, '更新成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 删除用户
 */
export async function remove(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    await UserService.deleteUser(id, tenantId);
    success(ctx, null, '删除成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 重置密码
 */
export async function resetPassword(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    await UserService.resetPassword(id, tenantId);
    success(ctx, null, '密码已重置为 123456');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 获取角色列表（用于用户管理页面下拉选择）
 */
export async function roles(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const list = await UserService.getRoleList(tenantId);
    success(ctx, list);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

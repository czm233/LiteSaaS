import * as PermissionService from '../services/PermissionService.js';
import { success, fail } from '../utils/response.js';

/**
 * 获取权限树
 */
export async function list(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const tree = await PermissionService.getPermissionTree(tenantId);
    success(ctx, tree);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 获取当前用户菜单
 */
export async function menus(ctx) {
  try {
    const { userId, tenantId } = ctx.state.user;
    const menuTree = await PermissionService.getUserMenus(userId, tenantId);
    success(ctx, menuTree);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 创建权限
 */
export async function create(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const data = ctx.request.body;

    if (!data.type || !data.code || !data.name) {
      return fail(ctx, 1001, '请填写完整的权限信息（type, code, name）');
    }

    if (!['menu', 'button', 'data'].includes(data.type)) {
      return fail(ctx, 1001, '权限类型只能是 menu、button、data');
    }

    const result = await PermissionService.createPermission(data, tenantId);
    success(ctx, result, '创建成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 更新权限
 */
export async function update(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    const data = ctx.request.body;

    if (!data || Object.keys(data).length === 0) {
      return fail(ctx, 1001, '请提供要更新的字段');
    }

    const result = await PermissionService.updatePermission(id, data, tenantId);
    success(ctx, result, '更新成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 删除权限
 */
export async function remove(ctx) {
  try {
    const { id } = ctx.params;
    await PermissionService.deletePermission(id);
    success(ctx, null, '删除成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

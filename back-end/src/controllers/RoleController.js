import * as RoleService from '../services/RoleService.js';
import { success, fail } from '../utils/response.js';

/**
 * 角色列表
 */
export async function list(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { page, pageSize, name, code } = ctx.query;

    const result = await RoleService.getRoles(tenantId, {
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
      name,
      code,
    });
    success(ctx, result);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 角色详情
 */
export async function detail(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    const role = await RoleService.getRole(id, tenantId);
    success(ctx, role);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 创建角色
 */
export async function create(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const data = ctx.request.body;

    if (!data.name || !data.code) {
      return fail(ctx, 1001, '请填写完整的角色信息（name, code）');
    }

    const result = await RoleService.createRole(data, tenantId);
    success(ctx, result, '创建成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 更新角色
 */
export async function update(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    const data = ctx.request.body;

    if (!data || Object.keys(data).length === 0) {
      return fail(ctx, 1001, '请提供要更新的字段');
    }

    const result = await RoleService.updateRole(id, data, tenantId);
    success(ctx, result, '更新成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 删除角色
 */
export async function remove(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    await RoleService.deleteRole(id, tenantId);
    success(ctx, null, '删除成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 分配权限
 */
export async function setPermissions(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    const { permissionIds } = ctx.request.body;

    if (!Array.isArray(permissionIds)) {
      return fail(ctx, 1001, 'permissionIds 必须是数组');
    }

    const result = await RoleService.setRolePermissions(id, permissionIds, tenantId);
    success(ctx, result, '权限分配成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

import * as TenantService from '../services/TenantService.js';
import { success, fail } from '../utils/response.js';

/**
 * 获取租户列表
 */
export async function list(ctx) {
  try {
    const { page, pageSize, name, code, status } = ctx.query;
    const result = await TenantService.getTenants({ page, pageSize, name, code, status });
    success(ctx, result);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 获取租户详情
 */
export async function detail(ctx) {
  try {
    const { id } = ctx.params;
    const tenant = await TenantService.getTenantById(id);
    success(ctx, tenant);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 创建租户
 */
export async function create(ctx) {
  try {
    const { name, code, status } = ctx.request.body;

    if (!name || !code) {
      return fail(ctx, 1001, '租户名称和编码不能为空');
    }

    const tenant = await TenantService.createTenant({ name, code, status });
    success(ctx, tenant, '创建成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 更新租户
 */
export async function update(ctx) {
  try {
    const { id } = ctx.params;
    const { name, code, status } = ctx.request.body;

    const tenant = await TenantService.updateTenant(id, { name, code, status });
    success(ctx, tenant, '更新成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 删除租户
 */
export async function remove(ctx) {
  try {
    const { id } = ctx.params;
    await TenantService.deleteTenant(id);
    success(ctx, null, '删除成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

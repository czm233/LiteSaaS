import * as OrganizationService from '../services/OrganizationService.js';
import { success, fail } from '../utils/response.js';

/**
 * 获取组织树
 */
export async function list(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const list = await OrganizationService.getOrganizationTree(tenantId);
    const tree = OrganizationService.buildTree(list);
    success(ctx, tree);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 获取组织详情
 */
export async function detail(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    const org = await OrganizationService.getOrganizationById(id, tenantId);
    success(ctx, org);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 创建组织
 */
export async function create(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { parentId, name, code, sort } = ctx.request.body;

    if (!name || !code) {
      return fail(ctx, 1001, '组织名称和编码不能为空');
    }

    const org = await OrganizationService.createOrganization({
      tenantId,
      parentId: parentId || null,
      name,
      code,
      sort,
    });
    success(ctx, org, '创建成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 更新组织
 */
export async function update(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    const { name, sort } = ctx.request.body;

    if (!name) {
      return fail(ctx, 1001, '组织名称不能为空');
    }

    const org = await OrganizationService.updateOrganization(id, tenantId, {
      name,
      sort,
    });
    success(ctx, org, '更新成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 删除组织
 */
export async function remove(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    await OrganizationService.deleteOrganization(id, tenantId);
    success(ctx, null, '删除成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

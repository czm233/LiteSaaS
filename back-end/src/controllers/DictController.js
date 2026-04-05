import * as DictService from '../services/DictService.js';
import { success, fail } from '../utils/response.js';

/**
 * 获取字典列表（分页）
 */
export async function list(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { type, page, pageSize } = ctx.query;
    const result = await DictService.getDictList(tenantId, {
      type,
      page: page ? parseInt(page) : 1,
      pageSize: pageSize ? parseInt(pageSize) : 10,
    });
    success(ctx, result);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 按类型获取字典
 */
export async function getByType(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { type } = ctx.params;
    const list = await DictService.getDictsByType(tenantId, type);
    success(ctx, list);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 获取所有字典类型
 */
export async function types(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const types = await DictService.getDictTypes(tenantId);
    success(ctx, types);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 创建字典
 */
export async function create(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const data = ctx.request.body;

    if (!data.type || !data.code || !data.name) {
      return fail(ctx, 1001, '类型、编码、名称不能为空');
    }

    const dict = await DictService.createDict(tenantId, data);
    success(ctx, dict, '创建成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 更新字典
 */
export async function update(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    const data = ctx.request.body;

    if (!data.type || !data.code || !data.name) {
      return fail(ctx, 1001, '类型、编码、名称不能为空');
    }

    const dict = await DictService.updateDict(id, tenantId, data);
    success(ctx, dict, '更新成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 删除字典
 */
export async function remove(ctx) {
  try {
    const { tenantId } = ctx.state.user;
    const { id } = ctx.params;
    await DictService.deleteDict(id, tenantId);
    success(ctx, null, '删除成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

import * as AuthService from '../services/AuthService.js';
import { success, fail } from '../utils/response.js';

/**
 * 登录
 */
export async function login(ctx) {
  try {
    const { tenantCode, username, password } = ctx.request.body;

    if (!tenantCode || !username || !password) {
      return fail(ctx, 1001, '请填写完整的登录信息');
    }

    const result = await AuthService.login(tenantCode, username, password);
    success(ctx, result, '登录成功');
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 登出
 */
export async function logout(ctx) {
  success(ctx, null, '登出成功');
}

/**
 * 获取当前用户信息
 */
export async function me(ctx) {
  try {
    const { userId } = ctx.state.user;
    const userInfo = await AuthService.getUserInfo(userId);
    success(ctx, userInfo);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

/**
 * 获取租户列表
 */
export async function tenants(ctx) {
  try {
    const list = await AuthService.getTenants();
    success(ctx, list);
  } catch (err) {
    fail(ctx, 1001, err.message);
  }
}

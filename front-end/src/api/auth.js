import request from '../utils/request';

/**
 * 登录
 */
export function login(data) {
  return request.post('/auth/login', data);
}

/**
 * 登出
 */
export function logout() {
  return request.post('/auth/logout');
}

/**
 * 获取当前用户信息
 */
export function getMe() {
  return request.get('/auth/me');
}

/**
 * 获取租户列表
 */
export function getTenants() {
  return request.get('/auth/tenants');
}

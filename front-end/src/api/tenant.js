import request from '../utils/request';

/**
 * 获取租户列表
 */
export function getTenants(params) {
  return request.get('/tenants', { params });
}

/**
 * 获取租户详情
 */
export function getTenantById(id) {
  return request.get(`/tenants/${id}`);
}

/**
 * 创建租户
 */
export function createTenant(data) {
  return request.post('/tenants', data);
}

/**
 * 更新租户
 */
export function updateTenant(id, data) {
  return request.put(`/tenants/${id}`, data);
}

/**
 * 删除租户
 */
export function deleteTenant(id) {
  return request.delete(`/tenants/${id}`);
}

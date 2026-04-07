import request from '../utils/request';

/**
 * 获取角色列表
 */
export function getRoles(params) {
  return request.get('/roles', { params });
}

/**
 * 获取角色详情
 */
export function getRole(id) {
  return request.get(`/roles/${id}`);
}

/**
 * 创建角色
 */
export function createRole(data) {
  return request.post('/roles', data);
}

/**
 * 更新角色
 */
export function updateRole(id, data) {
  return request.put(`/roles/${id}`, data);
}

/**
 * 删除角色
 */
export function deleteRole(id) {
  return request.delete(`/roles/${id}`);
}

/**
 * 分配权限
 */
export function setRolePermissions(id, permissionIds) {
  return request.put(`/roles/${id}/permissions`, { permissionIds });
}

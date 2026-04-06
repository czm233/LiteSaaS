import request from '../utils/request';

/**
 * 获取权限树
 */
export function getPermissions() {
  return request.get('/permissions');
}

/**
 * 获取当前用户菜单
 */
export function getUserMenus() {
  return request.get('/permissions/menus');
}

/**
 * 创建权限
 */
export function createPermission(data) {
  return request.post('/permissions', data);
}

/**
 * 更新权限
 */
export function updatePermission(id, data) {
  return request.put(`/permissions/${id}`, data);
}

/**
 * 删除权限
 */
export function deletePermission(id) {
  return request.delete(`/permissions/${id}`);
}

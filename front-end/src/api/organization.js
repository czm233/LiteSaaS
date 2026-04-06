import request from '../utils/request';

/**
 * 获取组织树
 */
export function getOrganizationTree() {
  return request.get('/organizations');
}

/**
 * 获取组织详情
 */
export function getOrganizationDetail(id) {
  return request.get(`/organizations/${id}`);
}

/**
 * 创建组织
 */
export function createOrganization(data) {
  return request.post('/organizations', data);
}

/**
 * 更新组织
 */
export function updateOrganization(id, data) {
  return request.put(`/organizations/${id}`, data);
}

/**
 * 删除组织
 */
export function deleteOrganization(id) {
  return request.delete(`/organizations/${id}`);
}

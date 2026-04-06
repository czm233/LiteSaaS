import request from '../utils/request';

/**
 * 获取字典列表（分页）
 */
export function getDictList(params) {
  return request.get('/dicts', { params });
}

/**
 * 获取所有字典类型
 */
export function getDictTypes() {
  return request.get('/dicts/types');
}

/**
 * 按类型获取字典
 */
export function getDictsByType(type) {
  return request.get(`/dicts/types/${type}`);
}

/**
 * 创建字典
 */
export function createDict(data) {
  return request.post('/dicts', data);
}

/**
 * 更新字典
 */
export function updateDict(id, data) {
  return request.put(`/dicts/${id}`, data);
}

/**
 * 删除字典
 */
export function deleteDict(id) {
  return request.delete(`/dicts/${id}`);
}

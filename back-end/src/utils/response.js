/**
 * 成功响应
 */
export function success(ctx, data = null, message = 'success') {
  ctx.body = { code: 0, message, data };
}

/**
 * 失败响应
 */
export function fail(ctx, code = 1001, message = '操作失败', data = null) {
  ctx.body = { code, message, data };
}

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import { fail } from '../utils/response.js';

/**
 * JWT 认证中间件
 */
export function authMiddleware() {
  return async (ctx, next) => {
    const authHeader = ctx.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return fail(ctx, 1002, '未登录或 token 已过期');
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      ctx.state.user = decoded;
      await next();
    } catch (err) {
      return fail(ctx, 1002, 'token 无效或已过期');
    }
  };
}

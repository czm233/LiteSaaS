import Router from '@koa/router';
import * as TenantController from '../controllers/TenantController.js';
import { authMiddleware } from '../middleware/auth.js';
import { fail } from '../utils/response.js';

/**
 * 系统管理员权限中间件
 * 只有 level === 1 的用户可以访问
 */
function adminMiddleware() {
  return async (ctx, next) => {
    const { level, tenantId } = ctx.state.user;
    if (level !== 1) {
      return fail(ctx, 1003, '无权限操作，仅系统管理员可执行');
    }
    await next();
  };
}

const router = new Router({
  prefix: '/api/v1/tenants',
});

// 所有租户管理接口都需要认证 + 系统管理员权限
router.use(authMiddleware());
router.use(adminMiddleware());

router.get('/', TenantController.list);
router.get('/:id', TenantController.detail);
router.post('/', TenantController.create);
router.put('/:id', TenantController.update);
router.delete('/:id', TenantController.remove);

export default router;

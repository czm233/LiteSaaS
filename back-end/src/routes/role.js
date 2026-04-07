import Router from '@koa/router';
import * as RoleController from '../controllers/RoleController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = new Router({
  prefix: '/api/v1/roles',
});

// 需要认证的接口
router.get('/', authMiddleware(), RoleController.list);
router.get('/:id', authMiddleware(), RoleController.detail);
router.post('/', authMiddleware(), RoleController.create);
router.put('/:id', authMiddleware(), RoleController.update);
router.delete('/:id', authMiddleware(), RoleController.remove);
router.put('/:id/permissions', authMiddleware(), RoleController.setPermissions);

export default router;

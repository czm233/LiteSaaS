import Router from '@koa/router';
import * as PermissionController from '../controllers/PermissionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = new Router({
  prefix: '/api/v1/permissions',
});

// 需要认证的接口
router.get('/', authMiddleware(), PermissionController.list);
router.get('/menus', authMiddleware(), PermissionController.menus);
router.post('/', authMiddleware(), PermissionController.create);
router.put('/:id', authMiddleware(), PermissionController.update);
router.delete('/:id', authMiddleware(), PermissionController.remove);

export default router;

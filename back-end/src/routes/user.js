import Router from '@koa/router';
import * as UserController from '../controllers/UserController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = new Router({
  prefix: '/api/v1/users',
});

// 所有接口都需要认证
router.get('/', authMiddleware(), UserController.list);
router.get('/roles', authMiddleware(), UserController.roles);
router.get('/:id', authMiddleware(), UserController.detail);
router.post('/', authMiddleware(), UserController.create);
router.put('/:id', authMiddleware(), UserController.update);
router.delete('/:id', authMiddleware(), UserController.remove);
router.put('/:id/reset-password', authMiddleware(), UserController.resetPassword);

export default router;

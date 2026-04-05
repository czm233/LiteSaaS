import Router from '@koa/router';
import * as AuthController from '../controllers/AuthController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = new Router({
  prefix: '/api/v1/auth',
});

// 公开接口
router.post('/login', AuthController.login);
router.get('/tenants', AuthController.tenants);

// 需要认证的接口
router.post('/logout', authMiddleware(), AuthController.logout);
router.get('/me', authMiddleware(), AuthController.me);

export default router;

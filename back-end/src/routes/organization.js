import Router from '@koa/router';
import * as OrganizationController from '../controllers/OrganizationController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = new Router({
  prefix: '/api/v1/organizations',
});

// 所有接口都需要认证
router.get('/', authMiddleware(), OrganizationController.list);
router.get('/:id', authMiddleware(), OrganizationController.detail);
router.post('/', authMiddleware(), OrganizationController.create);
router.put('/:id', authMiddleware(), OrganizationController.update);
router.delete('/:id', authMiddleware(), OrganizationController.remove);

export default router;

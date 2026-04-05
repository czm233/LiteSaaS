import Router from '@koa/router';
import * as DictController from '../controllers/DictController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = new Router({
  prefix: '/api/v1/dicts',
});

// 所有接口都需要认证
router.get('/', authMiddleware(), DictController.list);
router.get('/types', authMiddleware(), DictController.types);
router.get('/types/:type', authMiddleware(), DictController.getByType);
router.post('/', authMiddleware(), DictController.create);
router.put('/:id', authMiddleware(), DictController.update);
router.delete('/:id', authMiddleware(), DictController.remove);

export default router;

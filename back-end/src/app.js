import 'dotenv/config';

import Koa from 'koa';
import Router from '@koa/router';
import logger from 'koa-logger';
import { koaBody } from 'koa-body';
import cors from '@koa/cors';

import authRoutes from './routes/auth.js';
import tenantRoutes from './routes/tenant.js';
import organizationRoutes from './routes/organization.js';
import dictRoutes from './routes/dict.js';
import permissionRoutes from './routes/permission.js';
import roleRoutes from './routes/role.js';
import userRoutes from './routes/user.js';

const app = new Koa();
const router = new Router();

// 中间件
app.use(logger());
app.use(cors());
app.use(koaBody());

// 健康检查接口
router.get('/api/health', (ctx) => {
  ctx.body = { status: 'ok' };
});

// 注册路由
app.use(authRoutes.routes()).use(authRoutes.allowedMethods());
app.use(tenantRoutes.routes()).use(tenantRoutes.allowedMethods());
app.use(organizationRoutes.routes()).use(organizationRoutes.allowedMethods());
app.use(dictRoutes.routes()).use(dictRoutes.allowedMethods());
app.use(permissionRoutes.routes()).use(permissionRoutes.allowedMethods());
app.use(roleRoutes.routes()).use(roleRoutes.allowedMethods());
app.use(userRoutes.routes()).use(userRoutes.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;

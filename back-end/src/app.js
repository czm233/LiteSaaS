import 'dotenv/config';

import Koa from 'koa';
import Router from '@koa/router';
import logger from 'koa-logger';
import { koaBody } from 'koa-body';
import cors from '@koa/cors';

import authRoutes from './routes/auth.js';

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
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;

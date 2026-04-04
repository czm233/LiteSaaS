const Koa = require('koa');
const Router = require('@koa/router');
const logger = require('koa-logger');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');

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
app.use(router.routes()).use(router.allowedMethods());

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;

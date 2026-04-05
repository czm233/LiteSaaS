/**
 * 初始化种子数据
 * 创建默认租户和管理员账号
 */
import 'dotenv/config';
import prisma from '../src/config/database.js';
import { hashPassword } from '../src/utils/password.js';

async function seed() {
  console.log('开始初始化数据...');

  // 创建默认租户
  const tenant = await prisma.tenant.upsert({
    where: { code: 'default' },
    update: {},
    create: {
      name: '默认租户',
      code: 'default',
      status: 1,
    },
  });
  console.log(`租户已创建: ${tenant.name} (${tenant.code})`);

  // 创建默认组织
  const org = await prisma.organization.upsert({
    where: {
      tenantId_code: { tenantId: tenant.id, code: 'root' },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: '根组织',
      code: 'root',
      level: 1,
      path: '',
      sort: 0,
    },
  });
  console.log(`组织已创建: ${org.name}`);

  // 创建管理员角色
  const adminRole = await prisma.role.upsert({
    where: {
      tenantId_code: { tenantId: tenant.id, code: 'admin' },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      name: '管理员',
      code: 'admin',
      description: '系统管理员，拥有所有权限',
    },
  });
  console.log(`角色已创建: ${adminRole.name}`);

  // 创建管理员用户（密码: admin123）
  const hashedPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: {
      tenantId_username: { tenantId: tenant.id, username: 'admin' },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      username: 'admin',
      password: hashedPassword,
      name: '管理员',
      email: 'admin@litesaas.com',
      status: 1,
      level: 1,
    },
  });
  console.log(`用户已创建: ${admin.username} (密码: admin123)`);

  // 为管理员分配角色和组织
  await prisma.userOrgRole.upsert({
    where: { id: `${admin.id}-${org.id}` },
    update: {},
    create: {
      userId: admin.id,
      organizationId: org.id,
      roleId: adminRole.id,
      dataScope: 'all',
    },
  });
  console.log('已为管理员分配角色和组织');

  console.log('\n初始化完成!');
  console.log('登录信息:');
  console.log('  租户编码: default');
  console.log('  用户名: admin');
  console.log('  密码: admin123');
}

seed()
  .catch((e) => {
    console.error('初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

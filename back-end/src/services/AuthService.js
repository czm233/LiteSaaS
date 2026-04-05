import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';
import { comparePassword } from '../utils/password.js';

/**
 * 登录
 */
export async function login(tenantCode, username, password) {
  // 查找租户
  const tenant = await prisma.tenant.findUnique({
    where: { code: tenantCode },
  });
  if (!tenant) {
    throw new Error('租户不存在');
  }
  if (tenant.status !== 1) {
    throw new Error('租户已被禁用');
  }

  // 查找用户
  const user = await prisma.user.findUnique({
    where: { tenantId_username: { tenantId: tenant.id, username } },
  });
  if (!user) {
    throw new Error('用户名或密码错误');
  }
  if (user.status !== 1) {
    throw new Error('用户已被禁用');
  }

  // 验证密码
  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new Error('用户名或密码错误');
  }

  // 生成 JWT
  const token = jwt.sign(
    { userId: user.id, tenantId: tenant.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      level: user.level,
      tenantId: tenant.id,
      tenantName: tenant.name,
    },
  };
}

/**
 * 获取当前用户信息
 */
export async function getUserInfo(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tenant: true,
      userOrgRoles: {
        include: {
          role: {
            include: {
              permissions: { include: { permission: true } },
            },
          },
          organization: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('用户不存在');
  }

  // 提取权限编码
  const permissions = [];
  for (const uor of user.userOrgRoles) {
    for (const rp of uor.role.permissions) {
      permissions.push(rp.permission.code);
    }
  }
  const uniquePermissions = [...new Set(permissions)];

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    phone: user.phone,
    level: user.level,
    tenantId: user.tenantId,
    tenantName: user.tenant.name,
    permissions: uniquePermissions,
  };
}

/**
 * 获取租户列表（登录页选择用）
 */
export async function getTenants() {
  return prisma.tenant.findMany({
    where: { status: 1 },
    select: { id: true, name: true, code: true },
    orderBy: { createdAt: 'asc' },
  });
}

import prisma from '../config/database.js';
import { hashPassword } from '../utils/password.js';

/**
 * 获取用户列表（分页）
 */
export async function getUserList(tenantId, { page = 1, pageSize = 10, username, name, status } = {}) {
  const where = { tenantId };

  if (username) {
    where.username = { contains: username };
  }
  if (name) {
    where.name = { contains: name };
  }
  if (status !== undefined && status !== null && status !== '') {
    where.status = Number(status);
  }

  const [list, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        level: true,
        createdAt: true,
        updatedAt: true,
        userOrgRoles: {
          select: {
            id: true,
            organizationId: true,
            roleId: true,
            dataScope: true,
            organization: { select: { id: true, name: true } },
            role: { select: { id: true, name: true, code: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return { list, total };
}

/**
 * 获取用户详情
 */
export async function getUserById(id, tenantId) {
  const user = await prisma.user.findFirst({
    where: { id, tenantId },
    include: {
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
    status: user.status,
    level: user.level,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    orgRoles: user.userOrgRoles.map((uor) => ({
      id: uor.id,
      organizationId: uor.organizationId,
      organizationName: uor.organization.name,
      roleId: uor.roleId,
      roleName: uor.role.name,
      roleCode: uor.role.code,
      dataScope: uor.dataScope,
    })),
    permissions: uniquePermissions,
  };
}

/**
 * 创建用户
 */
export async function createUser(tenantId, data) {
  const { username, name, password, email, phone, status, level, orgRoles } = data;

  // 检查用户名唯一性
  const existing = await prisma.user.findUnique({
    where: { tenantId_username: { tenantId, username } },
  });
  if (existing) {
    throw new Error('用户名已存在');
  }

  const hashedPassword = await hashPassword(password || '123456');

  const user = await prisma.user.create({
    data: {
      tenantId,
      username,
      password: hashedPassword,
      name,
      email: email || null,
      phone: phone || null,
      status: status !== undefined ? status : 1,
      level: level || 5,
    },
  });

  // 创建组织角色关联
  if (orgRoles && orgRoles.length > 0) {
    await createUserOrgRoles(user.id, orgRoles);
  }

  return user;
}

/**
 * 更新用户
 */
export async function updateUser(id, tenantId, data) {
  const user = await prisma.user.findFirst({
    where: { id, tenantId },
  });

  if (!user) {
    throw new Error('用户不存在');
  }

  const { username, name, email, phone, status, level, orgRoles } = data;

  // 如果修改了用户名，检查唯一性
  if (username && username !== user.username) {
    const existing = await prisma.user.findUnique({
      where: { tenantId_username: { tenantId, username } },
    });
    if (existing) {
      throw new Error('用户名已存在');
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(username !== undefined && { username }),
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email: email || null }),
      ...(phone !== undefined && { phone: phone || null }),
      ...(status !== undefined && { status }),
      ...(level !== undefined && { level }),
    },
  });

  // 更新组织角色关联
  if (orgRoles !== undefined) {
    // 先删除所有旧的关联
    await prisma.userOrgRole.deleteMany({ where: { userId: id } });
    // 创建新的关联
    if (orgRoles.length > 0) {
      await createUserOrgRoles(id, orgRoles);
    }
  }

  return updated;
}

/**
 * 删除用户
 */
export async function deleteUser(id, tenantId) {
  const user = await prisma.user.findFirst({
    where: { id, tenantId },
  });

  if (!user) {
    throw new Error('用户不存在');
  }

  await prisma.user.delete({
    where: { id },
  });

  return true;
}

/**
 * 重置密码
 */
export async function resetPassword(id, tenantId) {
  const user = await prisma.user.findFirst({
    where: { id, tenantId },
  });

  if (!user) {
    throw new Error('用户不存在');
  }

  const hashedPassword = await hashPassword('123456');

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  return true;
}

/**
 * 批量创建用户组织角色关联
 */
async function createUserOrgRoles(userId, orgRoles) {
  const data = orgRoles.map((item) => ({
    userId,
    organizationId: item.organizationId,
    roleId: item.roleId,
    dataScope: item.dataScope || 'self',
  }));

  await prisma.userOrgRole.createMany({ data });
}

/**
 * 获取角色列表（用于用户管理页面选择角色）
 */
export async function getRoleList(tenantId) {
  return prisma.role.findMany({
    where: { tenantId },
    select: { id: true, name: true, code: true, description: true },
    orderBy: { createdAt: 'asc' },
  });
}

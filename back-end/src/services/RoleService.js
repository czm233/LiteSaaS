import prisma from '../config/database.js';

/**
 * 获取角色列表
 */
export async function getRoles(tenantId, { page = 1, pageSize = 10, name, code } = {}) {
  const where = { tenantId };

  if (name) {
    where.name = { contains: name };
  }
  if (code) {
    where.code = { contains: code };
  }

  const [list, total] = await Promise.all([
    prisma.role.findMany({
      where,
      include: {
        _count: {
          select: { permissions: true, userOrgRoles: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.role.count({ where }),
  ]);

  return { list, total };
}

/**
 * 获取角色详情
 */
export async function getRole(id, tenantId) {
  const role = await prisma.role.findFirst({
    where: { id, tenantId },
    include: {
      permissions: {
        include: { permission: true },
      },
    },
  });

  if (!role) {
    throw new Error('角色不存在');
  }

  return role;
}

/**
 * 创建角色
 */
export async function createRole(data, tenantId) {
  // 检查 code 唯一性
  const existing = await prisma.role.findFirst({
    where: { tenantId, code: data.code },
  });
  if (existing) {
    throw new Error('角色编码已存在');
  }

  return prisma.role.create({
    data: {
      name: data.name,
      code: data.code,
      description: data.description || null,
      tenantId,
    },
  });
}

/**
 * 更新角色
 */
export async function updateRole(id, data, tenantId) {
  const role = await prisma.role.findFirst({
    where: { id, tenantId },
  });
  if (!role) {
    throw new Error('角色不存在');
  }

  // 如果修改了 code，检查唯一性
  if (data.code && data.code !== role.code) {
    const existing = await prisma.role.findFirst({
      where: { tenantId, code: data.code },
    });
    if (existing) {
      throw new Error('角色编码已存在');
    }
  }

  return prisma.role.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.code !== undefined && { code: data.code }),
      ...(data.description !== undefined && { description: data.description || null }),
    },
  });
}

/**
 * 删除角色
 */
export async function deleteRole(id, tenantId) {
  const role = await prisma.role.findFirst({
    where: { id, tenantId },
    include: { userOrgRoles: true },
  });
  if (!role) {
    throw new Error('角色不存在');
  }

  if (role.userOrgRoles.length > 0) {
    throw new Error('角色已分配给用户，请先解除关联');
  }

  await prisma.role.delete({
    where: { id },
  });

  return true;
}

/**
 * 分配权限（替换整个权限集合）
 */
export async function setRolePermissions(id, permissionIds, tenantId) {
  const role = await prisma.role.findFirst({
    where: { id, tenantId },
  });
  if (!role) {
    throw new Error('角色不存在');
  }

  // 验证所有 permissionId 存在
  if (permissionIds && permissionIds.length > 0) {
    const permissions = await prisma.permission.findMany({
      where: { id: { in: permissionIds } },
      select: { id: true },
    });

    const foundIds = new Set(permissions.map((p) => p.id));
    const missingIds = permissionIds.filter((pid) => !foundIds.has(pid));
    if (missingIds.length > 0) {
      throw new Error('部分权限不存在');
    }
  }

  // 使用 set 操作替换权限集合
  await prisma.role.update({
    where: { id },
    data: {
      permissions: {
        set: (permissionIds || []).map((permissionId) => ({ permissionId })),
      },
    },
  });

  // 返回更新后的角色
  return prisma.role.findFirst({
    where: { id, tenantId },
    include: {
      permissions: {
        include: { permission: true },
      },
    },
  });
}

import prisma from '../config/database.js';

/**
 * 将权限列表构建为树形结构
 */
function buildTree(list, parentId = null) {
  return list
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(list, item.id),
    }))
    .sort((a, b) => a.sort - b.sort);
}

/**
 * 获取权限树（全部）
 */
export async function getPermissionTree(tenantId) {
  const where = {};
  // 系统权限(tenantId=null)和本租户权限都可见
  if (tenantId) {
    where.OR = [{ tenantId: null }, { tenantId }];
  } else {
    where.tenantId = null;
  }

  const list = await prisma.permission.findMany({
    where,
    orderBy: [{ sort: 'asc' }, { createdAt: 'asc' }],
  });

  return buildTree(list);
}

/**
 * 获取当前用户有权限的菜单列表
 */
export async function getUserMenus(userId, tenantId) {
  // 查找用户的所有角色关联的权限
  const userOrgRoles = await prisma.userOrgRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: {
            include: { permission: true },
          },
        },
      },
    },
  });

  // 收集所有有权限的 permissionId（仅菜单类型）
  const permissionIds = new Set();
  for (const uor of userOrgRoles) {
    for (const rp of uor.role.permissions) {
      if (rp.permission.type === 'menu') {
        permissionIds.add(rp.permission.id);
      }
    }
  }

  // 同时包含系统权限（tenantId=null）
  const allMenuPermissions = await prisma.permission.findMany({
    where: {
      type: 'menu',
      AND: [
        {
          OR: [
            { tenantId: null },
            ...(tenantId ? [{ tenantId }] : []),
          ],
        },
      ],
    },
    orderBy: [{ sort: 'asc' }, { createdAt: 'asc' }],
  });

  // 系统菜单全部可见，租户菜单只显示有权限的
  const filteredList = allMenuPermissions.filter(
    (p) => p.tenantId === null || permissionIds.has(p.id),
  );

  return buildTree(filteredList);
}

/**
 * 创建权限
 */
export async function createPermission(data, tenantId) {
  // 检查 code 唯一性
  const existing = await prisma.permission.findFirst({
    where: {
      code: data.code,
      tenantId: tenantId || null,
    },
  });
  if (existing) {
    throw new Error('权限编码已存在');
  }

  // 如果有 parentId，检查父权限是否存在
  if (data.parentId) {
    const parent = await prisma.permission.findUnique({
      where: { id: data.parentId },
    });
    if (!parent) {
      throw new Error('父权限不存在');
    }
  }

  return prisma.permission.create({
    data: {
      type: data.type,
      code: data.code,
      name: data.name,
      parentId: data.parentId || null,
      path: data.path || null,
      sort: data.sort || 0,
      tenantId: tenantId || null,
    },
  });
}

/**
 * 更新权限
 */
export async function updatePermission(id, data, tenantId) {
  const permission = await prisma.permission.findUnique({
    where: { id },
  });
  if (!permission) {
    throw new Error('权限不存在');
  }

  // 如果修改了 code，检查唯一性
  if (data.code && data.code !== permission.code) {
    const existing = await prisma.permission.findFirst({
      where: {
        code: data.code,
        tenantId: tenantId || null,
      },
    });
    if (existing) {
      throw new Error('权限编码已存在');
    }
  }

  // 不能将节点设置为自己的后代（防止循环引用）
  if (data.parentId && data.parentId !== permission.parentId) {
    const isDescendant = await isDescendantOf(id, data.parentId);
    if (isDescendant) {
      throw new Error('不能将权限移动到其子节点下');
    }
  }

  return prisma.permission.update({
    where: { id },
    data: {
      ...(data.type !== undefined && { type: data.type }),
      ...(data.code !== undefined && { code: data.code }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.parentId !== undefined && { parentId: data.parentId || null }),
      ...(data.path !== undefined && { path: data.path || null }),
      ...(data.sort !== undefined && { sort: data.sort }),
    },
  });
}

/**
 * 删除权限（级联删除子权限）
 */
export async function deletePermission(id) {
  const permission = await prisma.permission.findUnique({
    where: { id },
    include: {
      children: true,
      roles: true,
    },
  });
  if (!permission) {
    throw new Error('权限不存在');
  }

  if (permission.children.length > 0) {
    throw new Error('存在子权限，请先删除子权限');
  }

  if (permission.roles.length > 0) {
    throw new Error('权限已分配给角色，请先解除关联');
  }

  await prisma.permission.delete({
    where: { id },
  });

  return true;
}

/**
 * 检查 targetId 是否是 ancestorId 的后代
 */
async function isDescendantOf(ancestorId, targetId) {
  const children = await prisma.permission.findMany({
    where: { parentId: ancestorId },
    select: { id: true },
  });

  for (const child of children) {
    if (child.id === targetId) {
      return true;
    }
    if (await isDescendantOf(child.id, targetId)) {
      return true;
    }
  }
  return false;
}

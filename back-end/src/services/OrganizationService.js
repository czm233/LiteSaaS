import prisma from '../config/database.js';

/**
 * 获取组织树（一次性加载，前端构建树形结构）
 */
export async function getOrganizationTree(tenantId) {
  const list = await prisma.organization.findMany({
    where: { tenantId },
    orderBy: [{ level: 'asc' }, { sort: 'asc' }, { createdAt: 'asc' }],
  });
  return list;
}

/**
 * 将平铺列表构建为树形结构
 */
export function buildTree(list, parentId = null) {
  return list
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: buildTree(list, item.id),
    }));
}

/**
 * 获取组织详情
 */
export async function getOrganizationById(id, tenantId) {
  const org = await prisma.organization.findFirst({
    where: { id, tenantId },
    include: {
      parent: { select: { id: true, name: true } },
      children: { select: { id: true, name: true } },
    },
  });

  if (!org) {
    throw new Error('组织不存在');
  }

  // 获取关联用户数量
  const userCount = await prisma.userOrgRole.count({
    where: { organizationId: id },
  });
  return { ...org, userCount };
}

/**
 * 创建组织
 */
export async function createOrganization(data) {
  const { tenantId, parentId, name, code, sort = 0 } = data;

  // 计算层级和路径
  let level = 1;
  let path = '';

  if (parentId) {
    const parent = await prisma.organization.findFirst({
      where: { id: parentId, tenantId },
    });
    if (!parent) {
      throw new Error('父组织不存在');
    }
    if (parent.level >= 5) {
      throw new Error('组织层级不能超过 5 级');
    }
    level = parent.level + 1;
    path = `${parent.path}/${code}`;
  } else {
    path = code;
  }

  // 检查编码唯一性
  const existing = await prisma.organization.findUnique({
    where: { tenantId_code: { tenantId, code } },
  });
  if (existing) {
    throw new Error('组织编码已存在');
  }

  const org = await prisma.organization.create({
    data: {
      tenantId,
      parentId,
      name,
      code,
      level,
      path,
      sort,
    },
  });

  return org;
}

/**
 * 更新组织
 */
export async function updateOrganization(id, tenantId, data) {
  const org = await prisma.organization.findFirst({
    where: { id, tenantId },
  });

  if (!org) {
    throw new Error('组织不存在');
  }

  const { name, sort } = data;

  const updated = await prisma.organization.update({
    where: { id },
    data: { name, sort },
  });

  return updated;
}

/**
 * 删除组织
 */
export async function deleteOrganization(id, tenantId) {
  const org = await prisma.organization.findFirst({
    where: { id, tenantId },
    include: {
      children: { select: { id: true } },
    },
  });

  if (!org) {
    throw new Error('组织不存在');
  }

  if (org.children.length > 0) {
    throw new Error('该组织下有子组织，不能删除');
  }

  // 检查是否有关联用户
  const userCount = await prisma.userOrgRole.count({
    where: { organizationId: id },
  });
  if (userCount > 0) {
    throw new Error('该组织下有关联用户，不能删除');
  }

  await prisma.organization.delete({
    where: { id },
  });

  return true;
}

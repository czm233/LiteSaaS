import prisma from '../config/database.js';

/**
 * 获取租户列表
 */
export async function getTenants({ page = 1, pageSize = 10, name, code, status } = {}) {
  const where = {};
  if (name) {
    where.name = { contains: name };
  }
  if (code) {
    where.code = { contains: code };
  }
  if (status !== undefined && status !== null && status !== '') {
    where.status = Number(status);
  }

  const [total, list] = await Promise.all([
    prisma.tenant.count({ where }),
    prisma.tenant.findMany({
      where,
      include: {
        _count: { select: { users: true, orgs: true, roles: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
    }),
  ]);

  return { total, list };
}

/**
 * 获取租户详情
 */
export async function getTenantById(id) {
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      _count: { select: { users: true, orgs: true, roles: true } },
    },
  });

  if (!tenant) {
    throw new Error('租户不存在');
  }

  return tenant;
}

/**
 * 创建租户
 */
export async function createTenant(data) {
  const { name, code, status } = data;

  // 检查编码是否已存在
  const existing = await prisma.tenant.findUnique({
    where: { code },
  });
  if (existing) {
    throw new Error('租户编码已存在');
  }

  return prisma.tenant.create({
    data: {
      name,
      code,
      status: status !== undefined ? Number(status) : 1,
    },
  });
}

/**
 * 更新租户
 */
export async function updateTenant(id, data) {
  const tenant = await prisma.tenant.findUnique({ where: { id } });
  if (!tenant) {
    throw new Error('租户不存在');
  }

  // 如果修改了编码，检查新编码是否已存在
  if (data.code && data.code !== tenant.code) {
    const existing = await prisma.tenant.findUnique({
      where: { code: data.code },
    });
    if (existing) {
      throw new Error('租户编码已存在');
    }
  }

  const updateData = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.code !== undefined) updateData.code = data.code;
  if (data.status !== undefined) updateData.status = Number(data.status);

  return prisma.tenant.update({
    where: { id },
    data: updateData,
  });
}

/**
 * 删除租户
 */
export async function deleteTenant(id) {
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: {
      _count: { select: { users: true, orgs: true, roles: true } },
    },
  });

  if (!tenant) {
    throw new Error('租户不存在');
  }

  const { users, orgs, roles } = tenant._count;
  if (users > 0 || orgs > 0 || roles > 0) {
    throw new Error(`该租户下存在关联数据（${users}个用户, ${orgs}个组织, ${roles}个角色），无法删除`);
  }

  await prisma.tenant.delete({ where: { id } });
  return true;
}

import prisma from '../config/database.js';

/**
 * 获取字典列表（分页）
 */
export async function getDictList(tenantId, { type, page = 1, pageSize = 10 }) {
  const where = { tenantId };
  if (type) {
    where.type = type;
  }

  const [list, total] = await Promise.all([
    prisma.dict.findMany({
      where,
      orderBy: [{ type: 'asc' }, { sort: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.dict.count({ where }),
  ]);

  return { list, total, page, pageSize };
}

/**
 * 按类型获取字典
 */
export async function getDictsByType(tenantId, type) {
  return prisma.dict.findMany({
    where: { tenantId, type },
    orderBy: { sort: 'asc' },
  });
}

/**
 * 获取所有字典类型（去重）
 */
export async function getDictTypes(tenantId) {
  const result = await prisma.dict.findMany({
    where: { tenantId },
    select: { type: true },
    distinct: ['type'],
    orderBy: { type: 'asc' },
  });
  return result.map((item) => item.type);
}

/**
 * 创建字典
 */
export async function createDict(tenantId, data) {
  const { type, code, name, value, sort = 0 } = data;

  // 检查唯一约束
  const existing = await prisma.dict.findUnique({
    where: { tenantId_type_code: { tenantId, type, code } },
  });
  if (existing) {
    throw new Error(`字典类型 "${type}" 下已存在编码 "${code}"`);
  }

  return prisma.dict.create({
    data: { tenantId, type, code, name, value, sort },
  });
}

/**
 * 更新字典
 */
export async function updateDict(id, tenantId, data) {
  const dict = await prisma.dict.findUnique({ where: { id } });
  if (!dict) {
    throw new Error('字典不存在');
  }
  if (dict.tenantId !== tenantId) {
    throw new Error('无权操作此字典');
  }

  const { type, code, name, value, sort } = data;

  // 检查唯一约束（如果 type 或 code 变更）
  if (type !== dict.type || code !== dict.code) {
    const existing = await prisma.dict.findUnique({
      where: { tenantId_type_code: { tenantId, type, code } },
    });
    if (existing) {
      throw new Error(`字典类型 "${type}" 下已存在编码 "${code}"`);
    }
  }

  return prisma.dict.update({
    where: { id },
    data: { type, code, name, value, sort },
  });
}

/**
 * 删除字典
 */
export async function deleteDict(id, tenantId) {
  const dict = await prisma.dict.findUnique({ where: { id } });
  if (!dict) {
    throw new Error('字典不存在');
  }
  if (dict.tenantId !== tenantId) {
    throw new Error('无权操作此字典');
  }

  await prisma.dict.delete({ where: { id } });
}

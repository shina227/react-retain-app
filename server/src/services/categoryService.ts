import { AppError } from '../lib/AppError.js';
import { prisma } from '../lib/prisma.js';
import type { CategoryInput } from '../validators/category.js';

const select = { id: true, name: true, color: true, isDefault: true } as const;

async function findOrThrow(id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw AppError.notFound('Category not found');
  return category;
}

// Case-insensitive, so "Food" and "food" can't both exist.
async function assertNameFree(name: string, exceptId?: string) {
  const clash = await prisma.category.findFirst({
    where: { name: { equals: name, mode: 'insensitive' }, NOT: { id: exceptId } },
  });
  if (clash) throw AppError.conflict('A category with that name already exists', 'CATEGORY_EXISTS');
}

export const listCategories = () => prisma.category.findMany({ select, orderBy: { name: 'asc' } });

// Admin view: every category with how many expenses use it (zero included).
export async function listCategoriesWithUsage() {
  const categories = await prisma.category.findMany({
    select: { ...select, createdAt: true, _count: { select: { expenses: true } } },
    orderBy: { name: 'asc' },
  });
  return categories.map(({ _count, ...category }) => ({
    ...category,
    usageCount: _count.expenses,
  }));
}

export async function createCategory({ name, color }: CategoryInput) {
  await assertNameFree(name);
  return prisma.category.create({ data: { name, color }, select });
}

export async function updateCategory(id: string, { name, color }: CategoryInput) {
  const category = await findOrThrow(id);
  if (category.isDefault && name !== category.name) {
    throw AppError.badRequest('The default category cannot be renamed', 'DEFAULT_CATEGORY');
  }
  await assertNameFree(name, id);
  return prisma.category.update({ where: { id }, data: { name, color }, select });
}

// Moves the category's expenses to the default category, then deletes it, atomically.
export async function deleteCategory(id: string) {
  const category = await findOrThrow(id);
  if (category.isDefault) {
    throw AppError.badRequest('The default category cannot be deleted', 'DEFAULT_CATEGORY');
  }

  return prisma.$transaction(async (tx) => {
    const fallback = await tx.category.findFirstOrThrow({ where: { isDefault: true } });
    const { count } = await tx.expense.updateMany({
      where: { categoryId: id },
      data: { categoryId: fallback.id },
    });
    await tx.category.delete({ where: { id } });
    return { reassignedCount: count };
  });
}

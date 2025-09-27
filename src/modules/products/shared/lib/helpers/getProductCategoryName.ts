import type { Nullable } from '@/shared';
import type { ProductCategory } from '../models';
import { getCategoryById } from './getCategoryById';

export const getProductCategoryName = ({
  categoryId,
  categories,
}: {
  categoryId: Nullable<number>;
  categories?: ProductCategory[];
}): Nullable<string> => {
  if (!categories || !categoryId) {
    return null;
  }

  const category = getCategoryById({ id: categoryId, categories });

  return category?.name ?? null;
};

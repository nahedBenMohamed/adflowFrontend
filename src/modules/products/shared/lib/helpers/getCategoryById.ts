import type { Optional } from '@/shared';
import type { ProductCategory } from '../models';

export const getCategoryById = ({
  id,
  categories,
}: {
  id: number;
  categories: ProductCategory[];
}): Optional<ProductCategory> => {
  for (const category of categories) {
    if (category.id === id) return category;

    for (const subCategory of category.children ?? []) {
      if (subCategory.id === id) return subCategory;
    }
  }

  return;
};

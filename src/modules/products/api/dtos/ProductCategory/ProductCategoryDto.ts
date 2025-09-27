import type { Nullable } from '@/shared';

export interface ProductCategoryDto {
  id: number;
  name: string;
  parentId: Nullable<number>;
  children: ProductCategoryDto[];
}

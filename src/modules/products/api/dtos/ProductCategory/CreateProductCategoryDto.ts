import type { Nullable } from '@/shared';

export class CreateProductCategoryDto {
  name: string;
  parentId: Nullable<number>;

  constructor({ name, parentId }: CreateProductCategoryDto) {
    this.name = name;
    this.parentId = parentId;
  }
}

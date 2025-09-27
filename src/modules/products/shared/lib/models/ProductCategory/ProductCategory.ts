import type { Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { ProductCategoryDto } from '../../../../api';

export class ProductCategory {
  id: number;
  name: string;
  parentId: Nullable<number>;
  children: ProductCategory[];

  constructor({ id, name, parentId, children }: ProductCategory) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.children = children;

    makeAutoObservable(this);
  }

  static fromDto(dto: ProductCategoryDto): ProductCategory {
    return new ProductCategory({
      id: dto.id,
      name: dto.name,
      parentId: dto.parentId,
      children: ProductCategory.fromDtos(dto.children),
    });
  }

  static fromDtos(dtos: ProductCategoryDto[]): ProductCategory[] {
    return dtos.map(this.fromDto);
  }
}

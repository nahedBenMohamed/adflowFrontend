import type { Nullable } from '@/shared';

export class UpdateProductDto {
  name: string;
  description: Nullable<string>;
  sku: Nullable<string>;
  unit: Nullable<string>;
  tax: Nullable<number>;
  categoryId: Nullable<number>;

  constructor({ name, description, sku, unit, tax, categoryId }: UpdateProductDto) {
    this.name = name;
    this.description = description;
    this.sku = sku;
    this.unit = unit;
    this.tax = tax;
    this.categoryId = categoryId;
  }
}

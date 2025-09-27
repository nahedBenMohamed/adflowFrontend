import type { Nullable } from '@/shared';
import type { ProductsSectionType } from '../../../shared';

export class CreateProductsSectionDto {
  name: string;
  icon: string;
  type: ProductsSectionType;
  enableWarehouse: boolean;
  enableBarcode: boolean;

  // in hours
  cancelAfter: Nullable<number>;

  constructor({
    name,
    icon,
    type,
    enableWarehouse,
    enableBarcode,
    cancelAfter,
  }: CreateProductsSectionDto) {
    this.name = name;
    this.icon = icon;
    this.type = type;
    this.enableWarehouse = enableWarehouse;
    this.enableBarcode = enableBarcode;
    this.cancelAfter = cancelAfter;
  }
}

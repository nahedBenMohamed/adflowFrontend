import type { Nullable } from '@/shared';

export class UpdateProductsSectionDto {
  name: string;
  icon: string;
  enableWarehouse: boolean;
  enableBarcode: boolean;

  // in hours
  cancelAfter: Nullable<number>;

  constructor({
    name,
    icon,
    enableWarehouse,
    enableBarcode,
    cancelAfter,
  }: UpdateProductsSectionDto) {
    this.name = name;
    this.icon = icon;
    this.enableWarehouse = enableWarehouse;
    this.enableBarcode = enableBarcode;
    this.cancelAfter = cancelAfter;
  }
}

import type { IconName, Nullable } from '@/shared';
import type { ProductsSectionDto } from '../../../../api';
import { ProductsSectionType } from './ProductsSectionType';

export class ProductsSection {
  id: number;
  name: string;
  icon: IconName;
  entityTypeIds: number[];
  schedulerIds: number[];
  type: ProductsSectionType;
  enableWarehouse: boolean;
  enableBarcode: boolean;

  // in hours
  cancelAfter: Nullable<number>;

  constructor({
    id,
    name,
    icon,
    entityTypeIds,
    schedulerIds,
    type,
    enableWarehouse,
    enableBarcode,
    cancelAfter,
  }: {
    id: number;
    name: string;
    icon: IconName;
    entityTypeIds: number[];
    schedulerIds: number[];
    type: ProductsSectionType;
    enableWarehouse: boolean;
    enableBarcode: boolean;
    cancelAfter: Nullable<number>;
  }) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.entityTypeIds = entityTypeIds;
    this.schedulerIds = schedulerIds;
    this.type = type;
    this.enableWarehouse = enableWarehouse;
    this.enableBarcode = enableBarcode;
    this.cancelAfter = cancelAfter;
  }

  static fromDto(dto: ProductsSectionDto): ProductsSection {
    return new ProductsSection({
      id: dto.id,
      name: dto.name,
      icon: dto.icon,
      entityTypeIds: dto.entityTypeIds,
      schedulerIds: dto.schedulerIds,
      type: dto.type,
      enableWarehouse: dto.enableWarehouse,
      enableBarcode: dto.enableBarcode,
      cancelAfter: dto.cancelAfter,
    });
  }

  static fromDtos(dtos: ProductsSectionDto[]): ProductsSection[] {
    return dtos.map(this.fromDto);
  }

  isSale = (): boolean => {
    return this.type === ProductsSectionType.SALE;
  };
}

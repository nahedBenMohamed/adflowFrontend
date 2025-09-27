import type { IconName, Nullable } from '@/shared';
import type { ProductsSectionType } from '../../../shared';

export interface ProductsSectionDto {
  id: number;
  name: string;
  icon: IconName;
  entityTypeIds: number[];
  schedulerIds: number[];
  type: ProductsSectionType;
  enableWarehouse: boolean;
  enableBarcode: boolean;
  cancelAfter: Nullable<number>;
}

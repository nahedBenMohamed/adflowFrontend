import type { Currency, EntityInfo, Nullable } from '@/shared';
import type { RentalOrderStatus } from '../../../shared';
import type { DatePeriodDto } from './DatePeriodDto';
import type { RentalOrderItemDto } from './RentalOrderItemDto';

export interface RentalOrderDto {
  id: number;
  sectionId: number;
  createdBy: number;
  createdAt: string;
  currency: Currency;
  orderNumber: number;
  taxIncluded: boolean;
  periods: DatePeriodDto[];
  status: RentalOrderStatus;
  entityInfo: EntityInfo;
  items: RentalOrderItemDto[];
  warehouseId: Nullable<number>;
}

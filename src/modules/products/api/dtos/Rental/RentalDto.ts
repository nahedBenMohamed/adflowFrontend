import type { EntityInfo } from '@/shared';
import type { RentalStatus } from '../../../shared';

export interface RentalDto {
  id: number;
  endDate: string;
  productId: number;
  startDate: string;
  orderItemId: number;
  status: RentalStatus;
  entityInfo: EntityInfo;
}

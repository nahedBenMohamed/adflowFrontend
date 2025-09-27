import type { EntityInfo } from '@/shared';
import type { RentalStatus } from '../../../shared';

export interface RentalEventDto {
  id: number;
  endDate: string;
  productId: number;
  startDate: string;
  orderItemId: number;
  status: RentalStatus;
  entityInfo: EntityInfo;
}

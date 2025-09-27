import type { Nullable } from '@/shared';
import type { RentalOrderStatus } from '../../../shared';

export class RentalOrderFilter {
  entityId?: Nullable<number>;
  statuses?: Nullable<RentalOrderStatus[]>;

  constructor({ entityId, statuses }: RentalOrderFilter) {
    this.entityId = entityId;
    this.statuses = statuses;
  }
}

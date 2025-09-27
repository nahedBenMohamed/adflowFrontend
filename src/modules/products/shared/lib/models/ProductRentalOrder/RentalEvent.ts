import { UtcDate, type EntityInfo } from '@/shared';
import type { RentalEventDto } from '../../../../api';
import type { RentalStatus } from '../Product/RentalStatus';

export class RentalEvent {
  id: number;
  productId: number;
  orderItemId: number;
  startDate: UtcDate;
  endDate: UtcDate;
  status: RentalStatus;
  entityInfo: EntityInfo;

  constructor(
    id: number,
    productId: number,
    orderItemId: number,
    startDate: UtcDate,
    endDate: UtcDate,
    status: RentalStatus,
    entityInfo: EntityInfo
  ) {
    this.id = id;
    this.productId = productId;
    this.orderItemId = orderItemId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.entityInfo = entityInfo;
  }

  static fromDto(dto: RentalEventDto): RentalEvent {
    return new RentalEvent(
      dto.id,
      dto.productId,
      dto.orderItemId,
      UtcDate.parseISO(dto.startDate),
      UtcDate.parseISO(dto.endDate),
      dto.status,
      dto.entityInfo
    );
  }

  static fromDtos(dtos: RentalEventDto[]): RentalEvent[] {
    return dtos.map(this.fromDto);
  }
}

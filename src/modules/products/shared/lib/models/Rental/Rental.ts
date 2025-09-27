import type { EntityInfo } from '@/shared';
import type { RentalDto } from '../../../../api';
import type { RentalStatus } from '../Product/RentalStatus';

export class Rental {
  id: number;
  productId: number;
  orderItemId: number;
  startDate: string;
  endDate: string;
  status: RentalStatus;
  entityInfo: EntityInfo;

  constructor(
    id: number,
    productId: number,
    orderItemId: number,
    startDate: string,
    endDate: string,
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

  static fromDto(dto: RentalDto): Rental {
    return new Rental(
      dto.id,
      dto.productId,
      dto.orderItemId,
      dto.startDate,
      dto.endDate,
      dto.status,
      dto.entityInfo
    );
  }

  static fromDtos(dtos: RentalDto[]): Rental[] {
    return dtos.map(this.fromDto);
  }
}

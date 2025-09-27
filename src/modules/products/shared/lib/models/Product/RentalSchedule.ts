import { UtcDate } from '@/shared';
import type { RentalScheduleDto } from '../../../../api';

export class RentalSchedule {
  id: number;
  productId: number;
  orderItemId: number;
  startDate: UtcDate;
  endDate: UtcDate;
  status: string;

  constructor({ id, productId, orderItemId, startDate, endDate, status }: RentalSchedule) {
    this.id = id;
    this.productId = productId;
    this.orderItemId = orderItemId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
  }

  static fromDto(dto: RentalScheduleDto): RentalSchedule {
    return new RentalSchedule({
      id: dto.id,
      productId: dto.productId,
      orderItemId: dto.orderItemId,
      startDate: UtcDate.parseISO(dto.startDate),
      endDate: UtcDate.parseISO(dto.endDate),
      status: dto.status,
    });
  }

  static fromDtos(dtos: RentalScheduleDto[]): RentalSchedule[] {
    return dtos.map(this.fromDto);
  }
}

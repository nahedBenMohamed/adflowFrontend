import { ReservationDto } from '../../../../api';

export class Reservation {
  warehouseId: number;
  quantity: number;

  constructor({ warehouseId, quantity }: { warehouseId: number; quantity: number }) {
    this.warehouseId = warehouseId;
    this.quantity = quantity;
  }

  static fromDto(dto: ReservationDto): Reservation {
    return new Reservation({ warehouseId: dto.warehouseId, quantity: dto.quantity });
  }

  static fromDtos(dtos: ReservationDto[]): Reservation[] {
    return dtos.map(this.fromDto);
  }

  static toDto(model: Reservation): ReservationDto {
    return new ReservationDto({ warehouseId: model.warehouseId, quantity: model.quantity });
  }

  static toDtos(models: Reservation[]): ReservationDto[] {
    return models.map(this.toDto);
  }
}

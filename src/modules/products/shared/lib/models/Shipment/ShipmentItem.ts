import type { ShipmentItemDto } from '../../../../api';

export class ShipmentItem {
  id: number;
  productId: number;
  quantity: number;

  constructor({ id, productId, quantity }: { id: number; productId: number; quantity: number }) {
    this.id = id;
    this.productId = productId;
    this.quantity = quantity;
  }

  static fromDto(dto: ShipmentItemDto): ShipmentItem {
    return new ShipmentItem({ id: dto.id, productId: dto.productId, quantity: dto.quantity });
  }

  static fromDtos(dtos: ShipmentItemDto[]): ShipmentItem[] {
    return dtos.map(this.fromDto);
  }
}

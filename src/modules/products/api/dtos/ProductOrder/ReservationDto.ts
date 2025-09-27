export class ReservationDto {
  warehouseId: number;
  quantity: number;

  constructor({ warehouseId, quantity }: ReservationDto) {
    this.warehouseId = warehouseId;
    this.quantity = quantity;
  }
}

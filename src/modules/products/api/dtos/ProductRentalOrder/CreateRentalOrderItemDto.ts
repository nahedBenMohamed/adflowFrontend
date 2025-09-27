export class CreateRentalOrderItemDto {
  productId: number;
  sortOrder: number;

  constructor({ productId, sortOrder }: CreateRentalOrderItemDto) {
    this.productId = productId;
    this.sortOrder = sortOrder;
  }
}

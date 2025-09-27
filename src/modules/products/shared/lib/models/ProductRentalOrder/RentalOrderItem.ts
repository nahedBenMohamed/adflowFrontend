import type { RentalOrderItemDto } from '../../../../api';

export class RentalOrderItem {
  id: number;
  productId: number;
  unitPrice: number;
  tax: number;
  discount: number;
  sortOrder: number;

  constructor({ id, productId, unitPrice, tax, discount, sortOrder }: RentalOrderItem) {
    this.id = id;
    this.productId = productId;
    this.unitPrice = unitPrice;
    this.tax = tax;
    this.discount = discount;
    this.sortOrder = sortOrder;
  }

  static fromDto(dto: RentalOrderItemDto): RentalOrderItem {
    return new RentalOrderItem({
      id: dto.id,
      productId: dto.productId,
      unitPrice: dto.unitPrice,
      tax: dto.tax,
      discount: dto.discount,
      sortOrder: dto.sortOrder,
    });
  }

  static fromDtos(dtos: RentalOrderItemDto[]): RentalOrderItem[] {
    return dtos.map(this.fromDto);
  }
}

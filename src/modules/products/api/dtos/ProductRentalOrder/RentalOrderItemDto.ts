import type { RentalOrderItemRow } from '../../../shared';

export class RentalOrderItemDto {
  id: number;
  productId: number;
  unitPrice: number;
  tax: number;
  discount: number;
  sortOrder: number;

  constructor({ id, productId, unitPrice, tax, discount, sortOrder }: RentalOrderItemDto) {
    this.id = id;
    this.productId = productId;
    this.unitPrice = unitPrice;
    this.tax = tax;
    this.discount = discount;
    this.sortOrder = sortOrder;
  }

  static fromOrderItemRow(model: RentalOrderItemRow): RentalOrderItemDto {
    return new RentalOrderItemDto({
      id: model.id,
      productId: model.product.id,
      unitPrice: model.price.asNumber(),
      tax: model.tax.asNumber(),
      discount: model.discount.asNumber(),
      sortOrder: model.sortOrder,
    });
  }

  static fromOrderItemRows(models: RentalOrderItemRow[]): RentalOrderItemDto[] {
    return models.map(this.fromOrderItemRow);
  }
}

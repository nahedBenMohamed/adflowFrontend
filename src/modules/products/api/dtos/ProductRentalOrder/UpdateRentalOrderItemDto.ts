import type { RentalOrderItemRow } from '../../../shared';

export class UpdateRentalOrderItemDto {
  id: number;
  productId: number;
  unitPrice: number;
  tax: number;
  discount: number;
  sortOrder: number;

  constructor({ id, productId, unitPrice, tax, discount, sortOrder }: UpdateRentalOrderItemDto) {
    this.id = id;
    this.productId = productId;
    this.unitPrice = unitPrice;
    this.tax = tax;
    this.discount = discount;
    this.sortOrder = sortOrder;
  }

  static fromOrderItemRow(model: RentalOrderItemRow): UpdateRentalOrderItemDto {
    return new UpdateRentalOrderItemDto({
      id: model.id,
      productId: model.product.id,
      unitPrice: model.price.asNumber(),
      tax: model.tax.asNumber(),
      discount: model.discount.asNumber(),
      sortOrder: model.sortOrder,
    });
  }

  static fromOrderItemRows(models: RentalOrderItemRow[]): UpdateRentalOrderItemDto[] {
    return models.map(this.fromOrderItemRow);
  }
}

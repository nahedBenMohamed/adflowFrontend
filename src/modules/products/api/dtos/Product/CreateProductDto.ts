import type { Nullable } from '@/shared';
import type { ProductType } from '../../../shared';
import type { CreateProductPriceDto } from '../ProductPrice/CreateProductPriceDto';
import type { UpdateStockDto } from '../Stock/UpdateStockDto';

export class CreateProductDto {
  name: string;
  type: ProductType;
  description: Nullable<string>;
  sku: Nullable<string>;
  unit: Nullable<string>;
  tax: Nullable<number>;
  categoryId: Nullable<number>;
  prices: CreateProductPriceDto[];
  photoFileIds: string[];
  stocks: UpdateStockDto[];

  constructor({
    name,
    type,
    description,
    sku,
    unit,
    tax,
    categoryId,
    prices,
    photoFileIds,
    stocks,
  }: CreateProductDto) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.sku = sku;
    this.unit = unit;
    this.tax = tax;
    this.categoryId = categoryId;
    this.prices = prices;
    this.photoFileIds = photoFileIds;
    this.stocks = stocks;
  }
}

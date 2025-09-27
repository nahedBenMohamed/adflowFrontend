import { FileLink, type Nullable } from '@/shared';
import { computed } from 'mobx';
import { type ProductDto } from '../../../../api';
import type { ProductPrice } from '../ProductPrice/ProductPrice';
import { Stock } from '../Stock/Stock';
import { ProductType } from './ProductType';
import { RentalSchedule } from './RentalSchedule';
import type { RentalStatus } from './RentalStatus';

export class Product {
  id: number;
  name: string;
  type: ProductType;
  description: Nullable<string>;
  sku: Nullable<string>;
  unit: Nullable<string>;
  tax: Nullable<number>;
  categoryId: Nullable<number>;
  prices: ProductPrice[];
  photoFileLinks: FileLink[];
  stocks: Stock[];
  sectionId: number;
  rentalStatus: Nullable<RentalStatus>;
  rentalRecords: Nullable<RentalSchedule[]>;

  constructor({
    id,
    name,
    type,
    description,
    sku,
    unit,
    tax,
    categoryId,
    prices,
    photoFileLinks,
    stocks,
    sectionId,
    rentalStatus,
    rentalRecords,
  }: {
    id: number;
    name: string;
    type: ProductType;
    description: Nullable<string>;
    sku: Nullable<string>;
    unit: Nullable<string>;
    tax: Nullable<number>;
    categoryId: Nullable<number>;
    prices: ProductPrice[];
    photoFileLinks: FileLink[];
    stocks: Stock[];
    sectionId: number;
    rentalStatus: Nullable<RentalStatus>;
    rentalRecords: Nullable<RentalSchedule[]>;
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.description = description;
    this.sku = sku;
    this.unit = unit;
    this.tax = tax;
    this.categoryId = categoryId;
    this.prices = prices;
    this.photoFileLinks = photoFileLinks;
    this.stocks = stocks;
    this.sectionId = sectionId;
    this.rentalStatus = rentalStatus;
    this.rentalRecords = rentalRecords;
  }

  static fromDto(dto: ProductDto): Product {
    return new Product({
      id: dto.id,
      name: dto.name,
      type: dto.type,
      description: dto.description,
      sku: dto.sku,
      unit: dto.unit,
      tax: dto.tax,
      categoryId: dto.categoryId,
      prices: dto.prices,
      photoFileLinks: FileLink.fromDtos(dto.photoFileLinks),
      stocks: Stock.fromDtos(dto.stocks),
      sectionId: dto.sectionId,
      rentalStatus: dto.rentalStatus,
      rentalRecords: dto.rentalRecords ? RentalSchedule.fromDtos(dto.rentalRecords) : null,
    });
  }

  static fromDtos(dtos: ProductDto[]): Product[] {
    return dtos.map(this.fromDto);
  }

  isService = (): boolean => {
    return this.type === ProductType.SERVICE;
  };

  isProduct = (): boolean => {
    return this.type === ProductType.PRODUCT;
  };

  @computed.struct
  getAvailable = (warehouseId: Nullable<number>): number => {
    if (warehouseId) {
      const stock = this.stocks.find(s => s.warehouseId === warehouseId);

      return stock ? stock.available : 0;
    }

    return this.stocks.reduce<number>((acc, s) => acc + s.available, 0);
  };

  @computed.struct
  getReserved = (warehouseId: Nullable<number>): number => {
    if (warehouseId) {
      const stock = this.stocks.find(s => s.warehouseId === warehouseId);

      return stock ? stock.reserved : 0;
    }

    return this.stocks.reduce<number>((acc, s) => acc + s.reserved, 0);
  };

  getFirstWarehouseWithAvailableStockId = (): Nullable<number> => {
    const stock = this.stocks.find(s => s.available > 0);

    return stock ? stock.warehouseId : null;
  };
}

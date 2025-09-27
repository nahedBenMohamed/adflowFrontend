import type { FileLinkDto } from '@/app';
import type { Nullable } from '@/shared';
import type { ProductType, RentalStatus } from '../../../shared';
import type { ProductPriceDto } from '../ProductPrice/ProductPriceDto';
import type { StockDto } from '../Stock/StockDto';
import type { RentalScheduleDto } from './RentalScheduleDto';

export interface ProductDto {
  id: number;
  name: string;
  type: ProductType;
  sectionId: number;
  stocks: StockDto[];
  sku: Nullable<string>;
  tax: Nullable<number>;
  unit: Nullable<string>;
  prices: ProductPriceDto[];
  categoryId: Nullable<number>;
  description: Nullable<string>;
  photoFileLinks: FileLinkDto[];
  rentalStatus: Nullable<RentalStatus>;
  rentalRecords: Nullable<RentalScheduleDto[]>;
}

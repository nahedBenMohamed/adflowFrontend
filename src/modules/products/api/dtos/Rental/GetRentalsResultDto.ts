import type { ProductInfoDto } from '../Product/ProductInfoDto';
import type { RentalDto } from './RentalDto';

export class GetRentalsResultDto {
  products: ProductInfoDto[];
  events: RentalDto[];

  constructor({ products, events }: GetRentalsResultDto) {
    this.products = products;
    this.events = events;
  }
}

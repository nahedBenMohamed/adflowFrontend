import type { GetRentalsResultDto, ProductInfoDto } from '../../../../api';
import { Rental } from './Rental';

export class GetRentalsResult {
  products: ProductInfoDto[];
  events: Rental[];

  constructor({ products, events }: GetRentalsResultDto) {
    this.products = products;
    this.events = events;
  }

  static fromDto(dto: GetRentalsResultDto): GetRentalsResult {
    return new GetRentalsResult({
      products: dto.products,
      events: Rental.fromDtos(dto.events),
    });
  }
}

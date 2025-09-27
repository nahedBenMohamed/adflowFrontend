import type { ProductRentalStatusDto } from '../../../../api';
import type { RentalStatus } from '../Product/RentalStatus';
import { RentalEvent } from './RentalEvent';

export class ProductRentalStatus {
  productId: number;
  rentalStatus: RentalStatus;
  rentalEvents: RentalEvent[];

  constructor({
    productId,
    rentalStatus,
    rentalEvents,
  }: {
    productId: number;
    rentalStatus: RentalStatus;
    rentalEvents: RentalEvent[];
  }) {
    this.productId = productId;
    this.rentalStatus = rentalStatus;
    this.rentalEvents = rentalEvents;
  }

  static fromDto(dto: ProductRentalStatusDto): ProductRentalStatus {
    return new ProductRentalStatus({
      productId: dto.productId,
      rentalStatus: dto.rentalStatus,
      rentalEvents: RentalEvent.fromDtos(dto.rentalEvents),
    });
  }

  static fromDtos(dtos: ProductRentalStatusDto[]): ProductRentalStatus[] {
    return dtos.map(this.fromDto);
  }
}

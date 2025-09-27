import type { RentalStatus } from '../../../shared';
import type { RentalEventDto } from './RentalEventDto';

export interface ProductRentalStatusDto {
  productId: number;
  rentalStatus: RentalStatus;
  rentalEvents: RentalEventDto[];
}

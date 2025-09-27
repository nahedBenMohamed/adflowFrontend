export interface RentalScheduleDto {
  id: number;
  productId: number;
  orderItemId: number;
  startDate: string;
  endDate: string;
  status: string;
}

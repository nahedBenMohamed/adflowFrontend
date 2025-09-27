import type { Nullable } from '@/shared';
import type { QuantityAmount } from '../../../../shared';
import type { CustomerReportFieldDto } from './CustomerReportFieldDto';

export interface CustomerReportRowDto {
  ownerId: number;
  ownerName: string;
  won: QuantityAmount;
  all: QuantityAmount;
  open: QuantityAmount;
  lost: QuantityAmount;
  avgWonDealTime: number;
  avgWonDealBudget: number;
  ownerEntityTypeId: number;
  wonProductQuantity: number;
  avgWonDealQuantity: number;
  fields?: Nullable<CustomerReportFieldDto[]>;
}

import type { MinMaxColumnSize } from '@/shared';
import { RentalCardOrderColumnsIds } from './RentalCardOrderColumnsIds';

type ExcludedRentalCardOrderColumnsIds = Exclude<
  RentalCardOrderColumnsIds,
  RentalCardOrderColumnsIds.NAME | RentalCardOrderColumnsIds.AVAILABILITY
>;

export const RentalCardOrderColumnsSizes: Record<
  MinMaxColumnSize | ExcludedRentalCardOrderColumnsIds,
  number
> = {
  min: 68,
  max: 640,
  [RentalCardOrderColumnsIds.CHECKBOX]: 16,
  [RentalCardOrderColumnsIds.ACTIONS]: 32,
  [RentalCardOrderColumnsIds.TAX]: 124,
  [RentalCardOrderColumnsIds.DISCOUNT]: 96,
  [RentalCardOrderColumnsIds.AMOUNT]: 152,
  [RentalCardOrderColumnsIds.PRICE]: 168,
} as const;

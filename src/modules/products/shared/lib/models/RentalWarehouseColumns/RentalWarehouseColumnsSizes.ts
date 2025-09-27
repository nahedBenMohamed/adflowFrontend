import type { MinMaxColumnSize } from '@/shared';
import { RentalWarehouseColumnsIds } from './RentalWarehouseColumnsIds';

type RentalWarehouseColumnsIdsWithoutName = Exclude<
  RentalWarehouseColumnsIds,
  RentalWarehouseColumnsIds.NAME
>;

export const RentalWarehouseColumnsSizes: Record<
  MinMaxColumnSize | RentalWarehouseColumnsIdsWithoutName,
  number
> = {
  min: 68,
  max: 640,
  [RentalWarehouseColumnsIds.CHECKBOX]: 16,
  [RentalWarehouseColumnsIds.CATEGORY]: 96,
  [RentalWarehouseColumnsIds.AVAILABILITY]: 96,
  [RentalWarehouseColumnsIds.ACTIONS]: 32,
} as const;

import type { MinMaxColumnSize } from '@/shared';
import { WarehouseColumnsIds } from './WarehouseColumnsIds';

type WarehouseColumnsIdsWithoutName = Exclude<WarehouseColumnsIds, WarehouseColumnsIds.NAME>;

export const WarehouseColumnsSizes: Record<
  MinMaxColumnSize | WarehouseColumnsIdsWithoutName,
  number
> = {
  min: 68,
  max: 640,
  [WarehouseColumnsIds.CHECKBOX]: 16,
  [WarehouseColumnsIds.ACTIONS]: 32,
  [WarehouseColumnsIds.AVAILABLE]: 96,
  [WarehouseColumnsIds.QUANTITY]: 96,
} as const;

import { ShipmentColumnsIds } from './ShipmentColumnsIds';

type ShipmentColumnsIdsWithoutName = Exclude<ShipmentColumnsIds, ShipmentColumnsIds.NAME>;

export const ShipmentColumnsSizes: Record<ShipmentColumnsIdsWithoutName, number> = {
  [ShipmentColumnsIds.CHECKBOX]: 16,
  [ShipmentColumnsIds.SKU]: 240,
  [ShipmentColumnsIds.AVAILABLE]: 120,
  [ShipmentColumnsIds.QUANTITY]: 120,
} as const;

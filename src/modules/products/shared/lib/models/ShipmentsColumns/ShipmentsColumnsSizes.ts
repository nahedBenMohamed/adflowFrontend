import { ShipmentsColumnsIds } from './ShipmentsColumnsIds';

type ShipmentColumnsIdsWithoutName = Exclude<ShipmentsColumnsIds, ShipmentsColumnsIds.NAME>;

export const ShipmentsColumnsSizes: Record<ShipmentColumnsIdsWithoutName, number> = {
  [ShipmentsColumnsIds.WAREHOUSE]: 160,
  [ShipmentsColumnsIds.STATUS]: 224,
  [ShipmentsColumnsIds.CREATED_AT]: 184,
  [ShipmentsColumnsIds.SHIPPED_AT]: 184,
  [ShipmentsColumnsIds.LINKED_ENTITY]: 200,
} as const;

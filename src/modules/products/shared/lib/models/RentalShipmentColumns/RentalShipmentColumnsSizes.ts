import { RentalShipmentColumnsIds } from './RentalShipmentColumnsIds';

type RentalShipmentColumnsIdsWithoutName = Exclude<
  RentalShipmentColumnsIds,
  RentalShipmentColumnsIds.NAME
>;

export const RentalShipmentColumnsSizes: Record<RentalShipmentColumnsIdsWithoutName, number> = {
  [RentalShipmentColumnsIds.CHECKBOX]: 16,
  [RentalShipmentColumnsIds.SKU]: 192,
  [RentalShipmentColumnsIds.TAX]: 80,
  [RentalShipmentColumnsIds.DISCOUNT]: 80,
  [RentalShipmentColumnsIds.TOTAL]: 176,
  [RentalShipmentColumnsIds.QUANTITY]: 120,
} as const;

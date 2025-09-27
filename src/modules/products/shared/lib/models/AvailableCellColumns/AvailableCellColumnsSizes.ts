import { AvailableCellColumnsIds } from './AvailableCellColumnsIds';

export const AvailableCellColumnsSizes: Record<AvailableCellColumnsIds, number> = {
  [AvailableCellColumnsIds.NAME]: 200,
  [AvailableCellColumnsIds.STOCK]: 72,
  [AvailableCellColumnsIds.AVAILABLE]: 64,
  [AvailableCellColumnsIds.RESERVED]: 64,
} as const;

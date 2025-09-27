import { PriceCellColumnsIds } from './PriceCellColumnsIds';

type PriceCellColumnsIdsWithoutName = Exclude<PriceCellColumnsIds, PriceCellColumnsIds.NAME>;

export const PriceCellColumnsSizes: Record<PriceCellColumnsIdsWithoutName, number> = {
  [PriceCellColumnsIds.PRICE]: 72,
  [PriceCellColumnsIds.CURRENCY]: 64,
} as const;

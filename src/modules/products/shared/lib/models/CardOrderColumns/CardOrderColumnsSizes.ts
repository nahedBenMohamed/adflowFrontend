import type { MinMaxColumnSize } from '@/shared';
import { CardOrderColumnsIds } from './CardOrderColumnsIds';

type CardOrderColumnsIdsWithoutName = Exclude<CardOrderColumnsIds, CardOrderColumnsIds.NAME>;

export const CardOrderColumnsSizes: Record<
  MinMaxColumnSize | CardOrderColumnsIdsWithoutName,
  number
> = {
  min: 68,
  max: 640,
  [CardOrderColumnsIds.CHECKBOX]: 16,
  [CardOrderColumnsIds.ACTIONS]: 32,
  [CardOrderColumnsIds.TAX]: 124,
  [CardOrderColumnsIds.DISCOUNT]: 96,
  [CardOrderColumnsIds.QUANTITY]: 96,
  [CardOrderColumnsIds.AMOUNT]: 152,
  [CardOrderColumnsIds.PRICE]: 168,
  [CardOrderColumnsIds.AVAILABLE]: 96,
} as const;

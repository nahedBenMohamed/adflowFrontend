import { ReservationsColumnsIds } from './ReservationsColumnsIds';

type ReservationsColumnsIdsWithoutName = Exclude<
  ReservationsColumnsIds,
  ReservationsColumnsIds.NAME
>;

export const ReservationsColumnsSizes: Record<ReservationsColumnsIdsWithoutName, number> = {
  [ReservationsColumnsIds.STOCK]: 64,
  [ReservationsColumnsIds.AVAILABLE]: 64,
  [ReservationsColumnsIds.RESERVED]: 64,
  [ReservationsColumnsIds.QUANTITY]: 104,
} as const;

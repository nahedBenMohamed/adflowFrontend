import { AppointmentServiceBlockColumnsIds } from './AppointmentServiceBlockColumnsIds';

type AppointmentServiceBlockColumnsIdsWithoutPrice = Exclude<
  AppointmentServiceBlockColumnsIds,
  AppointmentServiceBlockColumnsIds.PRICE
>;

export const AppointmentServiceBlockColumnsSizes: Record<
  AppointmentServiceBlockColumnsIdsWithoutPrice,
  number
> = {
  [AppointmentServiceBlockColumnsIds.DISCOUNT]: 72,
  [AppointmentServiceBlockColumnsIds.QUANTITY]: 88,
  [AppointmentServiceBlockColumnsIds.AMOUNT]: 120,
} as const;

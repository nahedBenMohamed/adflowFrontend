import { AppointmentHistoryColumnsIds } from './AppointmentHistoryColumnsIds';

type AppointmentHistoryColumnsIdsWithoutDate = Exclude<
  AppointmentHistoryColumnsIds,
  AppointmentHistoryColumnsIds.DATE
>;

export const AppointmentHistoryColumnsSizes: Record<
  AppointmentHistoryColumnsIdsWithoutDate,
  number
> = {
  [AppointmentHistoryColumnsIds.TIME]: 160,
  [AppointmentHistoryColumnsIds.PERFORMER]: 184,
  [AppointmentHistoryColumnsIds.SERVICES]: 160,
  [AppointmentHistoryColumnsIds.TOTAL]: 196,
  [AppointmentHistoryColumnsIds.STATUS]: 152,
} as const;

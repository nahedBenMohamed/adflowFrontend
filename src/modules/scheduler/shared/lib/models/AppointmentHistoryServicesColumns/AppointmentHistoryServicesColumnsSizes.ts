import { AppointmentHistoryServicesColumnsIds } from './AppointmentHistoryServicesColumnsIds';

export const AppointmentHistoryServicesColumnsSizes: Record<
  AppointmentHistoryServicesColumnsIds,
  number
> = {
  [AppointmentHistoryServicesColumnsIds.NAME]: 176,
  [AppointmentHistoryServicesColumnsIds.PRICE]: 104,
  [AppointmentHistoryServicesColumnsIds.QUANTITY]: 88,
  [AppointmentHistoryServicesColumnsIds.DISCOUNT]: 72,
  [AppointmentHistoryServicesColumnsIds.AMOUNT]: 104,
} as const;

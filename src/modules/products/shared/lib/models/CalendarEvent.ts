import type { RentalStatus } from './Product/RentalStatus';

export type CalendarEvent = {
  id: string;
  end: string;
  title: string;
  start: string;
  resourceId: string;
  status: RentalStatus;
};

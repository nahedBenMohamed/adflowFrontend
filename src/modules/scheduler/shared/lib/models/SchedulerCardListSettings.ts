import type { UtcDate } from '@/shared';

export class SchedulerCardListSettings {
  scheduleId: number;
  linkedEntityTypeId: number;
  startDate: UtcDate;
  endDate: UtcDate;
}

import type { Entity, UtcDate } from '@/shared';

export interface AddAppointmentPreset {
  entity?: Entity;
  endDate?: UtcDate;
  scheduleId?: number;
  startDate?: UtcDate;
  performerObjectId?: number;
}

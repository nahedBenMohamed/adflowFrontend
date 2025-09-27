import type { BusinessHours } from '@/shared';
import type { ResourceSourceInput } from '@fullcalendar/resource';
import type { SchedulePerformer } from '../models';

export const generatePerformersResources = ({
  performers,
  performersBusinessHours,
}: {
  performers: SchedulePerformer[];
  performersBusinessHours: Map<SchedulePerformer, BusinessHours>;
}): ResourceSourceInput =>
  performers.map(p => ({
    id: String(p.id),
    businessHours: performersBusinessHours.has(p)
      ? {
          startTime: performersBusinessHours.get(p)?.from,
          endTime: performersBusinessHours.get(p)?.to,
        }
      : undefined,
    extendedProps: {
      performer: p,
    },
  }));

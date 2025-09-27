import { UtcDate, type BusinessHours, type Nullable } from '@/shared';
import type { ScheduleAppointment } from '../../models';

interface SchedulerBoardSlotsMap {
  [key: number]: {
    endDate: UtcDate;
    startDate: UtcDate;
    appointment: Nullable<ScheduleAppointment>;
  };
}

export const generateSlotsMap = ({
  currentDate,
  timePeriod,
  businessHours,
}: {
  currentDate: UtcDate;
  timePeriod: number;
  businessHours: BusinessHours;
}): SchedulerBoardSlotsMap => {
  const slotsMap: SchedulerBoardSlotsMap = {};

  const businessHoursStartSeconds = UtcDate.parseHoursStringToSeconds(businessHours.from);
  let businessHoursEndSeconds = UtcDate.parseHoursStringToSeconds(businessHours.to);

  // if end < start then end is moved to next day due to local time adjustments
  // adding one day manually
  if (businessHoursStartSeconds > businessHoursEndSeconds) businessHoursEndSeconds += 24 * 60 * 60;

  for (
    let period = businessHoursStartSeconds;
    period < businessHoursEndSeconds;
    period += timePeriod
  ) {
    const periodCount = (period - businessHoursStartSeconds) / timePeriod;

    if (period + timePeriod > businessHoursEndSeconds) break;

    slotsMap[periodCount] = {
      startDate: currentDate.startOfDay().addSeconds(period),
      endDate: currentDate.startOfDay().addSeconds(period + timePeriod),
      appointment: null,
    };
  }

  return slotsMap;
};

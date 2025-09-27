import { UtcDate, type BusinessHours, type Option } from '@/shared';

// all calculations in seconds
export const generateSchedulerBuilderTimePeriodOptions = (
  businessHours: BusinessHours
): Option<number>[] => {
  const options: Option<number>[] = [];

  const businessHoursDelta =
    UtcDate.parseHoursStringToSeconds(businessHours.to) -
    UtcDate.parseHoursStringToSeconds(businessHours.from);

  const step = 5 * 60;

  for (let i = step * 2; i <= businessHoursDelta; i += step) {
    const hours = Math.floor(i / 60 / 60);
    const minutes = Math.floor((i - hours * 60 * 60) / 60);

    const label = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    options.push({
      label,
      value: i,
    });
  }

  return options;
};

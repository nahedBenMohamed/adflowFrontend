import { UtcDate, type BusinessHours, type Option } from '@/shared';

// timePeriod in seconds, timePeriod – 00:15, 00:30, ..., 24:00.
export const generateTimePeriodOptions = ({
  timePeriod,
  businessHours,
}: {
  timePeriod: number;
  businessHours: BusinessHours;
}): Option[] => {
  const options: Option<string>[] = [];

  const { from, to } = businessHours;

  const businessHoursStartSeconds = UtcDate.parseHoursStringToSeconds(from);
  const businessHoursEndSeconds = UtcDate.parseHoursStringToSeconds(to);

  for (
    let period = businessHoursStartSeconds;
    period < businessHoursEndSeconds;
    period += timePeriod
  ) {
    const hours = Math.floor(period / 60 / 60);
    const minutes = Math.floor((period - hours * 60 * 60) / 60);

    if (period + timePeriod > businessHoursEndSeconds) break;

    const label = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    options.push({
      label,
      value: label,
    });
  }

  return options;
};

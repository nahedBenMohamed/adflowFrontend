import type { Option } from '@/shared';
import dayjs from 'dayjs';
import dayjs_tz from 'dayjs/plugin/timezone';
import dayjs_utc from 'dayjs/plugin/utc';

dayjs.extend(dayjs_utc);
dayjs.extend(dayjs_tz);

export const getAllTimezoneOptions = (): Option[] => {
  const timezones: Option<string>[] = [];

  // get all timezone names using Intl util
  const zones = Intl.supportedValuesOf('timeZone');

  for (const zone of zones) {
    // Create a valid date with UTC and then convert to the target timezone
    const timezone = dayjs.utc().tz(zone);
    const offset = timezone.utcOffset();
    const offsetHours = Math.abs(Math.floor(offset / 60));
    const offsetMinutes = Math.abs(offset % 60);
    const sign = offset >= 0 ? '+' : '-';

    // get the current time in the timezone to include in the label
    const currentTime = timezone.format(`h:mm${offsetMinutes !== 0 ? ':ss' : ''} A`);

    // create a human-readable label like "(GMT+03:00) Europe/Moscow – 12:26 PM"
    const label = `(GMT${sign}${String(offsetHours).padStart(2, '0')}:${String(
      offsetMinutes
    ).padStart(2, '0')}) ${zone.replace(/_/g, ' ')} – ${currentTime}`;

    timezones.push({ value: zone, label });
  }

  return timezones;
};

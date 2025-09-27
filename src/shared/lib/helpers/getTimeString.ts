import { ConvertTimeUtil } from '../utils';

export const getTimeString = (seconds: number): string => {
  if (seconds < ConvertTimeUtil.secondsInMinute) return `00:${String(seconds).padStart(2, '00')}`;

  const s = String(ConvertTimeUtil.getRemainingSecondsFromSeconds(seconds)).padStart(2, '00');
  const m = String(ConvertTimeUtil.getDayMinutesFromSeconds(seconds)).padStart(2, '00');

  if (seconds < ConvertTimeUtil.secondsInHour) return `${m}:${s}`;

  const h = String(ConvertTimeUtil.getDayHoursFromSeconds(seconds)).padStart(2, '00');

  if (seconds < ConvertTimeUtil.secondsInDay) return `${h}:${m}:${s}`;

  return '24:00:00';
};

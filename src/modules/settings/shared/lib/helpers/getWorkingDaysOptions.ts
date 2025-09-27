import { WeekDays, type Option } from '@/shared';
import type { TFunction } from 'i18next';

export const getWorkingDaysOptions = (t: TFunction): Option<WeekDays>[] => [
  { value: WeekDays.MONDAY, label: t(WeekDays.MONDAY) },
  { value: WeekDays.TUESDAY, label: t(WeekDays.TUESDAY) },
  { value: WeekDays.WEDNESDAY, label: t(WeekDays.WEDNESDAY) },
  { value: WeekDays.THURSDAY, label: t(WeekDays.THURSDAY) },
  { value: WeekDays.FRIDAY, label: t(WeekDays.FRIDAY) },
  { value: WeekDays.SATURDAY, label: t(WeekDays.SATURDAY) },
  { value: WeekDays.SUNDAY, label: t(WeekDays.SUNDAY) },
];

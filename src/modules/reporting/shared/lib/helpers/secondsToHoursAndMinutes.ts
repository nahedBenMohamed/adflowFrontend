import { ConvertTimeUtil, type Nullable } from '@/shared';
import type { TFunction } from 'i18next';

export const secondsToHoursAndMinutes = ({
  seconds,
  t,
}: {
  seconds?: Nullable<number>;
  t: TFunction;
}): string => {
  const { hours, minutes } = ConvertTimeUtil.getHoursAndMinutesFromSeconds(seconds ?? 0);

  return `${hours > 0 ? `${hours}${t('hours')}` : ''} ${
    minutes > 0 ? minutes.toString().padStart(2, '0') : minutes
  }${t('min')}`;
};

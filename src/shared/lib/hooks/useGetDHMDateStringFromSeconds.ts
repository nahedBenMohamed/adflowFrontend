import { useTranslation } from 'react-i18next';
import { calculateEndOfWordIdxByNumber } from '../helpers';
import { ConvertTimeUtil } from '../utils';

export const useGetDHMDateStringFromSeconds = ({
  value,
  minified,
}: {
  value: number;
  minified?: boolean;
}): string => {
  const { t } = useTranslation();

  const { days, hours, minutes } = ConvertTimeUtil.getDHMSFromSeconds(value);

  let str = '';

  if (days !== 0) {
    const idx = calculateEndOfWordIdxByNumber(days);

    str += minified
      ? `${days}${t('day_char')}`
      : `${days} ${minified ? t('day_char') : t(`days.${idx}`)}`;
  }

  if (days !== 0 && hours !== 0) str += ', ';

  if (hours !== 0) {
    const idx = calculateEndOfWordIdxByNumber(hours);

    str += minified ? `${hours}${t('hours_char')}` : `${hours} ${t(`hours.${idx}`)}`;
  }

  if ((days !== 0 || hours !== 0) && minutes !== 0) str += ', ';

  if (minutes !== 0) {
    const idx = calculateEndOfWordIdxByNumber(minutes);

    str += minified
      ? `${minutes}${t('minute_char')}`
      : `${minutes} ${minified ? t('minute_char') : t(`minutes.${idx}`)}`;
  }

  return str;
};

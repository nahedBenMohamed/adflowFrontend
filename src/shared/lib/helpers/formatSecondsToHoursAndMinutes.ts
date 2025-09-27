import { type TFunction } from 'i18next';

export const formatSecondsToHoursAndMinutes = ({
  seconds,
  t,
}: {
  seconds: number;
  t: TFunction;
}) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${formattedHours}${t('hour')} ${formattedMinutes}${t('minute')}`;
};

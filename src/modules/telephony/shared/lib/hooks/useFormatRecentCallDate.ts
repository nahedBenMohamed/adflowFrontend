import { UtcDate } from '@/shared';
import { useTranslation } from 'react-i18next';

export const useFormatRecentCallDate = (date: UtcDate): string => {
  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal.outgoing_call_initializer',
  });

  const currentDate = UtcDate.now();

  if (currentDate.diffDays(date) <= 1) {
    return t('today');
  }

  if (currentDate.diffDays(date) <= 2) {
    return t('yesterday');
  }

  if (currentDate.diffDays(date) <= 7) {
    return date.format('dddd');
  }

  return date.displayShort();
};

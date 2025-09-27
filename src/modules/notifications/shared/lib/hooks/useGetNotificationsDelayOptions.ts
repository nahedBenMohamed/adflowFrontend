import type { Nullable, Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// value in seconds or null
export const useGetNotificationsDelayOptions = (): Option<Nullable<number>>[] => {
  const { t } = useTranslation('module.notifications', {
    keyPrefix: 'notifications.components.delay_select',
  });

  return useMemo(
    () => [
      {
        label: t('no_delay'),
        value: null,
      },
      {
        label: t('5_minutes'),
        value: 300,
      },
      {
        label: t('10_minutes'),
        value: 600,
      },
      {
        label: t('15_minutes'),
        value: 900,
      },
      {
        label: t('30_minutes'),
        value: 1800,
      },
      {
        label: t('1_hour'),
        value: 3600,
      },
    ],
    [t]
  );
};

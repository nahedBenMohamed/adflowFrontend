import type { Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useGetDeferStartOptions = (): Option<number>[] => {
  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.defer_start_select',
  });

  return useMemo<Option<number>[]>(
    () => [
      {
        label: t('options.in_an_hour'),
        value: 60 * 60,
      },
      {
        label: t('options.in_a_day'),
        value: 24 * 60 * 60,
      },
      {
        label: t('options.in_3_days'),
        value: 3 * 24 * 60 * 60,
      },
    ],
    [t]
  );
};

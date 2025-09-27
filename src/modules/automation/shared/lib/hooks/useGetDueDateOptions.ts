import type { Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeadlineType } from '../models';

export const useGetDueDateOptions = (): Option<DeadlineType>[] => {
  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.due_date_select',
  });

  return useMemo<Option<DeadlineType>[]>(
    () => [
      {
        label: t('options.during_this_week'),
        value: DeadlineType.IN_A_WEEK,
      },
      {
        label: t('options.in_3_days'),
        value: DeadlineType.IN_THREE_DAYS,
      },
      {
        label: t('options.in_a_day'),
        value: DeadlineType.IN_ONE_DAY,
      },
      {
        label: t('options.end_of_the_day'),
        value: DeadlineType.END_OF_THE_DAY,
      },
      {
        label: t('options.at_the_time_of_creation'),
        value: DeadlineType.IMMEDIATELY,
      },
    ],
    [t]
  );
};

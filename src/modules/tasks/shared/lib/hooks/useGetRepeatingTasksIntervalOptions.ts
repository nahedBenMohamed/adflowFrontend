import type { Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RepeatingTaskInterval } from '../types';

export const useGetRepeatingTasksIntervalOptions = () => {
  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.add_task_modal.repeating_task.intervals',
  });

  return useMemo<Option<RepeatingTaskInterval>[]>(
    () => [
      {
        label: t('none'),
        value: RepeatingTaskInterval.NONE,
      },
      {
        label: t('day'),
        value: RepeatingTaskInterval.DAY,
      },
      {
        label: t('week'),
        value: RepeatingTaskInterval.WEEK,
      },
      {
        label: t('month'),
        value: RepeatingTaskInterval.MONTH,
      },
    ],
    [t]
  );
};

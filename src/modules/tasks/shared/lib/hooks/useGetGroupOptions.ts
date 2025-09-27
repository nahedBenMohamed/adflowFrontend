import type { Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DeadlineType } from '../models';

export const useGetGroupOptions = (): Option<DeadlineType>[] => {
  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.tasks_page_by_deadline',
  });

  return useMemo(
    () =>
      Object.values(DeadlineType).map(dt => ({
        label: t(dt),
        value: dt,
      })),
    [t]
  );
};

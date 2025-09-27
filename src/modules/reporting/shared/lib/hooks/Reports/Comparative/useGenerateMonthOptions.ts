import { MonthUtil, type Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useGenerateMonthOptions = (): Option<number>[] => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.hooks.use_get_comparative_report_columns',
  });

  return useMemo(
    () =>
      MonthUtil.months.map((m, idx) => ({
        value: idx,
        label: t(`months.${m.toLowerCase()}`),
      })),
    [t]
  );
};

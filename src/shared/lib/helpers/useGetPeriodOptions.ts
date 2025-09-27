import { useTranslation } from 'react-i18next';
import { DatePeriodFilterType, type Option } from '../models';

export const useGetPeriodOptions = (withQuarters?: boolean): Option<DatePeriodFilterType>[] => {
  const { t } = useTranslation('common', {
    keyPrefix: 'period_types',
  });

  const options: Option<DatePeriodFilterType>[] = [
    { value: DatePeriodFilterType.ALL, label: t('all_time') },
    {
      value: DatePeriodFilterType.TODAY,
      label: t('today'),
    },
    {
      value: DatePeriodFilterType.YESTERDAY,
      label: t('yesterday'),
    },
    {
      value: DatePeriodFilterType.CURRENT_WEEK,
      label: t('current_week'),
    },
    {
      value: DatePeriodFilterType.LAST_WEEK,
      label: t('last_week'),
    },
    {
      value: DatePeriodFilterType.CURRENT_MONTH,
      label: t('current_month'),
    },
    {
      value: DatePeriodFilterType.LAST_MONTH,
      label: t('last_month'),
    },
  ];

  const optionsWithQuarters: Option<DatePeriodFilterType>[] = [
    ...options,
    {
      value: DatePeriodFilterType.CURRENT_QUARTER,
      label: t('current_quarter'),
    },
    {
      value: DatePeriodFilterType.LAST_QUARTER,
      label: t('last_quarter'),
    },
  ];

  return withQuarters ? optionsWithQuarters : options;
};

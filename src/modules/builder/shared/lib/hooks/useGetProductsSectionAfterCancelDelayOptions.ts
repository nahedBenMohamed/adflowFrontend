import { ConvertTimeUtil, type Nullable, type Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// value in seconds or null
export const useGetProductsSectionAfterCancelDelayOptions = (): Option<
  Nullable<number>,
  { minifiedLabel: string }
>[] => {
  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.products_section_builder_page.delay_select',
  });

  return useMemo(
    () => [
      {
        label: t('no_return'),
        value: null,
        extra: {
          minifiedLabel: t('no_return_minified'),
        },
      },
      {
        label: t('24_hours'),
        value: ConvertTimeUtil.getSecondsInDays(1),
        extra: {
          minifiedLabel: t('24_hours_minified'),
        },
      },
      {
        label: t('48_hours'),
        value: ConvertTimeUtil.getSecondsInDays(2),
        extra: {
          minifiedLabel: t('48_hours_minified'),
        },
      },
      {
        label: t('72_hours'),
        value: ConvertTimeUtil.getSecondsInDays(3),
        extra: {
          minifiedLabel: t('72_hours_minified'),
        },
      },
      {
        label: t('7_days'),
        value: ConvertTimeUtil.getSecondsInDays(7),
        extra: {
          minifiedLabel: t('7_days_minified'),
        },
      },
      {
        label: t('10_days'),
        value: ConvertTimeUtil.getSecondsInDays(10),
        extra: {
          minifiedLabel: t('10_days_minified'),
        },
      },
      {
        label: t('14_days'),
        value: ConvertTimeUtil.getSecondsInDays(14),
        extra: {
          minifiedLabel: t('14_days_minified'),
        },
      },
      {
        label: t('28_days'),
        value: ConvertTimeUtil.getSecondsInDays(28),
        extra: {
          minifiedLabel: t('28_days_minified'),
        },
      },
      {
        label: t('30_days'),
        value: ConvertTimeUtil.getSecondsInDays(30),
        extra: {
          minifiedLabel: t('30_days_minified'),
        },
      },
    ],
    [t]
  );
};

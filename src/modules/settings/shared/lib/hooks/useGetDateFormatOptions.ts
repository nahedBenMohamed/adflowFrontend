import { DateFormat, type Nullable, type Option, UtcDate } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useGetDateFormatOptions = (): Option<Nullable<DateFormat>>[] => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.general_settings_page',
  });

  return useMemo(
    () => [
      {
        value: null,
        label: t('auto'),
      },
      ...Object.values(DateFormat).map(dateFormat => ({
        value: dateFormat,
        label: UtcDate.now().format(dateFormat),
      })),
    ],
    [t]
  );
};

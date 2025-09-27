import type { Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ExtendedCallDirections } from '../../../models';

export const useGenerateDirectionOptions = (): Option<ExtendedCallDirections>[] => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.templates.calls_report_template.directions',
  });

  return useMemo(
    () =>
      Object.values(ExtendedCallDirections).map(s => ({
        label: t(s),
        value: s,
      })),
    [t]
  );
};

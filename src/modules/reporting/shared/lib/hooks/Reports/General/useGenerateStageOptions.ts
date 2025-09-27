import type { Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportStageType } from '../../../models';

export const useGenerateStageOptions = (
  excludeOption?: ReportStageType
): Option<ReportStageType>[] => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.templates.general_report_template.stages',
  });

  return useMemo(() => {
    const options = Object.values(ReportStageType).map(s => ({
      label: t(s),
      value: s,
    }));

    return excludeOption ? options.filter(o => o.value !== excludeOption) : options;
  }, [excludeOption, t]);
};

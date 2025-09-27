import type { GeneralReportType } from '../../../shared';

export const generateGeneralReportSettingsObjStorageKey = ({
  entityTypeId,
  reportType,
}: {
  entityTypeId: number;
  reportType: GeneralReportType;
}): string => `GeneralReportSettings_${entityTypeId}_${reportType}`;

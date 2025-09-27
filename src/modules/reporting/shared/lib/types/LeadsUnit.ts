import type { EntitySummaryReport } from '../../../api';
import type { AnalyticsColors, AnalyticsIconsNames } from '../models';

export interface LeadsUnit {
  color: AnalyticsColors;
  icon: AnalyticsIconsNames;
  type: keyof EntitySummaryReport;
  title: () => string;
}

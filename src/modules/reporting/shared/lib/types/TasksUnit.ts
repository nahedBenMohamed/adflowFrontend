import type { TasksSummaryReport } from '../../../api';
import type { AnalyticsColors, AnalyticsIconsNames } from '../models';

export interface TasksUnit {
  type: keyof TasksSummaryReport;
  color: AnalyticsColors;
  icon: AnalyticsIconsNames;
  title: () => string;
}

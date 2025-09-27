import { AnalyticsColors, AnalyticsIconsNames, type ChartType } from '../models';
import type { TasksUnit } from '../types';

export const generateActivitiesUnits = (chartType: ChartType): TasksUnit[] => [
  {
    type: 'total',
    title: () => 'total_activities',
    color: AnalyticsColors.VIOLET,
    icon: AnalyticsIconsNames.TOTAL_TASKS,
  },
  {
    type: 'noTask',
    title: () => {
      switch (chartType) {
        case 'orders':
        case 'candidates':
          return 'cards_no_activities';
        case 'sales':
        default:
          return 'no_activities';
      }
    },
    color: AnalyticsColors.BLUE,
    icon: AnalyticsIconsNames.NO_TASKS,
  },
  {
    type: 'completed',
    title: () => 'completed_activities',
    color: AnalyticsColors.GREEN,
    icon: AnalyticsIconsNames.COMPLETED_TASKS,
  },
  {
    type: 'expired',
    title: () => 'expired_activities',
    color: AnalyticsColors.RED,
    icon: AnalyticsIconsNames.EXPIRED_TASKS,
  },
];

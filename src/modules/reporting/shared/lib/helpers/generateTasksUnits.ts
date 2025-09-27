import { AnalyticsColors, AnalyticsIconsNames, type ChartType } from '../models';
import type { TasksUnit } from '../types';

export const generateTasksUnits = (chartType: ChartType): TasksUnit[] => [
  {
    type: 'total',
    title: () => 'total_tasks',
    color: AnalyticsColors.VIOLET,
    icon: AnalyticsIconsNames.TOTAL_TASKS,
  },
  {
    type: 'noTask',
    title: () => {
      switch (chartType) {
        case 'orders':
        case 'candidates':
          return 'cards_no_tasks';
        case 'sales':
        default:
          return 'no_tasks';
      }
    },
    color: AnalyticsColors.BLUE,
    icon: AnalyticsIconsNames.NO_TASKS,
  },
  {
    type: 'completed',
    title: () => 'completed_tasks',
    color: AnalyticsColors.GREEN,
    icon: AnalyticsIconsNames.COMPLETED_TASKS,
  },
  {
    type: 'expired',
    title: () => 'expired_tasks',
    color: AnalyticsColors.RED,
    icon: AnalyticsIconsNames.EXPIRED_TASKS,
  },
];

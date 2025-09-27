import { AnalyticsColors, AnalyticsIconsNames, type ChartType } from '../models';
import type { LeadsUnit } from '../types';

export const generateEntitiesUnits = (chartType: ChartType): LeadsUnit[] => [
  {
    type: 'total',
    title: () => {
      switch (chartType) {
        case 'candidates':
          return 'total_candidates';
        case 'orders':
          return 'total_orders';
        case 'sales':
        default:
          return 'total_leads';
      }
    },
    color: AnalyticsColors.VIOLET,
    icon: AnalyticsIconsNames.TOTAL_ENTITIES,
  },
  {
    type: 'new',
    title: () => {
      switch (chartType) {
        case 'candidates':
          return 'new_candidates';
        case 'orders':
          return 'new_orders';
        case 'sales':
        default:
          return 'new_leads';
      }
    },
    color: AnalyticsColors.BLUE,
    icon: AnalyticsIconsNames.NEW_ENTITIES,
  },
  {
    type: 'win',
    title: () => {
      switch (chartType) {
        case 'candidates':
          return 'hired_candidates';
        case 'orders':
          return 'completed_orders';
        case 'sales':
        default:
          return 'won_leads';
      }
    },
    color: AnalyticsColors.GREEN,
    icon: AnalyticsIconsNames.WON_ENTITIES,
  },
  {
    type: 'lost',
    title: () => {
      switch (chartType) {
        case 'candidates':
          return 'rejected_candidates';
        case 'orders':
          return 'failed_orders';
        case 'sales':
        default:
          return 'lost_leads';
      }
    },
    color: AnalyticsColors.RED,
    icon: AnalyticsIconsNames.LOST_ENTITIES,
  },
];

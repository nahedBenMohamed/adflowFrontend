import { getDHMSFromSeconds, type Nullable, type Optional } from '@/shared';
import {
  AnalyticsColors,
  AnalyticsIconsNames,
  AnalyticsValueType,
  type PipelineReport,
  type SalesAnalyticsUnit,
} from '../models';

const getAverageTermValue = (value?: Nullable<number>): Optional<number> => {
  if (typeof value !== 'number') return;

  const { days } = getDHMSFromSeconds(value);

  return days;
};

export const generateSalesAnalytics = (pipelineReport?: PipelineReport): SalesAnalyticsUnit[] => {
  const conversionValue =
    pipelineReport?.conversionToSale && pipelineReport?.conversionToSale * 100;

  const averageTermValue = getAverageTermValue(pipelineReport?.averageTerm);

  return [
    {
      type: 'totalSales',
      title: 'total_sales',
      valueType: AnalyticsValueType.AMOUNT,
      value: pipelineReport?.totalSales,
      color: AnalyticsColors.VIOLET,
      icon: AnalyticsIconsNames.TOTAL_SALES,
    },
    {
      type: 'conversion',
      title: 'conversion',
      valueType: AnalyticsValueType.PERCENT,
      value: conversionValue,
      color: AnalyticsColors.BLUE,
      icon: AnalyticsIconsNames.CONVERSION,
    },
    {
      type: 'averageAmount',
      title: 'average_amount',
      valueType: AnalyticsValueType.AMOUNT,
      value: pipelineReport?.averageAmount,
      color: AnalyticsColors.GREEN,
      icon: AnalyticsIconsNames.AVERAGE_AMOUNT,
    },
    {
      type: 'averageTerm',
      title: 'average_term',
      valueType: AnalyticsValueType.DAYS,
      value: averageTermValue,
      color: AnalyticsColors.RED,
      icon: AnalyticsIconsNames.AVERAGE_TERM,
    },
  ];
};

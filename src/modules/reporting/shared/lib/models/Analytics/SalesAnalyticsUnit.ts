import type { Nullable } from '@/shared';
import type { AnalyticsColors } from './AnalyticsColors';
import type { AnalyticsIconsNames } from './AnalyticsIconsNames';
import type { AnalyticsValueType } from './AnalyticsValueType';
import type { SalesPipelineAnalyticsModel } from './SalesPipelineAnalyticsModel';

export interface SalesAnalyticsUnit {
  type: keyof SalesPipelineAnalyticsModel;
  title: string;
  valueType: AnalyticsValueType;
  color: AnalyticsColors;
  icon: AnalyticsIconsNames;
  value?: Nullable<number>;
}

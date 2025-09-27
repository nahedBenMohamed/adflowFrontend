import type { ComparativeReportType } from './Comparative/ComparativeReportType';
import type { CustomerReportType } from './Customer/CustomerReportType';
import type { GeneralReportType } from './General/GeneralReportType';
import type { ProductsReportType } from './Products/General/ProductsReportType';
import type { ProjectReportType } from './Projects/ProjectReportType';
import type { ScheduleReportType } from './Schedule/ScheduleReportType';
import type { CallHistoryReportType } from './Telephony/CallHistoryReportType';
import type { TelephonyReportType } from './Telephony/TelephonyReportType';

export type PossibleReportType =
  | GeneralReportType
  | ComparativeReportType
  | TelephonyReportType
  | CallHistoryReportType
  | ProjectReportType
  | ScheduleReportType
  | CustomerReportType
  | ProductsReportType;

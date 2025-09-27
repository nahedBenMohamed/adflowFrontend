import type { ComparativeReportFilterDto } from './Comparative/ComparativeReportFilterDto';
import type { CustomerReportFilterDto } from './Customer/CustomerReportFilterDto';
import type { GeneralReportFilterDto } from './General/GeneralReportFilterDto';
import type { CallHistoryReportFilterDto } from './Telephony/CallHistoryReportFilterDto';
import type { TelephonyReportFilterDto } from './Telephony/TelephonyReportFilterDto';

export type PossibleReportFilterDto =
  | GeneralReportFilterDto
  | ComparativeReportFilterDto
  | TelephonyReportFilterDto
  | CallHistoryReportFilterDto
  | CustomerReportFilterDto;

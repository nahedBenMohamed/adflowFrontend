import type { Nullable } from '@/shared';
import type { CallReportBlockDto } from './CallReportBlockDto';
import type { GeneralReportEntityDto } from './GeneralReportEntityDto';
import type { GeneralReportFieldDto } from './GeneralReportFieldDto';
import type { GeneralReportTaskDto } from './GeneralReportTaskDto';

export class GeneralReportRowDto {
  ownerId: number;
  entity: Nullable<GeneralReportEntityDto>;
  task: Nullable<GeneralReportTaskDto>;
  activity: Nullable<GeneralReportTaskDto>;
  fields: Nullable<GeneralReportFieldDto[]>;
  call: Nullable<CallReportBlockDto>;
}

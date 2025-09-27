import type { Nullable } from '@/shared';
import type { GeneralReportFilterVisibilityCallDto } from './GeneralReportFilterVisibilityCallDto';
import type { GeneralReportFilterVisibilityEntityDto } from './GeneralReportFilterVisibilityEntityDto';
import type { GeneralReportFilterVisibilityFieldsDto } from './GeneralReportFilterVisibilityFieldsDto';
import type { GeneralReportFilterVisibilityTaskDto } from './GeneralReportFilterVisibilityTaskDto';

export class GeneralReportFilterVisibilityDto {
  entity?: Nullable<GeneralReportFilterVisibilityEntityDto>;
  task?: Nullable<GeneralReportFilterVisibilityTaskDto>;
  activity?: Nullable<GeneralReportFilterVisibilityTaskDto>;
  fields?: Nullable<GeneralReportFilterVisibilityFieldsDto>;
  call?: Nullable<GeneralReportFilterVisibilityCallDto>;

  constructor({ entity, task, activity, fields, call }: GeneralReportFilterVisibilityDto) {
    this.entity = entity;
    this.task = task;
    this.activity = activity;
    this.fields = fields;
    this.call = call;
  }
}

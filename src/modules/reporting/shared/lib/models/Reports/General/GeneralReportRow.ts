import type { Nullable } from '@/shared';
import type { GeneralReportRowDto } from '../../../../../api';
import { CallReportBlock } from '../CallReportBlock';
import { GeneralReportEntity } from './GeneralReportEntity';
import { GeneralReportField } from './GeneralReportField';
import { GeneralReportTask } from './GeneralReportTask';

export class GeneralReportRow {
  ownerId: number;
  entity: Nullable<GeneralReportEntity>;
  task: Nullable<GeneralReportTask>;
  activity: Nullable<GeneralReportTask>;
  fields: Nullable<GeneralReportField[]>;
  call: Nullable<CallReportBlock>;

  constructor({ ownerId, entity, task, activity, fields, call }: GeneralReportRow) {
    this.ownerId = ownerId;
    this.entity = entity;
    this.task = task;
    this.activity = activity;
    this.fields = fields;
    this.call = call;
  }

  static fromDto(dto: GeneralReportRowDto): GeneralReportRow {
    return new GeneralReportRow({
      ownerId: dto.ownerId,
      entity: GeneralReportEntity.fromDto(dto.entity),
      task: GeneralReportTask.fromDto(dto.task),
      activity: GeneralReportTask.fromDto(dto.activity),
      fields: GeneralReportField.fromDtos(dto.fields),
      call: CallReportBlock.fromDto(dto.call),
    });
  }

  static fromDtos(dtos: GeneralReportRowDto[]): GeneralReportRow[] {
    return dtos.map(this.fromDto);
  }
}

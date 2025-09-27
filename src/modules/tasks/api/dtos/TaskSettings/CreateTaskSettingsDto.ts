import type { Nullable } from '@/shared';
import type { TaskFieldCode, TaskSettingsType } from '../../../shared';

export class CreateTaskSettingsDto {
  type: TaskSettingsType;
  recordId: Nullable<number>;
  activeFields: TaskFieldCode[];

  constructor({ type, recordId, activeFields }: CreateTaskSettingsDto) {
    this.type = type;
    this.recordId = recordId;
    this.activeFields = activeFields;
  }
}

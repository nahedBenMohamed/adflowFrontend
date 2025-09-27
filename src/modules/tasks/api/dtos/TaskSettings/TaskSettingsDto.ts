import type { Nullable } from '@/shared';
import type { TaskFieldCode, TaskSettingsType } from '../../../shared';

export class TaskSettingsDto {
  id: number;
  activeFields: TaskFieldCode[];
  type: TaskSettingsType;
  recordId: Nullable<number>;

  constructor({ id, activeFields, type, recordId }: TaskSettingsDto) {
    this.id = id;
    this.activeFields = activeFields;
    this.type = type;
    this.recordId = recordId;
  }
}

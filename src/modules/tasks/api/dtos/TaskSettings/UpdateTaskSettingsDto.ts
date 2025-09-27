import type { TaskFieldCode } from '../../../shared';

export class UpdateTaskSettingsDto {
  activeFields: TaskFieldCode[];

  constructor(activeFields: TaskFieldCode[]) {
    this.activeFields = activeFields;
  }
}

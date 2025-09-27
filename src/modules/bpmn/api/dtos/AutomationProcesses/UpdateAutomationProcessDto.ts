import type { Nullable } from '@/shared';
import type { AutomationProcessType } from '../../../shared';

export class UpdateAutomationProcessDto {
  name?: string;
  isActive?: boolean;
  type?: AutomationProcessType;
  objectId?: Nullable<number>;
  bpmnFile?: Nullable<string>;

  constructor({ name, type, objectId, bpmnFile, isActive }: UpdateAutomationProcessDto) {
    this.name = name;
    this.type = type;
    this.isActive = isActive;
    this.objectId = objectId;
    this.bpmnFile = bpmnFile;
  }
}

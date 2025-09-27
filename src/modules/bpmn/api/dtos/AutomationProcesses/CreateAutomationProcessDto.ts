import type { Nullable } from '@/shared';
import type { AutomationProcessType } from '../../../shared';

export class CreateAutomationProcessDto {
  name: string;
  isActive: boolean;
  type: AutomationProcessType;
  objectId?: Nullable<number>;
  bpmnFile?: Nullable<string>;

  constructor({ name, isActive, type, objectId, bpmnFile }: CreateAutomationProcessDto) {
    this.name = name;
    this.isActive = isActive;
    this.type = type;
    this.objectId = objectId;
    this.bpmnFile = bpmnFile;
  }
}

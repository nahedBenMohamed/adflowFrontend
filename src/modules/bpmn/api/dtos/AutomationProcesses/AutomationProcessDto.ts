import type { Nullable } from '@/shared';
import type { AutomationProcessType } from '../../../shared';

export interface AutomationProcessDto {
  id: number;
  name: string;
  createdAt: string;
  createdBy: number;
  isActive: boolean;
  isReadonly: boolean;
  type: AutomationProcessType;
  objectId?: Nullable<number>;
  bpmnFile?: Nullable<string>;
}

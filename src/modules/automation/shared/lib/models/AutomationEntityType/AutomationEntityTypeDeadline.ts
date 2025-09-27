import type { Nullable } from '@/shared';
import type { DeadlineType } from './DeadlineType';

export class AutomationEntityTypeDeadline {
  type: DeadlineType;
  time: Nullable<number>;

  constructor({ type, time }: AutomationEntityTypeDeadline) {
    this.type = type;
    this.time = time;
  }
}

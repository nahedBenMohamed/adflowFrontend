import type { AutomationFieldCondition } from '@/modules/automation';
import type { Nullable } from '@/shared';

export interface AutomationEntityCondition {
  ownerIds?: number[];
  stageId?: Nullable<number>;
  fields?: AutomationFieldCondition[];
}

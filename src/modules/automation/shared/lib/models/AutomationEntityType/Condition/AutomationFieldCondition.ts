import type { PossibleFilter, SimpleFilterType } from '@/shared';

export interface AutomationFieldCondition {
  fieldId: number;
  type: SimpleFilterType;
  filter: PossibleFilter;
}

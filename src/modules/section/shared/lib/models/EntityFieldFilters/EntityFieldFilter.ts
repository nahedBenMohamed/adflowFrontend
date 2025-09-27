import type { PossibleFilter, SimpleFilterType } from '@/shared';

export interface EntityFieldFilter {
  fieldId: number;
  type: SimpleFilterType;
  filter: PossibleFilter;
}

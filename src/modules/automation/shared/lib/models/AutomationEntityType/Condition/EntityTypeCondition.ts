import type { AutomationFieldCondition } from './AutomationFieldCondition';

export interface EntityTypeCondition {
  ownerIds?: number[];
  fields?: AutomationFieldCondition[];
}

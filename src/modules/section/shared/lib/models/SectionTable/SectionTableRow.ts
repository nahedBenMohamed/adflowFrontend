import type { PossibleFieldValue } from '@/modules/fields';
import type { Nullable } from '@/shared';

export interface SectionTableRow {
  name: string;
  entityId: number;
  readonly: boolean;
  focused?: boolean;
  responsibleUserId: number;
  stageId: Nullable<number>;
  copiedFrom: Nullable<number>;
  copiedCount: Nullable<number>;
  fields: Record<string, Nullable<PossibleFieldValue>>;
}

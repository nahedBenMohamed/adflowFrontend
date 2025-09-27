import type { EntityTypeTrigger, Nullable } from '@/shared';
import type { EntityTypeAction, EntityTypeCondition } from '../../../shared';

export interface AutomationEntityTypeDto {
  id: number;
  name: string;
  createdAt: string;
  createdBy: number;
  isActive: boolean;
  entityTypeId: number;
  boardId?: Nullable<number>;
  stageId?: Nullable<number>;
  triggers: EntityTypeTrigger[];
  actions?: Nullable<EntityTypeAction[]>;
  conditions?: Nullable<EntityTypeCondition>;
}

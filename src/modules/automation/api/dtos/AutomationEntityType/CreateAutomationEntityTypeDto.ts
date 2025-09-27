import type { EntityTypeTrigger, Nullable } from '@/shared';
import type { EntityTypeAction, EntityTypeCondition } from '../../../shared';

export class CreateAutomationEntityTypeDto {
  name: string;
  isActive: boolean;
  entityTypeId: number;
  boardId?: Nullable<number>;
  stageId?: Nullable<number>;
  triggers: EntityTypeTrigger[];
  actions?: Nullable<EntityTypeAction[]>;
  conditions?: Nullable<EntityTypeCondition>;
  applyImmediately?: boolean;

  constructor({
    name,
    isActive,
    entityTypeId,
    boardId,
    stageId,
    triggers,
    actions,
    conditions,
    applyImmediately,
  }: CreateAutomationEntityTypeDto) {
    this.name = name;
    this.isActive = isActive;
    this.entityTypeId = entityTypeId;
    this.boardId = boardId;
    this.stageId = stageId;
    this.triggers = triggers;
    this.actions = actions;
    this.conditions = conditions;
    this.applyImmediately = applyImmediately;
  }
}

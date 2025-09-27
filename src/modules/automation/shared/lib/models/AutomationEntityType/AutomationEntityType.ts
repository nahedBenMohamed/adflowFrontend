import { type EntityTypeTrigger, type Nullable, UtcDate } from '@/shared';
import type { AutomationEntityTypeDto } from '../../../../api';
import type { EntityTypeCondition } from './Condition/EntityTypeCondition';
import type { EntityTypeAction } from './EntityTypeAction';

export class AutomationEntityType {
  id: number;
  name: string;
  createdAt: UtcDate;
  createdBy: number;
  isActive: boolean;
  entityTypeId: number;
  boardId?: Nullable<number>;
  stageId?: Nullable<number>;
  triggers: EntityTypeTrigger[];
  actions?: Nullable<EntityTypeAction[]>;
  conditions?: Nullable<EntityTypeCondition>;

  constructor({
    id,
    name,
    createdAt,
    createdBy,
    isActive,
    entityTypeId,
    boardId,
    stageId,
    triggers,
    actions,
    conditions,
  }: {
    id: number;
    name: string;
    createdAt: UtcDate;
    createdBy: number;
    isActive: boolean;
    entityTypeId: number;
    boardId?: Nullable<number>;
    stageId?: Nullable<number>;
    triggers: EntityTypeTrigger[];
    actions?: Nullable<EntityTypeAction[]>;
    conditions?: Nullable<EntityTypeCondition>;
  }) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.isActive = isActive;
    this.entityTypeId = entityTypeId;
    this.boardId = boardId;
    this.stageId = stageId;
    this.triggers = triggers;
    this.actions = actions;
    this.conditions = conditions;
  }

  static fromDto(dto: AutomationEntityTypeDto): AutomationEntityType {
    return new AutomationEntityType({
      id: dto.id,
      name: dto.name,
      createdAt: UtcDate.parseISO(dto.createdAt),
      createdBy: dto.createdBy,
      isActive: dto.isActive,
      entityTypeId: dto.entityTypeId,
      boardId: dto.boardId,
      stageId: dto.stageId,
      triggers: dto.triggers,
      actions: dto.actions,
      conditions: dto.conditions,
    });
  }

  static fromDtos(dtos: AutomationEntityTypeDto[]): AutomationEntityType[] {
    return dtos.map(this.fromDto);
  }

  get firstAction(): EntityTypeAction {
    const firstAction = this.actions?.[0];

    if (!firstAction)
      throw new Error(
        `Automation ${this.name} with id ${this.id} has no actions, failed to get first action`
      );

    return firstAction;
  }

  get firstTrigger(): EntityTypeTrigger {
    const firstTrigger = this.triggers?.[0];

    if (!firstTrigger)
      throw new Error(
        `Automation ${this.name} with id ${this.id} has no triggers, failed to get first trigger`
      );

    return firstTrigger;
  }
}

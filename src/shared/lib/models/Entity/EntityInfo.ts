import type { Nullable } from '../../types';
import type { Entity } from './Entity';

export class EntityInfo {
  id: number;
  name: string;
  entityTypeId: number;
  ownerId: number;
  stageId: Nullable<number>;
  boardId: Nullable<number>;
  hasAccess: boolean;
  copiedCount?: Nullable<number>;
  copiedFrom?: Nullable<number>;
  focused?: boolean;

  constructor({
    id,
    name,
    entityTypeId,
    ownerId,
    stageId,
    boardId,
    hasAccess,
    copiedCount,
    copiedFrom,
    focused,
  }: EntityInfo) {
    this.id = id;
    this.name = name;
    this.entityTypeId = entityTypeId;
    this.ownerId = ownerId;
    this.stageId = stageId;
    this.boardId = boardId;
    this.hasAccess = hasAccess;
    this.copiedCount = copiedCount;
    this.copiedFrom = copiedFrom;
    this.focused = focused;
  }

  static fromEntity({ entity, hasAccess }: { entity: Entity; hasAccess?: boolean }): EntityInfo {
    return new EntityInfo({
      id: entity.id,
      name: entity.name,
      boardId: entity.boardId,
      ownerId: entity.responsibleUserId,
      stageId: entity.stageId,
      hasAccess: hasAccess ?? false,
      entityTypeId: entity.entityTypeId,
    });
  }
}

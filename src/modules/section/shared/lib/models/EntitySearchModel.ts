import type { Nullable } from '@/shared';

export class EntitySearchModel {
  id: number;
  name: string;
  focused?: boolean;
  entityTypeId: number;
  stageId: Nullable<number>;
  boardId: Nullable<number>;
  copiedCount?: Nullable<number>;
  copiedFrom?: Nullable<number>;

  constructor({
    id,
    name,
    entityTypeId,
    stageId,
    boardId,
    copiedCount,
    copiedFrom,
    focused,
  }: EntitySearchModel) {
    this.id = id;
    this.name = name;
    this.entityTypeId = entityTypeId;
    this.stageId = stageId;
    this.boardId = boardId;
    this.copiedCount = copiedCount;
    this.copiedFrom = copiedFrom;
    this.focused = focused;
  }
}

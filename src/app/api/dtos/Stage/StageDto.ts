import type { Nullable, ObjectState, StageCode } from '@/shared';

export class StageDto {
  id: number;
  name: string;
  color: string;
  boardId: number;
  isSystem: boolean;
  sortOrder: number;
  state: ObjectState;
  code: Nullable<StageCode>;

  constructor({ id, name, color, code, isSystem, sortOrder, boardId, state }: StageDto) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.color = color;
    this.state = state;
    this.boardId = boardId;
    this.isSystem = isSystem;
    this.sortOrder = sortOrder;
  }
}

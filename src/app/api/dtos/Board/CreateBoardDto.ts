import type { Nullable } from '@/shared';
import { BoardType } from '../../../../shared';

export class CreateBoardDto {
  name: string;
  // if not provided, will be calculated on backend
  sortOrder?: number;
  type: BoardType;
  recordId: Nullable<number>;

  constructor({ name, sortOrder, type, recordId }: CreateBoardDto) {
    this.name = name;
    this.sortOrder = sortOrder;
    this.type = type;
    this.recordId = recordId;
  }

  static forEntityType({
    name,
    sortOrder,
    entityTypeId,
  }: {
    name: string;
    sortOrder?: number;
    entityTypeId: number;
  }): CreateBoardDto {
    return new CreateBoardDto({
      name,
      sortOrder,
      type: BoardType.ENTITY_TYPE,
      recordId: entityTypeId,
    });
  }

  static forTasks({ name, sortOrder }: { name: string; sortOrder: number }): CreateBoardDto {
    return new CreateBoardDto({ name, sortOrder, type: BoardType.TASK, recordId: null });
  }
}

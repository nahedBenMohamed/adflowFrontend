import { type StageDto } from '@/app';
import { ObjectState } from '../../models';
import { type Nullable } from '../../types';
import { type StageCode } from './StageCode';

export class Stage {
  id: number;
  name: string;
  color: string;
  code: Nullable<StageCode>;
  isSystem: boolean;
  // 0, 1, 2 ..., N
  sortOrder: number;
  state: ObjectState;
  boardId: number;

  constructor({ id, name, color, code, isSystem, sortOrder, state, boardId }: Stage) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.code = code;
    this.isSystem = isSystem;
    this.sortOrder = sortOrder;
    this.state = state;
    this.boardId = boardId;
  }

  static createEmpty({
    name,
    boardId,
    sortOrder,
  }: {
    name: string;
    boardId: number;
    sortOrder: number;
  }): Stage {
    return new Stage({
      id: -1,
      boardId,
      name,
      sortOrder,
      code: null,
      isSystem: false,
      state: ObjectState.CREATED,
      color: 'var(--graphite-graphite-200)',
    });
  }

  static fromDto(dto: StageDto): Stage {
    return new Stage({
      id: dto.id,
      name: dto.name,
      code: dto.code,
      state: dto.state,
      color: dto.color,
      boardId: dto.boardId,
      isSystem: dto.isSystem,
      sortOrder: dto.sortOrder,
    });
  }

  static fromDtos(dtos: StageDto[]): Stage[] {
    return dtos.map(this.fromDto);
  }
}

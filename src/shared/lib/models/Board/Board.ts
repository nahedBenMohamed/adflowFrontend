import { type BoardDto } from '@/app';
import { type Nullable } from '../../types';
import { type UserRights } from '../Permission/UserRights';
import { type BoardType } from './BoardType';

export class Board {
  id: number;
  name: string;
  type: BoardType;
  recordId: Nullable<number>;
  isSystem: boolean;
  ownerId: Nullable<number>;
  participantIds: Nullable<number[]>;
  sortOrder: number;
  taskBoardId: Nullable<number>;
  userRights: UserRights;

  constructor({
    id,
    name,
    type,
    recordId,
    isSystem,
    ownerId,
    participantIds,
    sortOrder,
    taskBoardId,
    userRights,
  }: Board) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.recordId = recordId;
    this.isSystem = isSystem;
    this.ownerId = ownerId;
    this.participantIds = participantIds;
    this.sortOrder = sortOrder;
    this.taskBoardId = taskBoardId;
    this.userRights = userRights;
  }

  static fromDto(dto: BoardDto): Board {
    return new Board({
      id: dto.id,
      name: dto.name,
      type: dto.type,
      recordId: dto.recordId,
      isSystem: dto.isSystem,
      ownerId: dto.ownerId,
      participantIds: dto.participantIds,
      sortOrder: dto.sortOrder,
      taskBoardId: dto.taskBoardId,
      userRights: dto.userRights,
    });
  }

  static fromDtos(dtos: BoardDto[]): Board[] {
    return dtos.map(this.fromDto);
  }
}

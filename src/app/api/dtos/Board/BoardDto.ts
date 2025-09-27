import { type Nullable } from '@/shared';
import { type BoardType } from '../../../../shared/lib/models/Board/BoardType';
import { type UserRights } from '../../../../shared/lib/models/Permission/UserRights';

export interface BoardDto {
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
}

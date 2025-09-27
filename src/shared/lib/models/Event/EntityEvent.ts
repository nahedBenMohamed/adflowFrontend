import { type Nullable } from '../../types';

export class EntityEvent {
  accountId: number;
  entityId: number;
  entityTypeId: number;
  boardId: Nullable<number>;
}

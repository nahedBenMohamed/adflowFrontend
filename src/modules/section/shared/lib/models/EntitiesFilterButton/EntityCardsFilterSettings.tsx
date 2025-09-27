import type { Nullable } from '@/shared';
import type { EntityBoardCardFilter } from '../EntityFilter/EntityBoardCardFilter';

export interface EntityCardsFilterSettings {
  entityTypeId: number;
  boardId: Nullable<number>;
  filter: EntityBoardCardFilter;
  justMyCards: boolean;
  saveFilterSettings: boolean;
}

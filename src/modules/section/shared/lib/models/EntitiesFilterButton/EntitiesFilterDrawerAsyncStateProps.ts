import type { EntityBoardCardFilter } from '../EntityFilter/EntityBoardCardFilter';

export interface EntitiesFilterDrawerAsyncStateProps {
  filterClearing: boolean;
  hasError: boolean;
  applyFilter: (filter: EntityBoardCardFilter) => void;
  clearFilter: () => void;
}

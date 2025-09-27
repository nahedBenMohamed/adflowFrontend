import type { Nullable } from '@/shared';
import type { ColumnSizingState, VisibilityState } from '@tanstack/react-table';

export interface TasksTableSettings {
  boardId: number;
  entityId: Nullable<number>;
  columnSizes: ColumnSizingState;
  columnVisibility: VisibilityState;
}

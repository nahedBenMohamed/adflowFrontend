import type { Nullable } from '@/shared';
import type { ColumnOrderState } from '@tanstack/react-table';

export interface EtTableSettings {
  entityTypeId: number;
  boardId: Nullable<number>;
  columnOrder: ColumnOrderState;
  columnSizes: Record<string, number>;
  columnVisibility: Record<string, boolean>;
  updatedAt: Nullable<string>;
}

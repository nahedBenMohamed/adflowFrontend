import type { ColumnSizingState, VisibilityState } from '@tanstack/react-table';

export interface ProductTableSettings {
  sectionId: number;
  columnSizes: ColumnSizingState;
  columnVisibility: VisibilityState;
}

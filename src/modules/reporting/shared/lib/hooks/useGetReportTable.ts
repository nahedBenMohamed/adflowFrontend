import type { Optional } from '@/shared';
import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type ColumnDef,
  type ExpandedState,
  type OnChangeFn,
  type Table,
  type VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';

export const useGetReportTable = <R extends { subRows?: Optional<R[]> }>({
  columns,
  data,
  columnVisibility,
  setColumnVisibility,
}: {
  columns: ColumnDef<R, unknown>[];
  data: R[];
  columnVisibility: VisibilityState;
  setColumnVisibility: OnChangeFn<VisibilityState>;
}): Table<R> => {
  const [expanded, setExpanded] = useState<ExpandedState>(true);

  return useReactTable<R>({
    data,
    columns,
    state: {
      expanded,
      columnVisibility,
    },
    getSubRows: r => r.subRows,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });
};

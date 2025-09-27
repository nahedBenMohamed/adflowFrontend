import { BaseTable } from '@/shared';
import type { Cell, Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { WarehouseColumnsIds, type ProductRow } from '../../../../../../../../shared';

interface Props {
  warehouseTable: Table<ProductRow>;
  showingPreviousData: boolean;
}

const WarehouseTable = (props: Props) => {
  const { warehouseTable, showingPreviousData } = props;

  return (
    <BaseTable
      table={warehouseTable}
      tableLoading={showingPreviousData}
      headProps={{
        getCellStyleFn: (header: Header<ProductRow, unknown>): CSSProperties => {
          if (header.column.id === WarehouseColumnsIds.NAME) return { flex: 1 };

          return { width: header.column.getSize() };
        },
      }}
      bodyProps={{
        getCellStyleFn: (cell: Cell<ProductRow, unknown>): CSSProperties => {
          if (cell.column.id === WarehouseColumnsIds.NAME) return { flex: 1 };

          return { width: cell.column.getSize() };
        },
      }}
    />
  );
};

export { WarehouseTable };

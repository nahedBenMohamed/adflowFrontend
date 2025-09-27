import { BaseTable } from '@/shared';
import type { Cell, Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { RentalWarehouseColumnsIds, type RentalProductRow } from '../../../../../../../../shared';

interface Props {
  rentalWarehouseTable: Table<RentalProductRow>;
  showingPreviousData: boolean;
}

const RentalWarehouseTable = (props: Props) => {
  const { rentalWarehouseTable, showingPreviousData } = props;

  return (
    <BaseTable
      table={rentalWarehouseTable}
      tableLoading={showingPreviousData}
      headProps={{
        getCellStyleFn: (header: Header<RentalProductRow, unknown>): CSSProperties => {
          if (header.column.id === RentalWarehouseColumnsIds.NAME) return { flex: 1 };

          return { width: header.column.getSize() };
        },
      }}
      bodyProps={{
        getCellStyleFn: (cell: Cell<RentalProductRow, unknown>): CSSProperties => {
          if (cell.column.id === RentalWarehouseColumnsIds.NAME) return { flex: 1 };

          return { width: cell.column.getSize() };
        },
      }}
    />
  );
};

export { RentalWarehouseTable };

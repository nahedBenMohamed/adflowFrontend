import { BaseTable } from '@/shared';
import type { Cell, Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { CreateStocksColumnsIds, type CreateStockRow } from '../../../../../../shared';

interface Props {
  createStocksTable: Table<CreateStockRow>;
}

const CreateStocksTable = (props: Props) => {
  const { createStocksTable } = props;

  return (
    <BaseTable
      table={createStocksTable}
      headProps={{
        getCellStyleFn: (header: Header<CreateStockRow, unknown>): CSSProperties => {
          if (header.column.id === CreateStocksColumnsIds.WAREHOUSE_NAME) return { flex: 1 };

          return { width: header.column.getSize() };
        },
      }}
      bodyProps={{
        getCellStyleFn: (cell: Cell<CreateStockRow, unknown>): CSSProperties => {
          if (cell.column.id === CreateStocksColumnsIds.WAREHOUSE_NAME) return { flex: 1 };

          return { width: cell.column.getSize() };
        },
      }}
    />
  );
};

export { CreateStocksTable };

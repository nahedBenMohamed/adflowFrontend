import { BaseTable, TableSkeleton } from '@/shared';
import type { Cell, Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { ProductStocksColumnsIds, type ProductStockRow } from '../../../../shared';

interface Props {
  loading: boolean;
  disabled: boolean;
  productStocksTable: Table<ProductStockRow>;
}

const ProductStocksTable = (props: Props) => {
  const { loading, disabled, productStocksTable } = props;

  return loading ? (
    <TableSkeleton small />
  ) : (
    <BaseTable
      disabled={disabled}
      table={productStocksTable}
      headProps={{
        getCellStyleFn: (header: Header<ProductStockRow, unknown>): CSSProperties => {
          if (header.column.id === ProductStocksColumnsIds.NAME) return { flex: 1 };

          return { width: header.column.getSize() };
        },
      }}
      bodyProps={{
        getCellStyleFn: (cell: Cell<ProductStockRow, unknown>): CSSProperties => {
          if (cell.column.id === ProductStocksColumnsIds.NAME) return { flex: 1 };

          return { width: cell.column.getSize() };
        },
      }}
    />
  );
};

export { ProductStocksTable };

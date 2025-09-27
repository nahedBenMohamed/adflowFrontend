import { BaseTable } from '@/shared';
import type { Cell, Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { RentalCardOrderColumnsIds, type RentalOrderItemRow } from '../../../../../../../../shared';

interface Props {
  loading: boolean;
  disabled: boolean;
  rentalCardOrderTable: Table<RentalOrderItemRow>;
}

const RentalCardProductsOrderTable = (props: Props) => {
  const { loading, disabled, rentalCardOrderTable } = props;

  return (
    <BaseTable
      disabled={disabled}
      tableLoading={loading}
      table={rentalCardOrderTable}
      headProps={{
        getCellStyleFn: (header: Header<RentalOrderItemRow, unknown>): CSSProperties => {
          if (header.column.id === RentalCardOrderColumnsIds.NAME) return { flex: 1 };

          return { width: header.column.getSize() };
        },
      }}
      bodyProps={{
        getCellStyleFn: (cell: Cell<RentalOrderItemRow, unknown>): CSSProperties => {
          if (cell.column.id === RentalCardOrderColumnsIds.NAME) return { flex: 1 };

          return { width: cell.column.getSize() };
        },
      }}
    />
  );
};

export { RentalCardProductsOrderTable };

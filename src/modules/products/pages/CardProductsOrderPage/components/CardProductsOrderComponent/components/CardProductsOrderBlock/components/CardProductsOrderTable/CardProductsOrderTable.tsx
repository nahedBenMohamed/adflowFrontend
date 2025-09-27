import { BaseTable } from '@/shared';
import type { Cell, Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { CardOrderColumnsIds, type OrderItemRow } from '../../../../../../../../shared';

interface Props {
  disabled: boolean;
  cardOrderTable: Table<OrderItemRow>;
}

const CardProductsOrderTable = (props: Props) => {
  const { disabled, cardOrderTable } = props;

  return (
    <BaseTable
      disabled={disabled}
      table={cardOrderTable}
      headProps={{
        getCellStyleFn: (header: Header<OrderItemRow, unknown>): CSSProperties => {
          if (header.column.id === CardOrderColumnsIds.NAME) return { flex: 1 };

          return { width: header.column.getSize() };
        },
      }}
      bodyProps={{
        getCellStyleFn: (cell: Cell<OrderItemRow, unknown>): CSSProperties => {
          if (cell.column.id === CardOrderColumnsIds.NAME) return { flex: 1 };

          return { width: cell.column.getSize() };
        },
      }}
    />
  );
};

export { CardProductsOrderTable };

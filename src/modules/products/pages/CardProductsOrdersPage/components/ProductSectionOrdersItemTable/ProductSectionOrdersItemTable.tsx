import { BaseTable } from '@/shared';
import type { Cell, Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { ProductsSectionOrdersCommonColumnsIds, type Order } from '../../../../shared';

interface Props {
  productsSectionOrdersTable: Table<Order>;
}

const ProductSectionOrdersItemTable = (props: Props) => {
  const { productsSectionOrdersTable } = props;

  return (
    <BaseTable
      table={productsSectionOrdersTable}
      headProps={{
        headRowProps: {
          $backgroundColor: 'var(--graphite-graphite-20)',
        },
        getCellStyleFn: (header: Header<Order, unknown>): CSSProperties => {
          if (header.column.id === ProductsSectionOrdersCommonColumnsIds.NAME) return { flex: 1 };

          return { width: header.column.getSize() };
        },
      }}
      bodyProps={{
        bodyRowProps: {
          $filled: true,
        },
        getCellStyleFn: (cell: Cell<Order, unknown>): CSSProperties => {
          if (cell.column.id === ProductsSectionOrdersCommonColumnsIds.NAME) return { flex: 1 };

          return { width: cell.column.getSize() };
        },
      }}
    />
  );
};

export { ProductSectionOrdersItemTable };

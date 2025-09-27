import { BaseTable } from '@/shared';
import type { Cell, Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { ProductsSectionOrdersCommonColumnsIds, type RentalOrder } from '../../../../shared';

interface Props {
  productsSectionOrdersTable: Table<RentalOrder>;
}

const RentalProductSectionOrdersItemTable = (props: Props) => {
  const { productsSectionOrdersTable } = props;

  return (
    <BaseTable
      table={productsSectionOrdersTable}
      headProps={{
        headRowProps: {
          $backgroundColor: 'var(--graphite-graphite-20)',
        },
        getCellStyleFn: (header: Header<RentalOrder, unknown>): CSSProperties => {
          if (header.column.id === ProductsSectionOrdersCommonColumnsIds.NAME) return { flex: 1 };

          return { width: header.column.getSize() };
        },
      }}
      bodyProps={{
        bodyRowProps: {
          $filled: true,
        },
        getCellStyleFn: (cell: Cell<RentalOrder, unknown>): CSSProperties => {
          if (cell.column.id === ProductsSectionOrdersCommonColumnsIds.NAME) return { flex: 1 };

          return { width: cell.column.getSize() };
        },
      }}
    />
  );
};

export { RentalProductSectionOrdersItemTable };

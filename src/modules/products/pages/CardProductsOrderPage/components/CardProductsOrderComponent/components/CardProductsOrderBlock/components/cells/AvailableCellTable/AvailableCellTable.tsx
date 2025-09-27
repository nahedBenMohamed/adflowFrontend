import { BaseTable } from '@/shared';
import type { Cell, Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import type { Stock } from '../../../../../../../../../shared';

interface Props {
  availableCellTable: Table<Stock>;
}

const AvailableCellTable = (props: Props) => {
  const { availableCellTable } = props;

  return (
    <BaseTable
      table={availableCellTable}
      headProps={{
        getCellStyleFn: (header: Header<Stock, unknown>): CSSProperties => ({
          width: header.column.getSize(),
        }),
      }}
      bodyProps={{
        getCellStyleFn: (cell: Cell<Stock, unknown>): CSSProperties => ({
          width: cell.column.getSize(),
        }),
      }}
    />
  );
};

export { AvailableCellTable };

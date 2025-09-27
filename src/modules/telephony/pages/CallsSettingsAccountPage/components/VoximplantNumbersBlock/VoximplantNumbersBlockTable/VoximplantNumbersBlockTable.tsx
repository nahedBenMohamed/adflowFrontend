import { BaseTable } from '@/shared';
import type { Cell, Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { VoximplantNumberRowsColumnsIds, type VoximplantNumberRow } from '../../../../../shared';

interface Props {
  loading: boolean;
  numbersBlockTable: Table<VoximplantNumberRow>;
}

const VoximplantNumbersBlockTable = (props: Props) => {
  const { loading, numbersBlockTable } = props;

  return (
    <BaseTable
      tableLoading={loading}
      table={numbersBlockTable}
      headProps={{
        headRowProps: {
          $backgroundColor: 'var(--graphite-graphite-20)',
        },
        getCellStyleFn: (header: Header<VoximplantNumberRow, unknown>): CSSProperties => {
          if (
            header.column.id === VoximplantNumberRowsColumnsIds.PHONE_NUMBER ||
            header.column.id === VoximplantNumberRowsColumnsIds.REGION
          )
            return { flex: 1 };

          return { width: header.column.getSize() };
        },
      }}
      bodyProps={{
        bodyRowProps: {
          $filled: true,
        },
        getCellStyleFn: (cell: Cell<VoximplantNumberRow, unknown>): CSSProperties => {
          if (
            cell.column.id === VoximplantNumberRowsColumnsIds.PHONE_NUMBER ||
            cell.column.id === VoximplantNumberRowsColumnsIds.REGION
          )
            return { flex: 1 };

          return { width: cell.column.getSize() };
        },
      }}
    />
  );
};

export { VoximplantNumbersBlockTable };

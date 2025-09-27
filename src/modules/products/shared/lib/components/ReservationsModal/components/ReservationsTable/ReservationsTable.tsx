import { BaseTable } from '@/shared';
import type { Cell, Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import { ReservationsColumnsIds, type ReservationRow } from '../../../../models';

interface Props {
  reservationsTable: Table<ReservationRow>;
}

const ReservationsTable = (props: Props) => {
  const { reservationsTable } = props;

  return (
    <BaseTable
      table={reservationsTable}
      headProps={{
        getCellStyleFn: (header: Header<ReservationRow, unknown>): CSSProperties => {
          if (header.column.id === ReservationsColumnsIds.NAME) return { flex: 1 };

          return { width: header.column.getSize() };
        },
      }}
      bodyProps={{
        getCellStyleFn: (cell: Cell<ReservationRow, unknown>): CSSProperties => {
          if (cell.column.id === ReservationsColumnsIds.NAME) return { flex: 1 };

          return { width: cell.column.getSize() };
        },
      }}
    />
  );
};

export { ReservationsTable };

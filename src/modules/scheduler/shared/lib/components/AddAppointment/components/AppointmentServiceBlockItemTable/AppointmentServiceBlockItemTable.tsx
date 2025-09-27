import { BaseTable, type BaseTableBodyRowProps, type BaseTableHeadRowProps } from '@/shared';
import type { Cell, Header, Table } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import {
  AppointmentServiceBlockColumnsIds,
  type ScheduleAppointmentOrderItemRow,
} from '../../../../models';

interface Props {
  appointmentServiceBlockItemTable: Table<ScheduleAppointmentOrderItemRow>;
}

const commonRowsProps = {
  $paddingLeft: 0,
  $paddingRight: 0,
} satisfies BaseTableHeadRowProps | BaseTableBodyRowProps;

const AppointmentServiceBlockItemTable = (props: Props) => {
  const { appointmentServiceBlockItemTable } = props;

  return (
    <BaseTable
      table={appointmentServiceBlockItemTable}
      headProps={{
        headRowProps: commonRowsProps,
        getCellStyleFn: (
          header: Header<ScheduleAppointmentOrderItemRow, unknown>
        ): CSSProperties => {
          if (header.column.id === AppointmentServiceBlockColumnsIds.PRICE) return { flex: 1 };

          return { width: header.column.getSize() };
        },
      }}
      bodyProps={{
        bodyRowProps: commonRowsProps,
        getCellStyleFn: (cell: Cell<ScheduleAppointmentOrderItemRow, unknown>): CSSProperties => {
          if (cell.column.id === AppointmentServiceBlockColumnsIds.PRICE) return { flex: 1 };

          return { width: cell.column.getSize() };
        },
      }}
    />
  );
};

export { AppointmentServiceBlockItemTable };

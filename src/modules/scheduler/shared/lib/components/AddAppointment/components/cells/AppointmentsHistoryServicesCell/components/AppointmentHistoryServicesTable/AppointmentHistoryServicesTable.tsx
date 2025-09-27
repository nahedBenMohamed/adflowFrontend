import { type OrderItem } from '@/modules/products';
import { BaseTable, DropdownScrollbarMixin, type Currency } from '@/shared';
import { getCoreRowModel, useReactTable, type Cell, type Header } from '@tanstack/react-table';
import type { CSSProperties } from 'react';
import styled from 'styled-components';
import { useAppointmentHistoryServicesColumns } from '../../../../../../../hooks';
import { AppointmentHistoryServicesColumnsIds } from '../../../../../../../models';

const Root = styled.div`
  max-height: 440px;

  ${DropdownScrollbarMixin}

  padding: 8px;
`;

interface Props {
  currency: Currency;
  orderItems: OrderItem[];
}

const AppointmentHistoryServicesTable = (props: Props) => {
  const { orderItems, currency } = props;

  const defaultColumns = useAppointmentHistoryServicesColumns(currency);

  const servicesTable = useReactTable<OrderItem>({
    data: orderItems,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Root>
      <BaseTable
        table={servicesTable}
        headProps={{
          getCellStyleFn: (header: Header<OrderItem, unknown>): CSSProperties => {
            if (header.column.id === AppointmentHistoryServicesColumnsIds.NAME) return { flex: 1 };

            return { width: header.column.getSize() };
          },
        }}
        bodyProps={{
          getCellStyleFn: (cell: Cell<OrderItem, unknown>): CSSProperties => {
            if (cell.column.id === AppointmentHistoryServicesColumnsIds.NAME) return { flex: 1 };

            return { width: cell.column.getSize() };
          },
        }}
      />
    </Root>
  );
};

export { AppointmentHistoryServicesTable };

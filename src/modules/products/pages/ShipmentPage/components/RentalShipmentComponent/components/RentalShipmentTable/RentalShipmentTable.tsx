import { BaseTable, TableSkeleton, type BaseTableHeadRowProps } from '@/shared';
import type { Cell, Header, Table } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import type { CSSProperties } from 'react';
import { ShipmentColumnsIds, type RentalShipmentItemRow } from '../../../../../../shared';

interface Props {
  isLoaded: boolean;
  shipmentTable: Table<RentalShipmentItemRow>;
}

const commonHeadRowProps = {
  $backgroundColor: 'var(--graphite-graphite-20)',
} satisfies BaseTableHeadRowProps;

const RentalShipmentTable = observer((props: Props) => {
  const { isLoaded, shipmentTable } = props;

  return isLoaded ? (
    <BaseTable
      table={shipmentTable}
      headProps={{
        headRowProps: {
          ...commonHeadRowProps,
          $withSidePlugs: true,
          $paddingTop: '12px',
          $top: 'calc(var(--header-height) * 2)',
        },
        getCellStyleFn: (header: Header<RentalShipmentItemRow, unknown>): CSSProperties => {
          if (header.column.id === ShipmentColumnsIds.NAME) return { flex: 1 };

          return { width: header.column.getSize() };
        },
      }}
      bodyProps={{
        bodyRowProps: {
          $filled: true,
        },
        getCellStyleFn: (cell: Cell<RentalShipmentItemRow, unknown>): CSSProperties => {
          if (cell.column.id === ShipmentColumnsIds.NAME) return { flex: 1 };

          return { width: cell.column.getSize() };
        },
      }}
    />
  ) : (
    <TableSkeleton headRowProps={commonHeadRowProps} />
  );
});

RentalShipmentTable.displayName = 'RentalShipmentTable';
export { RentalShipmentTable };

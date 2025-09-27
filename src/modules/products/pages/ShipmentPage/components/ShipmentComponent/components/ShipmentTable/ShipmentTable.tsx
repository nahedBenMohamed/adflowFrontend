import { BaseTable, TableSkeleton, type BaseTableHeadRowProps } from '@/shared';
import { getCoreRowModel, useReactTable, type Cell, type Header } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import type { CSSProperties } from 'react';
import {
  ShipmentColumnsIds,
  useShipmentColumns,
  type ShipmentItemRow,
} from '../../../../../../shared';
import { type ShipmentStore } from '../../../../../../store';

interface Props {
  shipmentStore: ShipmentStore;
  currentPageDecodeUrl: string;
}

const commonHeadRowProps = {
  $backgroundColor: 'var(--graphite-graphite-20)',
} satisfies BaseTableHeadRowProps;

const ShipmentTable = observer((props: Props) => {
  const { shipmentStore, currentPageDecodeUrl } = props;

  const { isLoaded, shipmentItemRows } = shipmentStore;

  const defaultColumns = useShipmentColumns({ shipmentStore, currentPageDecodeUrl });

  const shipmentTable = useReactTable<ShipmentItemRow>({
    data: shipmentItemRows,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  });

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
        getCellStyleFn: (header: Header<ShipmentItemRow, unknown>): CSSProperties => {
          if (header.column.id === ShipmentColumnsIds.NAME) return { flex: 1 };

          return { width: header.column.getSize() };
        },
      }}
      bodyProps={{
        bodyRowProps: {
          $filled: true,
        },
        getCellStyleFn: (cell: Cell<ShipmentItemRow, unknown>): CSSProperties => {
          if (cell.column.id === ShipmentColumnsIds.NAME) return { flex: 1 };

          return { width: cell.column.getSize() };
        },
      }}
    />
  ) : (
    <TableSkeleton headRowProps={commonHeadRowProps} />
  );
});

export { ShipmentTable };

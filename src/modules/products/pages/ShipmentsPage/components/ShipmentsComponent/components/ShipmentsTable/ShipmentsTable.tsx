import { SettingsStore } from '@/app';
import {
  BaseTable,
  EmptyTableBlock,
  TableSkeleton,
  type BaseTableHeadRowProps,
  type ToggleControl,
} from '@/shared';
import { getCoreRowModel, useReactTable, type Cell, type Header } from '@tanstack/react-table';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useChangeShipmentStatus } from '../../../../../../api';
import {
  ShipmentRow,
  SHIPMENTS_TABLE_SETTINGS_KEY,
  ShipmentsColumnsIds,
  useShipmentsColumns,
  type GetShipmentsResult,
  type ShipmentsTablesSettings,
} from '../../../../../../shared';
import type { WarehouseStore } from '../../../../../../store';
import { ProductsTableSettingsDrawer } from '../../../../../ProductsPage/components';
import { ShipmentsTablePagination } from '../ShipmentsTablePagination/ShipmentsTablePagination';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding-bottom: 16px;
`;

interface Props {
  canEdit: boolean;
  sectionId: number;
  loading: boolean;
  currentPage: number;
  warehouseStore: WarehouseStore;
  showingPreviousData: boolean;
  tableSettingsControl: ToggleControl;
  shipmentsResult?: GetShipmentsResult;
  handleChangePage: (page: number) => void;
}

const { settings: settingsFromLS } = SettingsStore.getSettingsStore<ShipmentsTablesSettings>(
  SHIPMENTS_TABLE_SETTINGS_KEY
);

if (!settingsFromLS.tables) settingsFromLS.tables = [];

const ShipmentsTable = observer((props: Props) => {
  const {
    canEdit,
    sectionId,
    loading,
    currentPage,
    warehouseStore,
    showingPreviousData,
    tableSettingsControl,
    shipmentsResult,
    handleChangePage,
  } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.shipments_page.ui.shipments_table',
  });

  const tableSettingsFromLS = settingsFromLS.tables.find(t => t.sectionId === sectionId);

  const { mutate: changeShipmentStatus } = useChangeShipmentStatus({
    sectionId,
    page: currentPage,
  });

  const columns = useShipmentsColumns({ warehouseStore, canEdit, changeShipmentStatus });

  const [shipmentRows, setShipmentRows] = useState<ShipmentRow[]>([]);

  const getSavedColumnVisibility = useCallback((): Record<string, boolean> => {
    if (!tableSettingsFromLS) return {};

    return tableSettingsFromLS.columnVisibility;
  }, [tableSettingsFromLS]);

  const [columnVisibility, setColumnVisibility] = useState(() => getSavedColumnVisibility());

  const { isLoaded: isWarehouseStoreLoaded } = warehouseStore;

  useLayoutEffect(() => {
    if (!shipmentsResult || !isWarehouseStoreLoaded) return;

    const shipmentRows: ShipmentRow[] = [];

    shipmentsResult.shipments.forEach(s => {
      shipmentRows.push(new ShipmentRow(s));
    });

    setShipmentRows(shipmentRows);
  }, [shipmentsResult, isWarehouseStoreLoaded]);

  const shipmentsTable = useReactTable<ShipmentRow>({
    columns,
    data: shipmentRows,
    state: {
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  });

  const commonHeadRowProps: BaseTableHeadRowProps = {
    $withSidePlugs: true,
    $top: 'var(--header-with-subheader-height)',
    $backgroundColor: 'var(--graphite-graphite-20)',
  };

  useEffect(() => {
    if (!tableSettingsFromLS) {
      settingsFromLS.tables.push({
        sectionId: sectionId,
        columnVisibility: {},
      });
    }
  }, [sectionId, tableSettingsFromLS]);

  useEffect(() => {
    const saveColumnVisibility = (columnVisibility: Record<string, boolean>) => {
      settingsFromLS.tables = settingsFromLS.tables.map(t => {
        if (t.sectionId === sectionId) {
          t.columnVisibility = columnVisibility;
        }

        return t;
      });
    };

    saveColumnVisibility(columnVisibility);
  }, [columnVisibility, sectionId]);

  if (loading) return <TableSkeleton headRowProps={commonHeadRowProps} />;

  const allColumnsHidden = shipmentsTable.getAllLeafColumns().every(c => !c.getIsVisible());

  return (
    <Root>
      <ProductsTableSettingsDrawer
        table={shipmentsTable}
        opened={tableSettingsControl.active}
        hide={tableSettingsControl.close}
      />

      {shipmentsResult && shipmentRows.length > 0 ? (
        allColumnsHidden ? (
          <EmptyTableBlock $height="400px">{t('all_columns_hidden')}</EmptyTableBlock>
        ) : (
          <>
            <BaseTable
              tableLoading={showingPreviousData}
              table={shipmentsTable}
              headProps={{
                headRowProps: {
                  $withSidePlugs: true,
                  ...commonHeadRowProps,
                },
                getCellStyleFn: (header: Header<ShipmentRow, unknown>): CSSProperties => {
                  if (header.column.id === ShipmentsColumnsIds.NAME) return { flex: 1 };

                  return { width: header.column.getSize() };
                },
              }}
              bodyProps={{
                bodyRowProps: {
                  $filled: true,
                },
                getCellStyleFn: (cell: Cell<ShipmentRow, unknown>): CSSProperties => {
                  if (cell.column.id === ShipmentsColumnsIds.NAME) return { flex: 1 };

                  return { width: cell.column.getSize() };
                },
              }}
            />

            <ShipmentsTablePagination
              currentPage={currentPage}
              totalCount={shipmentsResult.meta.total}
              handleChange={handleChangePage}
            />
          </>
        )
      ) : (
        <EmptyTableBlock $height="400px">{t('empty')}</EmptyTableBlock>
      )}
    </Root>
  );
});

ShipmentsTable.displayName = 'ShipmentsTable';
export { ShipmentsTable };

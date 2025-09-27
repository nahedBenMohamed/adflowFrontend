import { SettingsStore, appStore } from '@/app';
import { EmptyTableBlock, WholePageLoaderWithLogo, type ToggleControl } from '@/shared';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RentalOrderFilter, useSearchRentalOrders } from '../../../../api';
import { RentalProductSectionOrdersItemTable } from '../../../../pages';
import {
  RentalOrderStatus,
  SHIPMENTS_TABLE_SETTINGS_KEY,
  useRentalProductsSectionOrdersColumns,
  type RentalOrder,
  type ShipmentsTablesSettings,
} from '../../../../shared';
import { ProductsTableSettingsDrawer } from '../../../ProductsPage/components';

interface Props {
  sectionId: number;
  tableSettingsControl: ToggleControl;
}

const displayStatuses: RentalOrderStatus[] = [
  RentalOrderStatus.RESERVED,
  RentalOrderStatus.SENT_TO_WAREHOUSE,
  RentalOrderStatus.SHIPPED,
  RentalOrderStatus.DELIVERED,
];

const { settings: settingsFromLS } = SettingsStore.getSettingsStore<ShipmentsTablesSettings>(
  SHIPMENTS_TABLE_SETTINGS_KEY
);

if (!settingsFromLS.tables) settingsFromLS.tables = [];

const RentalShipmentsComponent = observer((props: Props) => {
  const { sectionId, tableSettingsControl } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.pages.shipments_page.ui.shipments_table',
  });

  const tableSettingsFromLS = settingsFromLS.tables.find(t => t.sectionId === sectionId);

  const {
    isPending,
    data: productOrders,
    mutate: searchRentalOrders,
  } = useSearchRentalOrders(sectionId);

  const ordersLoaded = !isPending;

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        const filter = new RentalOrderFilter({ entityId: null, statuses: displayStatuses });

        searchRentalOrders(filter);
      }
    );
  }, [searchRentalOrders]);

  const columns = useRentalProductsSectionOrdersColumns({ sectionId, type: 'shipment' });

  const getSavedColumnVisibility = useCallback((): Record<string, boolean> => {
    if (!tableSettingsFromLS) return {};

    return tableSettingsFromLS.columnVisibility;
  }, [tableSettingsFromLS]);

  const [columnVisibility, setColumnVisibility] = useState(() => getSavedColumnVisibility());

  const productsSectionOrdersTable = useReactTable<RentalOrder>({
    columns: columns,
    data: productOrders ?? [],
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

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

  const allColumnsHidden = productsSectionOrdersTable
    .getAllLeafColumns()
    .every(c => !c.getIsVisible());

  return (
    <>
      <ProductsTableSettingsDrawer
        table={productsSectionOrdersTable}
        opened={tableSettingsControl.active}
        hide={tableSettingsControl.close}
      />

      {ordersLoaded && productOrders ? (
        productOrders.length > 0 ? (
          allColumnsHidden ? (
            <EmptyTableBlock $height="400px">{t('all_columns_hidden')}</EmptyTableBlock>
          ) : (
            <RentalProductSectionOrdersItemTable
              productsSectionOrdersTable={productsSectionOrdersTable}
            />
          )
        ) : (
          <EmptyTableBlock $height="400px">{t('empty')}</EmptyTableBlock>
        )
      ) : (
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      )}
    </>
  );
});

RentalShipmentsComponent.displayName = 'RentalShipmentsComponent';
export { RentalShipmentsComponent };

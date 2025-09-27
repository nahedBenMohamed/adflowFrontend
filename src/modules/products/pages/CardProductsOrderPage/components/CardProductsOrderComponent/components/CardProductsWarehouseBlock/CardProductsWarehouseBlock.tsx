import { validateForm, type Nullable } from '@/shared';
import { getCoreRowModel, useReactTable, type RowSelectionState } from '@tanstack/react-table';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useState } from 'react';
import { productApi } from '../../../../../../api';
import {
  ProductRow,
  WarehouseColumnsIds,
  useWarehouseColumns,
  type GetProductsMeta,
  type ProductWarehouseBlockTemplateHeaderProps,
} from '../../../../../../shared';
import type { OrderStore, ProductCategoryStore, WarehouseStore } from '../../../../../../store';
import { ProductsWarehouseBlockTemplate } from '../../../../../../templates';
import { WarehouseTable } from './components';

interface Props {
  canCreateOrder: boolean;
  currentPage: number;
  orderStore: OrderStore;
  productCategoryStore: ProductCategoryStore;
  warehouseStore: WarehouseStore;
  productsLoading: boolean;
  headerProps: ProductWarehouseBlockTemplateHeaderProps;
  showingPreviousData: boolean;
  filterWarehouseId: Nullable<number>;
  productsResultMeta?: GetProductsMeta;
  handleChangePage: (page: number) => void;
  initializeProductRows?: () => void;
}

const CardProductsWarehouseBlock = observer((props: Props) => {
  const {
    canCreateOrder,
    currentPage,
    orderStore,
    productCategoryStore,
    warehouseStore,
    productsLoading,
    headerProps,
    showingPreviousData,
    filterWarehouseId,
    productsResultMeta,
    handleChangePage,
    initializeProductRows,
  } = props;

  const { productRows, productsSection, warehousesEnabled, addOrderItemRows } = orderStore;
  const { accessibleWarehouses } = warehouseStore;

  const columns = useWarehouseColumns({
    orderStore,
    canCreateOrder,
    warehouseStore,
    filterWarehouseId,
    productCategoryStore,
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState({});

  const warehouseTable = useReactTable<ProductRow>({
    columns,
    data: productRows,
    enableRowSelection: true,
    state: {
      rowSelection,
      columnVisibility,
    },
    getRowId: row => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
  });

  useLayoutEffect(() => {
    when(
      () => !warehousesEnabled,
      () => {
        warehouseTable.getAllColumns().forEach(c => {
          if (c.id === WarehouseColumnsIds.AVAILABLE && c.getIsVisible()) c.toggleVisibility();
        });
      }
    );
  }, [warehousesEnabled, warehouseTable]);

  const [adding, setAdding] = useState(false);

  const selectedIds = Object.keys(rowSelection)
    .filter(k => rowSelection[k])
    .map(Number);

  const handleAdd = useCallback(async (): Promise<void> => {
    try {
      setAdding(true);

      const selectedProductRowsOnPage = productRows.filter(r => selectedIds.includes(r.id));

      const selectedIdsOnOtherPages = selectedIds.filter(
        id => !selectedProductRowsOnPage.find(r => r.id === id)
      );

      let selectedProductRowsOnOtherPages: ProductRow[] = [];

      if (selectedIdsOnOtherPages.length) {
        const result = await productApi.getProductsByIds({
          sectionId: productsSection.id,
          ids: selectedIds.filter(id => !selectedProductRowsOnPage.find(r => r.id === id)),
        });

        selectedProductRowsOnOtherPages = ProductRow.createFromProducts(
          result.products,
          accessibleWarehouses,
          orderStore.getCurrentWarehouseId()
        );
      }

      addOrderItemRows({
        warehouses: accessibleWarehouses,
        productRows: [...selectedProductRowsOnPage, ...selectedProductRowsOnOtherPages].filter(p =>
          warehousesEnabled ? p.hasAvailable(orderStore.getCurrentWarehouseId()) : true
        ),
      });

      warehouseTable.resetRowSelection();
    } finally {
      setAdding(false);
    }
  }, [
    orderStore,
    selectedIds,
    productRows,
    warehouseTable,
    warehousesEnabled,
    productsSection.id,
    accessibleWarehouses,
    addOrderItemRows,
  ]);

  const handleReset = useCallback(() => {
    warehouseTable.resetRowSelection();

    initializeProductRows?.();
  }, [warehouseTable, initializeProductRows]);

  const nothingSelectedOrAdding = !selectedIds.length || adding;

  return (
    <ProductsWarehouseBlockTemplate
      adding={adding}
      headerProps={headerProps}
      currentPage={currentPage}
      rowsLength={productRows.length}
      warehousesEnabled={warehousesEnabled}
      productsLoading={productsLoading}
      productsResultMeta={productsResultMeta}
      addDisabled={
        nothingSelectedOrAdding ||
        (orderStore.getCurrentWarehouseId() ? !validateForm(productRows) : false)
      }
      Table={
        <WarehouseTable showingPreviousData={showingPreviousData} warehouseTable={warehouseTable} />
      }
      handleAdd={handleAdd}
      handleReset={handleReset}
      handleChangePage={handleChangePage}
      initializeProductRows={initializeProductRows}
    />
  );
});

CardProductsWarehouseBlock.displayName = 'CardProductsWarehouseBlock';
export { CardProductsWarehouseBlock };

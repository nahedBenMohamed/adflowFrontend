import { validateForm, type SelectModel, type UtcDatesRangeValue } from '@/shared';
import { UuidUtil, type Nullable } from '@/shared/lib';
import { getCoreRowModel, useReactTable, type RowSelectionState } from '@tanstack/react-table';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { productApi } from '../../../../../../api';
import {
  RentalProductRow,
  useRentalWarehouseColumns,
  type GetProductsMeta,
  type ProductWarehouseBlockTemplateHeaderProps,
} from '../../../../../../shared';
import type {
  ProductCategoryStore,
  RentalOrderStore,
  WarehouseStore,
} from '../../../../../../store';
import { ProductsWarehouseBlockTemplate } from '../../../../../../templates';
import { RentalWarehouseTable } from './components';

interface Props {
  currentPage: number;
  canCreateOrder: boolean;
  productsLoading: boolean;
  warehousesEnabled: boolean;
  orderStore: RentalOrderStore;
  showingPreviousData: boolean;
  warehouseStore: WarehouseStore;
  productsIntervalModel: SelectModel;
  filterWarehouseId: Nullable<number>;
  productCategoryStore: ProductCategoryStore;
  headerProps: ProductWarehouseBlockTemplateHeaderProps;
  productsResultMeta?: GetProductsMeta;
  handleChangePage: (page: number) => void;
  initializeProductRows?: () => void;
}

const CardRentalProductsWarehouseBlock = observer((props: Props) => {
  const {
    canCreateOrder,
    currentPage,
    orderStore,
    productCategoryStore,
    productsLoading,
    headerProps,
    showingPreviousData,
    productsIntervalModel,
    productsResultMeta,
    warehousesEnabled,
    handleChangePage,
    initializeProductRows,
  } = props;

  const { productRows, productsSection, addOrderItemRows } = orderStore;

  const handleAddOrderItemRows = useCallback(
    (productRows: RentalProductRow[]) => {
      addOrderItemRows(
        productRows,
        !orderStore.hasValidPeriods() && productsIntervalModel.value
          ? {
              id: UuidUtil.generate(),
              range: toJS(productsIntervalModel.value) as UtcDatesRangeValue,
            }
          : undefined
      );
    },
    [orderStore, productsIntervalModel.value, addOrderItemRows]
  );

  const columns = useRentalWarehouseColumns({
    productCategoryStore,
    canCreateOrder,
    orderStore,
    handleAddOrderItemRows,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const rentalWarehouseTable = useReactTable<RentalProductRow>({
    columns,
    data: productRows,
    enableRowSelection: true,
    state: {
      rowSelection,
    },
    getRowId: row => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
  });

  const [adding, setAdding] = useState(false);

  const selectedIds = Object.keys(rowSelection)
    .filter(k => rowSelection[k])
    .map(Number);

  const handleAdd = async (): Promise<void> => {
    try {
      setAdding(true);

      const selectedProductRowsOnPage = productRows.filter(r => selectedIds.includes(r.id));

      const selectedIdsOnOtherPages = selectedIds.filter(
        id => !selectedProductRowsOnPage.find(r => r.id === id)
      );

      let selectedProductRowsOnOtherPages: RentalProductRow[] = [];

      if (selectedIdsOnOtherPages.length) {
        const result = await productApi.getProductsByIds({
          sectionId: productsSection.id,
          ids: selectedIds.filter(id => !selectedProductRowsOnPage.find(r => r.id === id)),
        });

        selectedProductRowsOnOtherPages = RentalProductRow.createFromProducts(result.products);
      }

      handleAddOrderItemRows(
        [...selectedProductRowsOnPage, ...selectedProductRowsOnOtherPages].filter(
          r => !orderStore.wasProductRowAlreadyAdded(r.id)
        )
      );

      rentalWarehouseTable.resetRowSelection();
    } finally {
      setAdding(false);
    }
  };

  const handleReset = () => {
    rentalWarehouseTable.resetRowSelection();

    initializeProductRows?.();
  };

  const nothingSelectedOrAdding = !selectedIds.length || adding;

  return (
    <ProductsWarehouseBlockTemplate
      isRental
      adding={adding}
      currentPage={currentPage}
      headerProps={headerProps}
      rowsLength={productRows.length}
      productsLoading={productsLoading}
      warehousesEnabled={warehousesEnabled}
      productsResultMeta={productsResultMeta}
      addDisabled={
        nothingSelectedOrAdding ||
        (orderStore.getCurrentWarehouseId() ? !validateForm(productRows) : false)
      }
      Table={
        <RentalWarehouseTable
          showingPreviousData={showingPreviousData}
          rentalWarehouseTable={rentalWarehouseTable}
        />
      }
      handleAdd={handleAdd}
      handleReset={handleReset}
      handleChangePage={handleChangePage}
      initializeProductRows={initializeProductRows}
    />
  );
});

CardRentalProductsWarehouseBlock.displayName = 'CardRentalProductsWarehouseBlock';
export { CardRentalProductsWarehouseBlock };

import { SettingsStore } from '@/app';
import {
  EmptyTableBlock,
  MyDatePickerSelect,
  PermissionObjectType,
  SelectModel,
  UtcDate,
  WholePageLoaderWithLogo,
  useToggleControl,
  type ModalControl,
  type Nullable,
  type Optional,
  type ToggleControl,
  type User,
  type UtcDatesRangeValue,
} from '@/shared';
import {
  getCoreRowModel,
  useReactTable,
  type ColumnResizeMode,
  type RowSelectionState,
  type VisibilityState,
} from '@tanstack/react-table';
import { when } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useWindowSize } from 'usehooks-ts';
import { useGetProducts } from '../../api';
import type { ProductTablesSettings, ProductsSection } from '../../shared';
import {
  ProductsColumnsIds,
  getDefaultProductsColumnSize,
  useProductsColumns,
  type Product,
  type ProductCategoriesSelectProps,
  type ProductWarehousesSelectProps,
  type ProductsSectionType,
} from '../../shared';
import { AddProductModalStore, ProductCategoryStore, WarehouseStore } from '../../store';
import {
  AddProductModal,
  ProductsPageSecondaryHeader,
  ProductsTable,
  ProductsTableSettingsDrawer,
} from './components';

const Root = styled.div`
  padding-top: var(--header-height);
  transition: var(--transition-200);
`;

const { settings: settingsFromLS } =
  SettingsStore.getSettingsStore<ProductTablesSettings>('ProductsTable');

if (!settingsFromLS.tables) settingsFromLS.tables = [];

interface Props {
  sectionId: number;
  isRentals: boolean;
  currentPage: number;
  currentUser: Nullable<User>;
  sectionType: ProductsSectionType;
  addModalControl: ModalControl;
  addProductParam: Nullable<string>;
  productSkuParam: Nullable<string>;
  isProductsSectionLoading: boolean;
  tableSettingsControl: ToggleControl;
  productsSection: Optional<ProductsSection>;
  searchQuery?: Nullable<string>;
  setFirstPage: () => void;
  handleClearAllPresetParams: () => void;
  handleChangePage: (page: number) => void;
}

const Products = observer((props: Props) => {
  const {
    sectionId,
    isRentals,
    currentPage,
    currentUser,
    productsSection,
    sectionType,
    searchQuery,
    addModalControl,
    addProductParam,
    productSkuParam,
    tableSettingsControl,
    isProductsSectionLoading,
    setFirstPage,
    handleChangePage,
    handleClearAllPresetParams,
  } = props;

  const { t } = useTranslation('module.products', { keyPrefix: 'products.pages.products_page' });

  const tableSettingsFromLS = settingsFromLS.tables.find(t => t.sectionId === sectionId);

  const warehousesEnabled = Boolean(productsSection?.enableWarehouse);
  const barcodesEnabled = Boolean(productsSection?.enableBarcode);

  const productCategoryStore = useMemo(() => new ProductCategoryStore(sectionId), [sectionId]);
  const warehouseStore = useMemo(() => new WarehouseStore(sectionId), [sectionId]);

  const { isLoaded: areCategoriesLoaded, loadData: loadCategories } = productCategoryStore;
  const {
    isLoaded: areWarehousesLoaded,
    accessibleWarehouses,
    loadData: loadWarehouses,
  } = warehouseStore;

  useEffect(() => {
    loadCategories();
    loadWarehouses();
  }, [loadCategories, loadWarehouses]);

  const [addProductModalStoreKey, resetAddProductModalStore] = useReducer(x => ++x, 0);

  const addProductModalStore = useMemo(
    () =>
      new AddProductModalStore({
        sectionType,
        warehouses: accessibleWarehouses,
        preset: { sku: productSkuParam },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sectionType, accessibleWarehouses, productSkuParam, addProductModalStoreKey]
  );

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage]);

  useLayoutEffect(() => {
    if (addProductParam) addModalControl.open();
  }, [addProductParam, addModalControl]);

  const filterForm = useLocalObservable(() => ({
    warehouseId: SelectModel.create(),
    categoryId: SelectModel.create(),
  }));

  const productsIntervalControl = useToggleControl(false);
  const productsIntervalModel = useLocalObservable(() =>
    SelectModel.create([UtcDate.now().startOfDay(), UtcDate.now().endOfDay()] as UtcDatesRangeValue)
  );

  const {
    data: productsResult,
    isLoading: areProductsLoading,
    isPlaceholderData: showingPreviousData,
  } = useGetProducts({
    sectionId,
    page: currentPage,
    queryParams: {
      search: searchQuery,
      categoryId: filterForm.categoryId.value,
      warehouseId: filterForm.warehouseId.value,
      startDate: productsIntervalModel.value[0]
        ? (productsIntervalModel.value[0] as UtcDate).formatISOWithoutUnix()
        : undefined,
      endDate: productsIntervalModel.value[1]
        ? (productsIntervalModel.value[1] as UtcDate).formatISOWithoutUnix()
        : undefined,
    },
  });

  useEffect(() => {
    if (!tableSettingsFromLS) {
      settingsFromLS.tables.push({
        sectionId: sectionId,
        columnSizes: {},
        columnVisibility: {},
      });
    }
  }, [sectionId, tableSettingsFromLS]);

  const saveColumnSize = useCallback(
    ({ columnId, size }: { columnId: string; size: number }) => {
      settingsFromLS.tables = settingsFromLS.tables.map(t => {
        if (t.sectionId === sectionId) t.columnSizes = { ...t.columnSizes, [columnId]: size };

        return t;
      });
    },
    [sectionId]
  );

  const canViewProduct = Boolean(currentUser?.canView(PermissionObjectType.PRODUCTS, sectionId));
  const canEditProducts = Boolean(currentUser?.canEdit(PermissionObjectType.PRODUCTS, sectionId));

  const { width: windowWidth } = useWindowSize();

  const getSavedColumnSize = useCallback(
    (columnId: string): number => {
      let columnsCount = 5;

      if (isRentals) ++columnsCount;

      if (warehousesEnabled) ++columnsCount;

      const defaultColumnSize = getDefaultProductsColumnSize({
        windowWidth,
        columnsCount,
      });

      if (!tableSettingsFromLS) return defaultColumnSize;

      return tableSettingsFromLS.columnSizes[columnId] ?? defaultColumnSize;
    },
    [tableSettingsFromLS, windowWidth, isRentals, warehousesEnabled]
  );

  const columns = useProductsColumns({
    sectionType,
    warehouseStore,
    canViewProduct,
    canEditProducts,
    getSavedColumnSize,
  });

  const getSavedColumnVisibility = useCallback((): VisibilityState => {
    if (!tableSettingsFromLS) return {};

    return tableSettingsFromLS.columnVisibility;
  }, [tableSettingsFromLS]);

  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    getSavedColumnVisibility()
  );

  const productsTable = useReactTable<Product>({
    columns,
    columnResizeMode,
    enableRowSelection: true,
    data: productsResult ? productsResult.products : [],
    state: {
      rowSelection,
      columnVisibility,
    },
    getRowId: row => String(row.id),
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const hideStocksColumn = !warehousesEnabled || isRentals;

  useLayoutEffect(() => {
    when(
      () => !isProductsSectionLoading,
      () => {
        if (hideStocksColumn)
          productsTable.getAllColumns().forEach(c => {
            if (c.id === ProductsColumnsIds.STOCKS && c.getIsVisible()) c.toggleVisibility();
          });
      }
    );
  }, [hideStocksColumn, productsTable, productsSection, isProductsSectionLoading]);

  const productsLoaded = !areProductsLoading;
  const dataLoaded = productsLoaded && areCategoriesLoaded && areWarehousesLoaded;

  useEffect(() => {
    const saveColumnVisibility = (columnVisibility: VisibilityState) => {
      settingsFromLS.tables = settingsFromLS.tables.map(t => {
        if (t.sectionId === sectionId) t.columnVisibility = columnVisibility;

        return t;
      });
    };

    saveColumnVisibility(columnVisibility);
  }, [columnVisibility, sectionId]);

  const categorySelectProps = useMemo<ProductCategoriesSelectProps>(
    () => ({
      productCategoryStore,
      model: filterForm.categoryId,
      handleChange: setFirstPage,
    }),
    [filterForm.categoryId, productCategoryStore, setFirstPage]
  );

  const warehouseSelectProps = useMemo<Optional<ProductWarehousesSelectProps>>(
    () =>
      warehousesEnabled
        ? {
            warehouseStore,
            model: filterForm.warehouseId,
            handleChange: setFirstPage,
          }
        : undefined,
    [filterForm.warehouseId, warehousesEnabled, warehouseStore, setFirstPage]
  );

  const allColumnsHiddenExceptCheckbox = productsTable
    .getAllColumns()
    .filter(c => c.id !== ProductsColumnsIds.CHECKBOX)
    .every(c => !c.getIsVisible());

  return (
    <>
      <ProductsTableSettingsDrawer
        table={productsTable}
        opened={tableSettingsControl.active}
        hideIds={
          hideStocksColumn
            ? [ProductsColumnsIds.STOCKS, ProductsColumnsIds.CHECKBOX]
            : [ProductsColumnsIds.CHECKBOX]
        }
        hide={tableSettingsControl.close}
      />

      <Root>
        <ProductsPageSecondaryHeader
          visible={dataLoaded}
          categorySelectProps={categorySelectProps}
          warehouseSelectProps={warehouseSelectProps}
          ExtraControls={
            isRentals && (
              <MyDatePickerSelect
                clearable
                type="range"
                titleWidth="240px"
                model={productsIntervalModel}
                opened={productsIntervalControl.active}
                variant="outlined-without-active-shadow"
                show={productsIntervalControl.open}
                hide={productsIntervalControl.close}
              />
            )
          }
        />

        {dataLoaded ? (
          productsResult && productsResult.products.length > 0 ? (
            allColumnsHiddenExceptCheckbox ? (
              <EmptyTableBlock $height="400px">{t('all_columns_hidden')}</EmptyTableBlock>
            ) : (
              <ProductsTable
                currentPage={currentPage}
                productsTable={productsTable}
                productsMeta={productsResult.meta}
                columnResizeMode={columnResizeMode}
                showingPreviousData={showingPreviousData}
                saveColumnSize={saveColumnSize}
                handleChangePage={handleChangePage}
              />
            )
          ) : (
            <EmptyTableBlock $height="400px">{t('empty')}</EmptyTableBlock>
          )
        ) : (
          <WholePageLoaderWithLogo ensureSubheaderWithOffset extraOffset="var(--header-height)" />
        )}

        {addModalControl.opened && (
          <AddProductModal
            sectionType={sectionType}
            control={addModalControl}
            warehouseStore={warehouseStore}
            barcodesEnabled={barcodesEnabled}
            warehousesEnabled={warehousesEnabled}
            addProductModalStore={addProductModalStore}
            productCategoryStore={productCategoryStore}
            clearAllPresetParams={handleClearAllPresetParams}
            resetAddProductModalStore={resetAddProductModalStore}
          />
        )}
      </Root>
    </>
  );
});

Products.displayName = 'Products';
export { Products };

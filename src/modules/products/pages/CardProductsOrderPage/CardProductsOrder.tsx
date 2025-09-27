import { SettingsStore, appStore } from '@/app';
import { ORDER_ID_QUERY_PARAM, ORDER_NEW_PARAM_VALUE } from '@/modules/card';
import {
  InputModel,
  PermissionObjectType,
  SelectModel,
  WholePageLoaderWithLogo,
  dangerouslySetQueryParams,
  debounce,
  type Entity,
  type Nullable,
  type Optional,
  type User,
} from '@/shared';
import { when } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetEntityProductOrders, useGetProducts } from '../../api';
import type {
  CardProductOrderPageSettings,
  LastSelectedWarehouseSettings,
  OrderBlockFilterProps,
  OrderMutationRights,
  ProductsSection,
} from '../../shared';
import { ProductCategoryStore, WarehouseStore } from '../../store';
import { CardProductsOrderComponent } from './components';

const { settings } = SettingsStore.getSettingsStore<CardProductOrderPageSettings>(
  'CardProductOrderPageSettings'
);

if (!settings.lastSelectedWarehouseSettings) settings.lastSelectedWarehouseSettings = [];

interface Props {
  entity: Entity;
  orderId: Nullable<string>;
  currentUser: Nullable<User>;
  productsSection: ProductsSection;
  cardProductOrderComponentKey: number;
}

const CardProductsOrder = observer((props: Props) => {
  const { entity, orderId, currentUser, productsSection, cardProductOrderComponentKey } = props;

  const entityId = entity.id;
  const sectionId = productsSection.id;

  const [searchParams, setSearchParams] = useSearchParams();

  const filterCategoryId = useLocalObservable(() => SelectModel.create());
  const [filterWarehouseId, setFilterWarehouseId] = useState<Nullable<number>>(null);

  const [searchQuery, setSearchQuery] = useState<Nullable<string>>(null);
  const searchModel = useLocalObservable(() => InputModel.create());

  const productCategoryStore = useMemo(() => new ProductCategoryStore(sectionId), [sectionId]);
  const warehouseStore = useMemo(() => new WarehouseStore(sectionId), [sectionId]);

  const { isLoaded: areCategoriesLoaded, loadData: loadCategories } = productCategoryStore;
  const { isLoaded: areWarehousesLoaded, loadData: loadWarehouses } = warehouseStore;

  const [currentWarehouseBlockPage, setCurrentWarehouseBlockPage] = useState(1);

  const canCreateOrder = Boolean(
    currentUser?.canCreate(PermissionObjectType.PRODUCTS_ORDER, sectionId)
  );
  const canEditOrder = Boolean(
    currentUser?.canEdit(PermissionObjectType.PRODUCTS_ORDER, sectionId)
  );

  const mutationRights = useMemo(
    () =>
      ({
        canCreateOrder,
        canEditOrder,
      }) satisfies OrderMutationRights,
    [canCreateOrder, canEditOrder]
  );

  const lastSelectedWarehouseSettings = useMemo<Optional<LastSelectedWarehouseSettings>>(
    () => settings.lastSelectedWarehouseSettings.find(lsw => lsw.sectionId === sectionId),
    [sectionId]
  );

  const warehousesEnabled = Boolean(productsSection?.enableWarehouse);

  const { data: productOrders, isLoading: areProductOrdersLoading } =
    useGetEntityProductOrders(entityId);

  const {
    data: productsResult,
    isLoading: productsLoading,
    isPlaceholderData: showingPreviousProductsData,
  } = useGetProducts({
    sectionId,
    page: currentWarehouseBlockPage,
    queryParams: {
      search: searchQuery,
      warehouseId: filterWarehouseId,
      categoryId: filterCategoryId.value,
    },
  });

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        loadCategories();
        loadWarehouses();
      }
    );
  }, [loadCategories, loadWarehouses]);

  useLayoutEffect(() => {
    // orderId extracted from query params – it means that we need to show specific order,
    // whereas when productOrders are loaded, we need to set orderId to the first product order id
    // or to 'new' if there are no product orders
    if (orderId || !productOrders) return;

    const firstSectionProductOrder = productOrders.find(o => o.sectionId === sectionId);

    if (firstSectionProductOrder) {
      setSearchParams(prev => {
        prev.set(ORDER_ID_QUERY_PARAM, String(firstSectionProductOrder.id));

        return prev;
      });
    } else {
      setSearchParams(prev => {
        prev.set(ORDER_ID_QUERY_PARAM, ORDER_NEW_PARAM_VALUE);

        return prev;
      });
    }
  }, [productOrders, orderId, searchParams, sectionId, setSearchParams]);

  const handleClearSearchQuery = useCallback(() => {
    searchModel.value = '';

    setSearchQuery(null);

    setCurrentWarehouseBlockPage(1);
  }, [searchModel]);

  const handleSelectFilterWarehouse = useCallback(
    (warehouseId: Nullable<number>) => {
      setFilterWarehouseId(warehouseId);

      if (lastSelectedWarehouseSettings) {
        settings.lastSelectedWarehouseSettings = settings.lastSelectedWarehouseSettings.map(lsw =>
          lsw.sectionId === sectionId
            ? {
                ...lsw,
                warehouseId,
              }
            : lsw
        );
      } else {
        settings.lastSelectedWarehouseSettings = [
          ...(settings.lastSelectedWarehouseSettings ?? []),
          {
            sectionId,
            warehouseId: warehouseId,
          },
        ];
      }

      setCurrentWarehouseBlockPage(1);
    },
    [sectionId, lastSelectedWarehouseSettings]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchQuery = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery.trim().length) {
        setSearchQuery(null);

        return;
      }

      setSearchQuery(searchQuery);
    }, 750),
    []
  );

  const setOrderIdParam = useCallback(
    (orderId: number) => {
      // set params without setSearchParams so that react-router-dom will not see the change,
      // this is needed to prevent "save changes" dialog from appearing
      dangerouslySetQueryParams(new Map([[ORDER_ID_QUERY_PARAM, String(orderId)]]));

      // we need to also setSearchParams in original way to update the component state,
      // but it should be done in the end of the queue so that we won't get "Changes unsaved" warning
      // (because jsonState in the store at this time will be reinitialized)
      setTimeout(() => {
        setSearchParams(prev => {
          prev.set(ORDER_ID_QUERY_PARAM, String(orderId));

          return prev;
        });
      });
    },
    [setSearchParams]
  );

  const filterProps = useMemo(
    () =>
      ({
        searchModel,
        filterWarehouseId,
        filterCategoryId,
        setFilterWarehouseId,
        debouncedSearchQuery,
        handleClearSearchQuery,
        handleSelectFilterWarehouse,
        handleSelectFilterCategory: () => setCurrentWarehouseBlockPage(1),
      }) satisfies OrderBlockFilterProps,
    [
      searchModel,
      filterWarehouseId,
      filterCategoryId,
      setFilterWarehouseId,
      debouncedSearchQuery,
      handleClearSearchQuery,
      handleSelectFilterWarehouse,
    ]
  );

  const dataLoaded =
    areCategoriesLoaded && areWarehousesLoaded && !areProductOrdersLoading && orderId;

  if (!dataLoaded) return <WholePageLoaderWithLogo ensureSubheaderWithOffset />;

  return (
    <CardProductsOrderComponent
      key={cardProductOrderComponentKey}
      entity={entity}
      orderId={orderId}
      filterProps={filterProps}
      mutationRights={mutationRights}
      warehouseStore={warehouseStore}
      productsResult={productsResult}
      productsSection={productsSection}
      productsLoading={productsLoading}
      warehousesEnabled={warehousesEnabled}
      currentPage={currentWarehouseBlockPage}
      productCategoryStore={productCategoryStore}
      showingPreviousProductsData={showingPreviousProductsData}
      lastSelectedWarehouseSettings={lastSelectedWarehouseSettings}
      setOrderIdParam={setOrderIdParam}
      setCurrentPage={setCurrentWarehouseBlockPage}
    />
  );
});

CardProductsOrder.displayName = 'CardProductsOrder';
export { CardProductsOrder };

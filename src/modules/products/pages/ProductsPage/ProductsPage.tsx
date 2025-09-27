import { SettingsStore, appStore, iconStore } from '@/app';
import { authStore } from '@/modules/auth';
import { Reports, ReportsSection, generateCompositeProductsReportValue } from '@/modules/reporting';
import {
  BooleanModel,
  CommonQueryParams,
  CreateButton,
  DefaultHeader,
  InputModel,
  ModuleNameSkeleton,
  PageTemplateWithSubheader,
  PermissionObjectType,
  SearchInput,
  TutorialProductType,
  WholePageLoaderWithLogo,
  debounce,
  useMobile,
  useModalControl,
  useTitle,
  useToggleControl,
  useTypedParams,
  type DefaultHeaderModuleIconProps,
  type Nullable,
  type Optional,
  type TabModel,
} from '@/shared';
import { Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGetProductsSection } from '../../api';
import type { ProductTablesSettings } from '../../shared';
import {
  ProductsPageQueryParams,
  ProductsPageTabs,
  ProductsSectionType,
  ProductsSettingsButton,
  getProductsPageTabs,
} from '../../shared';
import { productsModuleStore } from '../../store';
import { Shipments } from '../ShipmentsPage/Shipments';
import { HideEmptyResourcesListItem } from '../TimetablePage/components';
import { Timetable } from '../TimetablePage/Timetable';
import { Products } from './Products';

const SearchBlockWrapper = styled.div`
  width: 60%;
  min-width: 184px;

  margin: 0 auto;
`;

const { settings: settingsFromLS } =
  SettingsStore.getSettingsStore<ProductTablesSettings>('ProductsTable');

if (!settingsFromLS.tables) settingsFromLS.tables = [];

const ProductsPage = observer(() => {
  const { sectionId, sectionType, tab } = useTypedParams<{
    sectionId: number;
    tab: ProductsPageTabs;
    sectionType: ProductsSectionType;
  }>();

  const { t } = useTranslation('module.products', { keyPrefix: 'products.pages.products_page' });

  const { user: currentUser } = authStore;

  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromParams = searchParams.get(CommonQueryParams.PAGE);
  let currentPage = pageFromParams ? Number(pageFromParams) : 1;

  const hasSectionTab = searchParams.has(CommonQueryParams.SECTION);
  const addProductParam = searchParams.get(ProductsPageQueryParams.ADD_PRODUCT);
  const productSkuParam = searchParams.get(ProductsPageQueryParams.PRODUCT_SKU);

  const { isLoaded: productsModuleLoaded, loadData: loadProductsModuleData } = productsModuleStore;

  const [
    reportsSettingsDrawerOpened,
    { open: showReportsSettingsDrawer, close: hideReportsSettingsDrawer },
  ] = useDisclosure(false);

  useEffect(() => {
    loadProductsModuleData();
  }, [loadProductsModuleData]);

  const { data: productsSection, isLoading: isProductsSectionLoading } =
    useGetProductsSection(sectionId);

  useTitle({
    dynamicTitle: productsSection
      ? `${productsSection.name} | ${t(`title.${sectionType}`)}`
      : undefined,
  });

  useLayoutEffect(() => {
    // set default page if it's not set and tab is either products or shipments
    if ((tab === ProductsPageTabs.PRODUCTS || tab === ProductsPageTabs.SHIPMENTS) && !currentPage) {
      setSearchParams(prev => {
        prev.set(CommonQueryParams.PAGE, String(currentPage));

        return prev;
      });
    }

    // if tab is not reports and section tab is present -> remove it 'cause it's not needed
    if (tab !== ProductsPageTabs.REPORTS && hasSectionTab) {
      setSearchParams(prev => {
        prev.delete(CommonQueryParams.SECTION);

        return prev;
      });
    }

    // if tab is reports and section tab is not present -> set it to default value
    if (tab === ProductsPageTabs.REPORTS && !hasSectionTab) {
      const firstLinkedEntityTypeId = productsSection?.entityTypeIds[0];

      if (!firstLinkedEntityTypeId) return;

      setSearchParams(prev => {
        prev.set(
          CommonQueryParams.SECTION,
          generateCompositeProductsReportValue({
            productsSectionId: productsSection.id,
            entityTypeId: firstLinkedEntityTypeId,
            reportSection: ReportsSection.PRODUCTS,
            productsSectionType: productsSection.type,
          })
        );

        return prev;
      });
    }
  }, [productsSection, hasSectionTab, tab, currentPage, setSearchParams]);

  const hideEmptyResourcesModel = useLocalObservable(() => BooleanModel.create(false));
  const searchModel = useLocalObservable(() => InputModel.create());

  const [searchQuery, setSearchQuery] = useState<Nullable<string>>(null);

  const isRentals = sectionType === ProductsSectionType.RENTAL;
  const isProducts = tab === ProductsPageTabs.PRODUCTS;
  const isReports = tab === ProductsPageTabs.REPORTS;

  const hideShipments = !productsSection?.enableWarehouse;
  const canViewShipments = currentUser?.canView(PermissionObjectType.PRODUCTS_SHIPMENT, sectionId);
  const canCreateProduct = Boolean(
    currentUser?.canCreate(PermissionObjectType.PRODUCTS, sectionId)
  );

  const tabs = useMemo<TabModel[]>(
    () =>
      getProductsPageTabs({
        sectionId,
        sectionType,
        hideShipments,
        canViewShipments,
        productsSection,
        t,
      }),
    [sectionId, sectionType, hideShipments, canViewShipments, productsSection, t]
  );

  const productsTableSettingsControl = useToggleControl(false);
  const shipmentsTableSettingsControl = useToggleControl(false);
  const addModalControl = useModalControl(false);

  const isMobile = useMobile();

  const setFirstPage = useCallback(() => {
    setSearchParams(prev => {
      prev.set(CommonQueryParams.PAGE, '1');

      return prev;
    });
  }, [setSearchParams]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchQuery = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery.trim().length) {
        setSearchQuery(null);

        return;
      }

      setSearchQuery(searchQuery);

      if (currentPage !== 1) setSearchParams(prev => ({ ...prev, [CommonQueryParams.PAGE]: '1' }));
    }, 750),
    [currentPage]
  );

  const handleClearSearch = useCallback(() => {
    searchModel.value = '';
    setSearchQuery(null);

    setFirstPage();
  }, [setSearchQuery, setFirstPage, searchModel]);

  const handleChangePage = useCallback(
    (page: number) => {
      setSearchParams(prev => {
        prev.set(CommonQueryParams.PAGE, String(page));

        return prev;
      });
    },
    [setSearchParams]
  );

  const handleClearAllPresetParams = useCallback(() => {
    setSearchParams(prev => {
      prev.delete(ProductsPageQueryParams.ADD_PRODUCT);
      prev.delete(ProductsPageQueryParams.PRODUCT_SKU);

      return prev;
    });
  }, [setSearchParams]);

  const moduleIconProps = useMemo<Optional<DefaultHeaderModuleIconProps>>(
    () =>
      productsSection
        ? {
            icon: iconStore.getByName(productsSection?.icon).icon,
            color: iconStore.productsColor,
          }
        : undefined,
    [productsSection]
  );

  if (!productsModuleLoaded || !appStore.isLoaded) {
    return (
      <PageTemplateWithSubheader
        Header={
          <DefaultHeader>
            <ModuleNameSkeleton />
          </DefaultHeader>
        }
        tabs={[]}
      >
        <WholePageLoaderWithLogo ensureSubheaderWithOffset extraOffset="var(--header-height)" />
      </PageTemplateWithSubheader>
    );
  }

  return (
    <PageTemplateWithSubheader
      tabs={tabs}
      rootWidth={isReports ? '100%' : undefined}
      pageMinWidth={isReports && isMobile ? 0 : undefined}
      Header={
        <DefaultHeader
          objectId={sectionId}
          moduleIconProps={moduleIconProps}
          moduleName={productsSection?.name}
          productType={TutorialProductType.PRODUCTS_SECTION}
          Controls={
            isProducts &&
            canCreateProduct && (
              <CreateButton tooltip={t('add_product')} onClick={addModalControl.open} />
            )
          }
          CentralContent={
            isProducts && (
              <SearchBlockWrapper>
                <SearchInput
                  model={searchModel}
                  onClear={handleClearSearch}
                  onChange={debouncedSearchQuery}
                />
              </SearchBlockWrapper>
            )
          }
        />
      }
      SubheaderControls={
        <ProductsSettingsButton
          sectionId={sectionId}
          sectionType={sectionType}
          tableSettingsControl={
            tab === ProductsPageTabs.SHIPMENTS
              ? shipmentsTableSettingsControl
              : isProducts
                ? productsTableSettingsControl
                : undefined
          }
          ExtraSettings={
            tab === ProductsPageTabs.TIMETABLE && (
              <HideEmptyResourcesListItem hideEmptyResourcesModel={hideEmptyResourcesModel} />
            )
          }
          showReportsSettingsDrawer={isReports ? showReportsSettingsDrawer : undefined}
        />
      }
    >
      <Tabs.Panel value={ProductsPageTabs.PRODUCTS}>
        <Products
          sectionId={sectionId}
          isRentals={isRentals}
          currentUser={currentUser}
          currentPage={currentPage}
          searchQuery={searchQuery}
          sectionType={sectionType}
          addProductParam={addProductParam}
          productSkuParam={productSkuParam}
          addModalControl={addModalControl}
          productsSection={productsSection}
          tableSettingsControl={productsTableSettingsControl}
          isProductsSectionLoading={isProductsSectionLoading}
          setFirstPage={setFirstPage}
          handleChangePage={handleChangePage}
          handleClearAllPresetParams={handleClearAllPresetParams}
        />
      </Tabs.Panel>

      <Tabs.Panel value={ProductsPageTabs.TIMETABLE}>
        <Timetable sectionId={sectionId} hideEmptyResourcesModel={hideEmptyResourcesModel} />
      </Tabs.Panel>

      <Tabs.Panel value={ProductsPageTabs.SHIPMENTS}>
        <Shipments
          sectionId={sectionId}
          sectionType={sectionType}
          currentPage={currentPage}
          tableSettingsControl={shipmentsTableSettingsControl}
          isProductsSectionLoading={isProductsSectionLoading}
          handleChangePage={handleChangePage}
        />
      </Tabs.Panel>

      {hasSectionTab && (
        <Tabs.Panel value={ProductsPageTabs.REPORTS}>
          <Reports
            productsSection={productsSection}
            settingsDrawerOpened={reportsSettingsDrawerOpened}
            hideSettingsDrawer={hideReportsSettingsDrawer}
          />
        </Tabs.Panel>
      )}
    </PageTemplateWithSubheader>
  );
});

ProductsPage.displayName = 'ProductsPage';
export { ProductsPage };

import { appStore, entityTypeStore, routes } from '@/app';
import {
  ProductsSectionBuilderStore,
  ProductsSectionType,
  WarehouseStore,
  invalidateProductsSections,
} from '@/modules/products';
import {
  useErrorMessageIdle,
  useScrollWindowToTop,
  useTitle,
  useTypedParams,
  type Nullable,
  type Optional,
} from '@/shared';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BuilderTabs,
  generateProductsSectionBuilderNavSteps,
  type BuilderNavStep,
} from '../../shared';
import { BuilderNavStore } from '../../store';
import { BuilderWithVerticalNavPageTemplate } from '../../templates';
import {
  ProductsSectionBuilderLinkSectionsStep,
  ProductsSectionBuilderScheduleSettings,
  ProductsSectionBuilderStep1,
  ProductsSectionBuilderStep2,
  ProductsSectionBuilderStep3,
} from './components';

const ProductsSectionBuilderPage = observer(() => {
  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.products_section_builder_page.steps',
  });

  const { moduleId } = useTypedParams<{ moduleId: Optional<number> }>();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const moduleType = searchParams.get('type') as Optional<ProductsSectionType>;

  useScrollWindowToTop();

  if (!moduleType)
    throw new Error(
      `Failed to get moduleType from search params, it is necessary to render ProductsSectionBuilderPage, received: ${moduleType}`
    );

  const { error: saveError, idle: saveErrorIdle } = useErrorMessageIdle(t('save_common_error'));
  const { error: saveWarehousesError, idle: saveWarehousesErrorIdle } = useErrorMessageIdle(
    t('save_warehouses_error')
  );

  const warehouseBuilderNavSteps = useMemo<BuilderNavStep[]>(
    () => generateProductsSectionBuilderNavSteps({ moduleType, t }),
    [moduleType, t]
  );
  const productsSectionBuilderNavStore = useMemo(
    () => new BuilderNavStore(warehouseBuilderNavSteps),
    [warehouseBuilderNavSteps]
  );

  const productsSectionBuilderStore = useMemo(
    () =>
      new ProductsSectionBuilderStore({
        moduleType,
        defaultTitle: t(`default_titles.${moduleType}`),
      }),
    [moduleType, t]
  );

  const { productsSection, isLoaded, sectionFormData, loadData } = productsSectionBuilderStore;
  const sectionId = productsSection?.id;

  useTitle({
    titleTranslationKey: productsSection ? undefined : `builder.products.${moduleType}`,
    dynamicTitle: productsSection
      ? `${productsSection.name} | ${t(`default_titles.${moduleType}`)}`
      : undefined,
  });

  const warehouseStore = useMemo<Nullable<WarehouseStore>>(
    () => (sectionId ? new WarehouseStore(sectionId) : null),
    [sectionId]
  );

  useLayoutEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        if (moduleId) loadData(moduleId);
      }
    );
  }, [moduleId, loadData]);

  const handleSave = useCallback(() => {
    if (!sectionFormData.validate()) {
      saveErrorIdle();

      return;
    }

    if (sectionFormData.enableWarehouse.value && !warehouseStore?.activeWarehouses.length) {
      saveWarehousesErrorIdle();

      return;
    }

    if (moduleId) {
      navigate(routes.builder(BuilderTabs.WORKSPACE));
    } else if (productsSection) {
      navigate(
        routes.products({ sectionId: productsSection.id, sectionType: productsSection.type })
      );
    } else {
      throw new Error(
        'Failed to finish products section builder process, not moduleId nor productsSection was provided'
      );
    }

    invalidateProductsSections();
    entityTypeStore.invalidateEntityTypesInCache();
  }, [
    moduleId,
    warehouseStore,
    productsSection,
    sectionFormData,
    navigate,
    saveErrorIdle,
    saveWarehousesErrorIdle,
  ]);

  const error = saveError || saveWarehousesError;

  const loading = Boolean(moduleId && appStore.isLoaded && !isLoaded);

  return (
    <BuilderWithVerticalNavPageTemplate loading={loading} navStore={productsSectionBuilderNavStore}>
      <ProductsSectionBuilderStep1
        saveError={error}
        loading={loading}
        navStore={productsSectionBuilderNavStore}
        sectionBuilderStore={productsSectionBuilderStore}
        onSave={moduleId ? handleSave : undefined}
      />

      {productsSection && (
        <>
          <ProductsSectionBuilderStep2
            saveError={error}
            moduleId={moduleId}
            sectionId={productsSection.id}
            navStore={productsSectionBuilderNavStore}
            onSave={moduleId ? handleSave : undefined}
          />

          {warehouseStore && (
            <ProductsSectionBuilderStep3
              saveError={error}
              moduleId={moduleId}
              moduleType={moduleType}
              warehouseStore={warehouseStore}
              navStore={productsSectionBuilderNavStore}
              sectionBuilderStore={productsSectionBuilderStore}
              onSave={moduleId ? handleSave : undefined}
            />
          )}
        </>
      )}

      {moduleType === ProductsSectionType.RENTAL && (
        <ProductsSectionBuilderScheduleSettings
          saveError={error}
          navStore={productsSectionBuilderNavStore}
          sectionBuilderStore={productsSectionBuilderStore}
          onSave={moduleId ? handleSave : undefined}
        />
      )}

      <ProductsSectionBuilderLinkSectionsStep
        saveError={error}
        moduleType={moduleType}
        warehouseStore={warehouseStore}
        navStore={productsSectionBuilderNavStore}
        sectionBuilderStore={productsSectionBuilderStore}
        onSave={handleSave}
      />
    </BuilderWithVerticalNavPageTemplate>
  );
});

ProductsSectionBuilderPage.displayName = 'ProductsSectionBuilderPage';
export { ProductsSectionBuilderPage };

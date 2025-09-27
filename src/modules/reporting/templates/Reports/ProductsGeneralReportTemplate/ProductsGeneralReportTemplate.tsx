import { SettingsStore, boardApiUtil, userStore } from '@/app';
import {
  ProductCategoriesSelect,
  ProductCategoryStore,
  ProductWarehousesSelect,
  WarehouseStore,
  type ProductsSectionType,
} from '@/modules/products';
import { getCreatedAtFilter } from '@/modules/section';
import {
  CreatedAtDateSelect,
  DatePeriodFilterModel,
  DatePeriodFilterType,
  MultiselectModel,
  MultiselectWithCheckboxes,
  MySelect,
  SelectModel,
  UriCodingUtil,
  UsersMultiselect,
  UtcDate,
  debounce,
  type Optional,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ProductsReportFilterDto, useGetProductsGeneralReport } from '../../../api';
import {
  ProductsReportType,
  ReportStageType,
  useGenerateStageOptions,
  useGetProductsGeneralReportColumns,
  useGetProductsGeneralReportTableData,
  useGetReportTable,
  useSaveReportColumnsVisibility,
  type ProductsGeneralReportSyntheticRow,
  type ReportFilterSettings,
  type ReportTemplateProps,
} from '../../../shared';
import { ReportRootTemplate, ReportTable } from '../components';

interface FilterForm {
  userIds: MultiselectModel<number>;
  boardIds: MultiselectModel<number>;
  period: DatePeriodFilterModel;
  categoryIds: MultiselectModel<number>;
  warehouseIds: MultiselectModel<number>;
  stageType: SelectModel;
}

const PRODUCTS_GENERAL_REPORT_FILTER_SETTINGS_KEY = 'ProductsGeneralReportFilterSettings';

const { settings } = SettingsStore.getSettingsStore<{
  filters: ReportFilterSettings<ProductsReportType, ProductsReportFilterDto>[];
}>(PRODUCTS_GENERAL_REPORT_FILTER_SETTINGS_KEY);

if (!settings.filters) settings.filters = [];

interface Props extends ReportTemplateProps<ProductsReportType> {
  entityTypeId: number;
  productsSectionId: number;
  sectionType: ProductsSectionType;
}

const generateExtraId = ({
  productsSectionId,
  sectionType,
}: {
  productsSectionId: number;
  sectionType: ProductsSectionType;
}): string => `${productsSectionId}-${sectionType}`;

const ProductsGeneralReportTemplate = observer((props: Props) => {
  const {
    reportType,
    entityTypeId,
    productsSectionId,
    sectionType,
    sidebarShown,
    settingsButtonRef,
    settingsDrawerOpened,
    toggleSidebar,
    hideSettingsDrawer,
  } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.templates.general_report_template',
  });

  const { pathname, search } = useLocation();

  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const productCategoryStore = useMemo(
    () => new ProductCategoryStore(productsSectionId),
    [productsSectionId]
  );
  const warehouseStore = useMemo(() => new WarehouseStore(productsSectionId), [productsSectionId]);

  const {
    categories,
    isLoaded: areCategoriesLoaded,
    loadData: loadCategories,
  } = productCategoryStore;

  const { loadData: loadWarehouses } = warehouseStore;

  useEffect(() => {
    loadCategories();
    loadWarehouses();
  }, [loadCategories, loadWarehouses]);

  const savedFilterSettings = useMemo<
    Optional<ReportFilterSettings<ProductsReportType, ProductsReportFilterDto>>
  >(
    () =>
      settings.filters
        ? settings.filters.find(
            s =>
              s.id === entityTypeId &&
              s.extraId === generateExtraId({ productsSectionId, sectionType }) &&
              s.reportType === reportType
          )
        : undefined,
    [productsSectionId, entityTypeId, reportType, sectionType]
  );

  const filterForm = useLocalObservable<FilterForm>(() => ({
    userIds: MultiselectModel.create(savedFilterSettings?.filter?.userIds ?? []),
    boardIds: MultiselectModel.create(savedFilterSettings?.filter?.boardIds ?? []),
    period: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter?.period?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.to),
    }),
    categoryIds: MultiselectModel.create(savedFilterSettings?.filter?.categoryIds ?? []),
    warehouseIds: MultiselectModel.create(savedFilterSettings?.filter?.warehouseIds ?? []),
    stageType: SelectModel.create(savedFilterSettings?.filter?.stageType ?? ReportStageType.ALL),
  }));

  const [filter, setFilter] = useState<ProductsReportFilterDto>(
    () =>
      new ProductsReportFilterDto({
        type: reportType,
        entityTypeId,
        productsSectionId,
        period: getCreatedAtFilter(filterForm.period),
        userIds: filterForm.userIds.valuesOrUndefined,
        boardIds: filterForm.boardIds.valuesOrUndefined,
        categoryIds: filterForm.categoryIds.valuesOrUndefined,
        warehouseIds: filterForm.warehouseIds.valuesOrUndefined,
        stageType: filterForm.stageType.value,
      })
  );

  const {
    data: productsGeneralReport,
    isLoading,
    isRefetching,
  } = useGetProductsGeneralReport(filter);

  const data = useGetProductsGeneralReportTableData({
    reportType,
    categories,
    productsGeneralReport,
  });
  const columns = useGetProductsGeneralReportColumns({
    reportType,
    sectionId: productsSectionId,
    sectionType,
    currentPageDecodeUrl: currentPageEncodedUrl,
    stageType: filter.stageType,
    selectedUsersInFilter: filter.userIds,
  });

  const { columnVisibility, setColumnVisibility } = useSaveReportColumnsVisibility<
    ProductsReportType,
    ProductsReportFilterDto
  >({
    settings,
    reportType,
    savedFilterSettings,
    id: entityTypeId,
    extraId: generateExtraId({ productsSectionId, sectionType }),
  });

  const table = useGetReportTable<ProductsGeneralReportSyntheticRow>({
    data,
    columns,
    columnVisibility,
    setColumnVisibility,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleApplyFilter = useCallback(
    debounce(() => {
      const filter = new ProductsReportFilterDto({
        type: reportType,
        entityTypeId,
        productsSectionId,
        period: getCreatedAtFilter(filterForm.period),
        userIds: filterForm.userIds.valuesOrUndefined,
        boardIds: filterForm.boardIds.valuesOrUndefined,
        categoryIds: filterForm.categoryIds.valuesOrUndefined,
        warehouseIds: filterForm.warehouseIds.valuesOrUndefined,
        stageType: filterForm.stageType.value,
      });

      const savedFilters = settings.filters ?? [];

      settings.filters = savedFilters.map(s =>
        s.reportType === reportType &&
        s.id === entityTypeId &&
        s.extraId === generateExtraId({ productsSectionId, sectionType })
          ? {
              filter,
              reportType,
              id: entityTypeId,
              extraId: generateExtraId({ productsSectionId, sectionType }),
              columnVisibility: s.columnVisibility,
            }
          : s
      );

      setFilter(filter);
    }, 500),
    [
      reportType,
      entityTypeId,
      productsSectionId,
      filterForm.period,
      filterForm.boardIds.values,
      filterForm.userIds.values,
    ]
  );

  const stageOptions = useGenerateStageOptions(ReportStageType.WON);
  const boardsOptions = boardApiUtil.useGetBoardsByEntityTypeIdOptions(entityTypeId);

  return (
    <ReportRootTemplate
      table={table}
      refetching={isRefetching}
      sidebarShown={sidebarShown}
      settingsButtonRef={settingsButtonRef}
      settingsDrawerOpened={settingsDrawerOpened}
      Table={
        <ReportTable
          table={table}
          allHeadersSecondary
          loading={isLoading || !areCategoriesLoaded}
        />
      }
      Filters={
        <>
          <UsersMultiselect
            withinPortal
            model={filterForm.userIds}
            users={userStore.activeUsers}
            placeholder={t('placeholders.users')}
            variant="outlined-without-active-shadow"
            titleWidth="var(--report-filter-select-width)"
            handleChange={handleApplyFilter}
          />

          <MultiselectWithCheckboxes
            withinPortal
            dropdownMinWidth="240px"
            model={filterForm.boardIds}
            variant="outlined-without-active-shadow"
            placeholder={t('placeholders.pipeline')}
            width="var(--report-filter-select-width)"
            options={boardsOptions}
            handleChange={handleApplyFilter}
          />

          <ProductCategoriesSelect
            dropdownMinWidth="264px"
            model={filterForm.categoryIds}
            variant="outlined-without-active-shadow"
            productCategoryStore={productCategoryStore}
            titleWidth="var(--report-filter-select-width)"
            handleChange={handleApplyFilter}
          />

          <ProductWarehousesSelect
            dropdownMinWidth="240px"
            warehouseStore={warehouseStore}
            model={filterForm.warehouseIds}
            variant="outlined-without-active-shadow"
            titleWidth="var(--report-filter-select-width)"
            handleChange={handleApplyFilter}
          />

          <CreatedAtDateSelect
            withQuarters
            createdAtModel={filterForm.period}
            variant="outlined-without-active-shadow"
            titleWidth="var(--report-filter-select-width)"
            handleApply={handleApplyFilter}
          />

          {reportType !== ProductsReportType.USER && (
            <MySelect
              withinPortal
              options={stageOptions}
              model={filterForm.stageType}
              variant="outlined-without-active-shadow"
              width="var(--report-filter-select-width)"
              placeholder={t('placeholders.stage')}
              handleChangeOption={handleApplyFilter}
            />
          )}
        </>
      }
      toggleSidebar={toggleSidebar}
      hideSettingsDrawer={hideSettingsDrawer}
    />
  );
});

ProductsGeneralReportTemplate.displayName = 'ProductsGeneralReportTemplate';
export { ProductsGeneralReportTemplate };

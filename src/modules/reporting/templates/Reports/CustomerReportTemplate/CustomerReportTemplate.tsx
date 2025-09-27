import { SettingsStore, boardApiUtil, userStore } from '@/app';
import { getCreatedAtFilter } from '@/modules/section';
import {
  CreatedAtDateSelect,
  DatePeriodFilterModel,
  DatePeriodFilterType,
  MultiselectModel,
  MultiselectWithCheckboxes,
  UriCodingUtil,
  UsersMultiselect,
  UtcDate,
  debounce,
  type Optional,
  type SectionPaginationProps,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { CUSTOMER_REPORT_LIMIT, CustomerReportFilterDto, useGetCustomerReport } from '../../../api';
import {
  CustomerReportType,
  useGetCustomerReportColumns,
  useGetCustomerReportTableData,
  useGetReportTable,
  useSaveReportColumnsVisibility,
  type CustomerReportSyntheticRow,
  type ReportFilterSettings,
  type ReportTemplateProps,
} from '../../../shared';
import { ReportRootTemplate, ReportTable } from '../components';

interface FilterForm {
  ownerIds: MultiselectModel<number>;
  boardIds: MultiselectModel<number>;
  period: DatePeriodFilterModel;
}

const CUSTOMER_REPORT_FILTER_SETTINGS_KEY = 'CustomerReportFilterSettings';

const { settings } = SettingsStore.getSettingsStore<{
  filters: ReportFilterSettings<CustomerReportType, CustomerReportFilterDto>[];
}>(CUSTOMER_REPORT_FILTER_SETTINGS_KEY);

if (!settings.filters) settings.filters = [];

interface Props extends ReportTemplateProps<CustomerReportType> {
  entityTypeId: number;
}

const CustomerReportTemplate = observer((props: Props) => {
  const {
    reportType,
    sidebarShown,
    entityTypeId,
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

  const savedFilterSettings = useMemo<
    Optional<ReportFilterSettings<CustomerReportType, CustomerReportFilterDto>>
  >(
    () =>
      settings.filters
        ? settings.filters.find(s => s.id === entityTypeId && s.reportType === reportType)
        : undefined,
    [entityTypeId, reportType]
  );

  const filterForm = useLocalObservable<FilterForm>(() => ({
    ownerIds: MultiselectModel.create(savedFilterSettings?.filter?.ownerIds ?? []),
    boardIds: MultiselectModel.create(savedFilterSettings?.filter?.boardIds ?? []),
    period: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter?.period?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.to),
    }),
  }));

  const [filter, setFilter] = useState<CustomerReportFilterDto>(() => ({
    type: reportType === CustomerReportType.CUSTOMER_CONTACT_COMPANY ? null : reportType,
    entityTypeId: entityTypeId,
    ownerIds: filterForm.ownerIds.valuesOrUndefined,
    boardIds: filterForm.boardIds.valuesOrUndefined,
    period: getCreatedAtFilter(filterForm.period),
  }));

  const [page, setPage] = useState(1);

  const {
    data: customerReport,
    isLoading,
    isRefetching,
    isPlaceholderData: showingReportPreviousData,
  } = useGetCustomerReport({ page, filter });

  const data = useGetCustomerReportTableData({ customerReport, reportType });
  const columns = useGetCustomerReportColumns({ customerReport, currentPageEncodedUrl });

  const { columnVisibility, setColumnVisibility } = useSaveReportColumnsVisibility<
    CustomerReportType,
    CustomerReportFilterDto
  >({
    settings,
    reportType,
    id: entityTypeId,
    savedFilterSettings,
  });

  const table = useGetReportTable<CustomerReportSyntheticRow>({
    data,
    columns,
    columnVisibility,
    setColumnVisibility,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleApplyFilter = useCallback(
    debounce(() => {
      const period = getCreatedAtFilter(filterForm.period);

      const filter = new CustomerReportFilterDto({
        period,
        entityTypeId,
        type: reportType,
        ownerIds: filterForm.ownerIds.values,
        boardIds: filterForm.boardIds.values,
      });

      const savedFilters = settings.filters ?? [];

      settings.filters = savedFilters.map(s =>
        s.reportType === reportType && s.id === entityTypeId
          ? {
              id: entityTypeId,
              filter,
              reportType,
              columnVisibility: s.columnVisibility,
            }
          : s
      );

      setPage(1);
      setFilter(filter);
    }, 500),
    [
      reportType,
      entityTypeId,
      filterForm.period,
      filterForm.boardIds.values,
      filterForm.ownerIds.values,
    ]
  );

  const paginationProps = useMemo<Optional<SectionPaginationProps>>(
    () =>
      customerReport
        ? {
            currentPage: page,
            pageCount: Math.ceil(customerReport.meta.total / CUSTOMER_REPORT_LIMIT),
            handleChange: setPage,
          }
        : undefined,
    [customerReport, page]
  );

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
          loading={isLoading}
          allHeadersSecondary
          paginationProps={paginationProps}
          changingPage={showingReportPreviousData}
        />
      }
      Filters={
        <>
          <UsersMultiselect
            withinPortal
            model={filterForm.ownerIds}
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
            width="var(--report-filter-select-width)"
            placeholder={t('placeholders.pipeline')}
            options={boardsOptions}
            handleChange={handleApplyFilter}
          />

          <CreatedAtDateSelect
            withQuarters
            createdAtModel={filterForm.period}
            variant="outlined-without-active-shadow"
            titleWidth="var(--report-filter-select-width)"
            handleApply={handleApplyFilter}
          />
        </>
      }
      toggleSidebar={toggleSidebar}
      hideSettingsDrawer={hideSettingsDrawer}
    />
  );
});

CustomerReportTemplate.displayName = 'CustomerReportTemplate';
export { CustomerReportTemplate };

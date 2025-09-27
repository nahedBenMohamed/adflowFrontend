import { SettingsStore, boardApiUtil, entityTypeStore, userStore } from '@/app';
import { getCreatedAtFilter } from '@/modules/section';
import {
  DatePeriodFilterModel,
  DatePeriodFilterType,
  MultiselectModel,
  MultiselectWithCheckboxes,
  MySelect,
  SelectModel,
  UsersMultiselect,
  UtcDate,
  debounce,
  type EntityCreatedAtFilter,
  type Optional,
} from '@/shared';
import { useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ComparativeReportFilterDto, useGetComparativeReport } from '../../../api';
import {
  ComparativeReportType,
  OWNER_FIELDS_RESPONSIBLE_VALUE,
  useGenerateMonthOptions,
  useGetComparativeReportColumns,
  useGetComparativeReportTableData,
  useGetOwnerFieldsFilterOptions,
  useGetReportTable,
  useSaveReportColumnsVisibility,
  type ComparativeReportSyntheticRow,
  type ReportFilterSettings,
  type ReportTemplateProps,
} from '../../../shared';
import { ReportRootTemplate, ReportTable } from '../components';

interface FilterForm {
  year: SelectModel;
  month: SelectModel;
  userIds: MultiselectModel<number>;
  boardIds: MultiselectModel<number>;
  ownerFieldId: SelectModel;
}

const COMPARATIVE_REPORT_FILTER_SETTINGS_KEY = 'ComparativeReportFilterSettings';

const { settings } = SettingsStore.getSettingsStore<{
  filters: ReportFilterSettings<ComparativeReportType, ComparativeReportFilterDto>[];
}>(COMPARATIVE_REPORT_FILTER_SETTINGS_KEY);

if (!settings.filters) settings.filters = [];

const filterMonthTypes = [ComparativeReportType.DAY, ComparativeReportType.WEEK];
const filterYearTypes = [ComparativeReportType.MONTH, ComparativeReportType.QUARTER];

interface Props extends ReportTemplateProps<ComparativeReportType> {
  entityTypeId: number;
}

const ComparativeReportTemplate = (props: Props) => {
  const {
    reportType,
    entityTypeId,
    sidebarShown,
    settingsButtonRef,
    settingsDrawerOpened,
    toggleSidebar,
    hideSettingsDrawer,
  } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.templates.comparative_report_template',
  });

  const savedFilterSettings = useMemo<
    Optional<ReportFilterSettings<ComparativeReportType, ComparativeReportFilterDto>>
  >(
    () =>
      settings.filters
        ? settings.filters.find(s => s.id === entityTypeId && s.reportType === reportType)
        : undefined,
    [entityTypeId, reportType]
  );

  const dateNow = useMemo(() => UtcDate.now(), []);

  const filterForm = useLocalObservable<FilterForm>(() => ({
    userIds: MultiselectModel.create(savedFilterSettings?.filter?.userIds ?? []),
    boardIds: MultiselectModel.create(savedFilterSettings?.filter?.boardIds ?? []),
    month: SelectModel.create(
      UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.from)?.month ?? dateNow.month
    ),
    year: SelectModel.create(
      UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.from)?.year ?? dateNow.year
    ),
    ownerFieldId: SelectModel.create(
      savedFilterSettings?.filter?.ownerFieldId ?? OWNER_FIELDS_RESPONSIBLE_VALUE
    ),
  }));

  const generateCreateAtFilter = useCallback(
    (reportType: ComparativeReportType): Optional<EntityCreatedAtFilter> => {
      if (filterMonthTypes.includes(reportType))
        return getCreatedAtFilter(
          new DatePeriodFilterModel({
            type: DatePeriodFilterType.PERIOD,
            from: UtcDate.startOfMonth(filterForm.month.value),
            to: UtcDate.endOfMonth(filterForm.month.value),
          })
        );

      if (filterYearTypes.includes(reportType))
        return getCreatedAtFilter(
          new DatePeriodFilterModel({
            type: DatePeriodFilterType.PERIOD,
            from: UtcDate.startOfYear(filterForm.year.value),
            to: UtcDate.endOfYear(filterForm.year.value),
          })
        );

      return;
    },
    [filterForm.month.value, filterForm.year.value]
  );

  const monthOptions = useGenerateMonthOptions();

  const [filter, setFilter] = useState<ComparativeReportFilterDto>(() => ({
    entityTypeId,
    type: reportType,
    userIds: filterForm.userIds.valuesOrUndefined,
    boardIds: filterForm.boardIds.valuesOrUndefined,
    period: generateCreateAtFilter(reportType),
    ownerFieldId:
      // this value is used for UI purposes only, we need to send null to backend if it's responsible option
      filterForm.ownerFieldId.value === OWNER_FIELDS_RESPONSIBLE_VALUE
        ? null
        : filterForm.ownerFieldId.value,
  }));

  const { data: comparativeReport, isLoading, isRefetching } = useGetComparativeReport(filter);

  const data = useGetComparativeReportTableData(comparativeReport);
  const columns = useGetComparativeReportColumns({
    dateNow,
    currentMonth: filterForm.month.value,
    currentYear: filterForm.year.value,
    reportType,
  });

  const { columnVisibility, setColumnVisibility } = useSaveReportColumnsVisibility<
    ComparativeReportType,
    ComparativeReportFilterDto
  >({
    settings,
    reportType,
    id: entityTypeId,
    savedFilterSettings,
  });

  const table = useGetReportTable<ComparativeReportSyntheticRow>({
    data,
    columns,
    columnVisibility,
    setColumnVisibility,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleApplyFilter = useCallback(
    debounce(() => {
      const period = generateCreateAtFilter(reportType);

      const filter = new ComparativeReportFilterDto({
        period,
        entityTypeId,
        type: reportType,
        userIds: filterForm.userIds.values,
        boardIds: filterForm.boardIds.values,
        ownerFieldId:
          filterForm.ownerFieldId.value === OWNER_FIELDS_RESPONSIBLE_VALUE
            ? null
            : filterForm.ownerFieldId.value,
      });

      const savedFilters = settings.filters ?? [];

      settings.filters = savedFilters.map<
        ReportFilterSettings<ComparativeReportType, ComparativeReportFilterDto>
      >(s =>
        s.reportType === reportType && s.id === entityTypeId
          ? {
              filter,
              reportType,
              id: entityTypeId,
              columnVisibility: s.columnVisibility,
            }
          : s
      );

      setFilter(filter);
    }, 500),
    [
      reportType,
      entityTypeId,
      filterForm.boardIds.values,
      filterForm.userIds.values,
      generateCreateAtFilter,
    ]
  );

  const boardsOptions = boardApiUtil.useGetBoardsByEntityTypeIdOptions(entityTypeId);
  const ownerFieldOptions = useGetOwnerFieldsFilterOptions(entityTypeStore.getById(entityTypeId));

  return (
    <ReportRootTemplate
      noExport
      table={table}
      refetching={isRefetching}
      sidebarShown={sidebarShown}
      settingsButtonRef={settingsButtonRef}
      settingsDrawerOpened={settingsDrawerOpened}
      Table={<ReportTable loading={isLoading} table={table} />}
      Filters={
        <>
          {ownerFieldOptions.length > 0 && (
            <MySelect
              withinPortal
              options={ownerFieldOptions}
              model={filterForm.ownerFieldId}
              variant="outlined-without-active-shadow"
              width="var(--report-filter-select-width)"
              placeholder={t('placeholders.responsible')}
              handleChangeOption={handleApplyFilter}
            />
          )}

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
            width="var(--report-filter-select-width)"
            placeholder={t('placeholders.pipeline')}
            options={boardsOptions}
            handleChange={handleApplyFilter}
          />

          {filterMonthTypes.includes(reportType) && (
            <MySelect
              withinPortal
              options={monthOptions}
              model={filterForm.month}
              variant="outlined-without-active-shadow"
              width="var(--report-filter-select-width)"
              placeholder={t('placeholders.month')}
              handleChangeOption={handleApplyFilter}
            />
          )}
        </>
      }
      toggleSidebar={toggleSidebar}
      hideSettingsDrawer={hideSettingsDrawer}
    />
  );
};

export { ComparativeReportTemplate };

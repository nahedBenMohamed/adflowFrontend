import { recordSingularityStore, userStore } from '@/app';
import { SettingsStore } from '@/app/store/SettingsStore';
import { getCreatedAtFilter } from '@/modules/section';
import { CallStatus } from '@/modules/telephony';
import {
  BooleanModel,
  CreatedAtDateSelect,
  DatePeriodFilterModel,
  DatePeriodFilterType,
  MultiselectModel,
  MyCheckboxWithBooleanModel,
  MySelect,
  SelectModel,
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
import {
  CALL_HISTORY_REPORT_LIMIT,
  CallHistoryReportFilterDto,
  useGetCallHistoryReport,
} from '../../../api';
import {
  ExtendedCallDirections,
  useGenerateDirectionOptions,
  useGetCallHistoryReportColumns,
  useGetCallHistoryReportTableData,
  useGetReportTable,
  useSaveReportColumnsVisibility,
  type CallHistoryReportSyntheticRow,
  type CallHistoryReportType,
  type DurationFilterSelectModel,
  type ReportFilterSettings,
  type ReportTemplateProps,
} from '../../../shared';
import { ReportRootTemplate, ReportTable } from '../components';
import { CheckboxWrapper, TimePickerGroup } from './components';

interface FilterForm {
  userIds: MultiselectModel<number>;
  direction: SelectModel;
  period: DatePeriodFilterModel;
  duration: DurationFilterSelectModel;
  status: BooleanModel;
}

const HISTORY_REPORT_FILTER_SETTINGS_KEY = 'CallHistoryReportFilterSettings';

const { settings } = SettingsStore.getSettingsStore<{
  filters: ReportFilterSettings<CallHistoryReportType, CallHistoryReportFilterDto>[];
}>(HISTORY_REPORT_FILTER_SETTINGS_KEY);

if (!settings.filters) settings.filters = [];

interface Props extends ReportTemplateProps<CallHistoryReportType> {
  entityTypeId: number;
}

const CallHistoryReportTemplate = observer((props: Props) => {
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
    keyPrefix: 'reporting.templates.calls_report_template',
  });

  const { pathname, search } = useLocation();
  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const savedFilterSettings = useMemo<
    Optional<ReportFilterSettings<CallHistoryReportType, CallHistoryReportFilterDto>>
  >(() => {
    return settings.filters
      ? settings.filters.find(s => s.id === entityTypeId && s.reportType === reportType)
      : undefined;
  }, [entityTypeId, reportType]);

  const filterForm = useLocalObservable<FilterForm>(() => ({
    userIds: MultiselectModel.create(savedFilterSettings?.filter?.userIds ?? []),
    direction: SelectModel.create(savedFilterSettings?.filter?.direction ?? null),
    period: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter?.period?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.to),
    }),
    duration: {
      min: SelectModel.create(savedFilterSettings?.filter?.duration?.min ?? null),
      max: SelectModel.create(savedFilterSettings?.filter?.duration?.max ?? null),
    },
    status: BooleanModel.create(savedFilterSettings?.filter?.status ? true : false),
  }));

  const [filter, setFilter] = useState<CallHistoryReportFilterDto>(() => {
    return {
      entityTypeId,
      userIds: filterForm.userIds.valuesOrUndefined,
      period: getCreatedAtFilter(filterForm.period),
      direction: filterForm.direction.value ?? undefined,
      duration: { min: filterForm.duration.min.value, max: filterForm.duration.max.value },
      status: filterForm.status.value ? CallStatus.MISSED : undefined,
    };
  });

  const directionOptions = useGenerateDirectionOptions();

  const [page, setPage] = useState(1);

  const {
    isLoading,
    isRefetching,
    data: callHistoryReport,
    isPlaceholderData: showingReportPreviousData,
  } = useGetCallHistoryReport({ page, filter });

  const data = useGetCallHistoryReportTableData(callHistoryReport);
  const columns = useGetCallHistoryReportColumns(currentPageEncodedUrl);

  const { columnVisibility, setColumnVisibility } = useSaveReportColumnsVisibility<
    CallHistoryReportType,
    CallHistoryReportFilterDto
  >({
    settings,
    reportType,
    id: entityTypeId,
    savedFilterSettings,
  });

  const table = useGetReportTable<CallHistoryReportSyntheticRow>({
    data,
    columns,
    columnVisibility,
    setColumnVisibility,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleApplyFilter = useCallback(
    debounce(() => {
      // to ensure that no record continue to play after changing the filter
      recordSingularityStore.clear();

      const period = getCreatedAtFilter(filterForm.period);
      const status = filterForm.status.value ? CallStatus.MISSED : undefined;

      const filter = new CallHistoryReportFilterDto({
        entityTypeId,
        period,
        userIds: filterForm.userIds.values,
        direction:
          filterForm.direction.value !== ExtendedCallDirections.ALL
            ? filterForm.direction.value
            : undefined,
        duration: { min: filterForm.duration.min.value, max: filterForm.duration.max.value },
        status,
      });

      const savedFilters = settings.filters ?? [];

      settings.filters = savedFilters.map<
        ReportFilterSettings<CallHistoryReportType, CallHistoryReportFilterDto>
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

      setPage(1);
      setFilter(filter);
    }, 500),
    [
      reportType,
      entityTypeId,
      filterForm.period,
      filterForm.userIds.values,
      filterForm.direction.value,
      filterForm.duration.max.value,
      filterForm.duration.min.value,
      filterForm.status.value,
    ]
  );

  const paginationProps = useMemo<Optional<SectionPaginationProps>>(
    () =>
      callHistoryReport
        ? {
            currentPage: page,
            pageCount: Math.ceil(callHistoryReport.meta.total / CALL_HISTORY_REPORT_LIMIT),
            handleChange: setPage,
          }
        : undefined,
    [callHistoryReport, page, setPage]
  );

  return (
    <ReportRootTemplate
      noExport
      table={table}
      refetching={isRefetching}
      sidebarShown={sidebarShown}
      settingsButtonRef={settingsButtonRef}
      settingsDrawerOpened={settingsDrawerOpened}
      Table={
        <ReportTable
          withoutTotal
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
            model={filterForm.userIds}
            users={userStore.activeUsers}
            placeholder={t('placeholders.users')}
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

          <MySelect
            withinPortal
            options={directionOptions}
            model={filterForm.direction}
            variant="outlined-without-active-shadow"
            width="var(--report-filter-select-width)"
            placeholder={t('placeholders.directions')}
            handleChangeOption={handleApplyFilter}
          />

          <CheckboxWrapper>
            <MyCheckboxWithBooleanModel
              model={filterForm.status}
              handleChange={handleApplyFilter}
            />

            {t('placeholders.only_missed')}
          </CheckboxWrapper>

          <TimePickerGroup model={filterForm.duration} handleApplyFilter={handleApplyFilter} />
        </>
      }
      toggleSidebar={toggleSidebar}
      hideSettingsDrawer={hideSettingsDrawer}
    />
  );
});

CallHistoryReportTemplate.displayName = 'CallHistoryReportTemplate';
export { CallHistoryReportTemplate };

import { SettingsStore, boardApiUtil, userStore } from '@/app';
import { getCreatedAtFilter } from '@/modules/section';
import {
  CreatedAtDateSelect,
  DatePeriodFilterModel,
  DatePeriodFilterType,
  MultiselectModel,
  MultiselectWithCheckboxes,
  UsersMultiselect,
  UtcDate,
  debounce,
  type Nullable,
  type Optional,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScheduleReportFilterDto, useGetScheduleReport } from '../../../api';
import {
  ScheduleReportType,
  useGetReportTable,
  useGetScheduleReportColumns,
  useGetScheduleReportTableData,
  useSaveReportColumnsVisibility,
  type ReportFilterSettings,
  type ReportTemplateProps,
  type ScheduleReportSyntheticRow,
} from '../../../shared';
import { ReportRootTemplate, ReportTable } from '../components';

interface FilterForm {
  userIds: MultiselectModel<number>;
  boardIds: MultiselectModel<number>;
  period: DatePeriodFilterModel;
}

const SCHEDULE_REPORT_FILTER_SETTINGS_KEY = 'ScheduleReportFilterSettings';

const { settings } = SettingsStore.getSettingsStore<{
  filters: ReportFilterSettings<ScheduleReportType, ScheduleReportFilterDto>[];
}>(SCHEDULE_REPORT_FILTER_SETTINGS_KEY);

if (!settings.filters) settings.filters = [];

interface Props extends ReportTemplateProps<ScheduleReportType> {
  scheduleId: number;
  scheduleEntityTypeId: Nullable<number>;
}

const ScheduleReportTemplate = observer((props: Props) => {
  const {
    reportType,
    scheduleId,
    sidebarShown,
    settingsButtonRef,
    settingsDrawerOpened,
    scheduleEntityTypeId,
    toggleSidebar,
    hideSettingsDrawer,
  } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.templates.general_report_template',
  });

  const savedFilterSettings = useMemo<
    Optional<ReportFilterSettings<ScheduleReportType, ScheduleReportFilterDto>>
  >(
    () =>
      settings.filters
        ? settings.filters.find(s => s.id === scheduleId && s.reportType === reportType)
        : undefined,
    [scheduleId, reportType]
  );

  const scheduleEntityTypeBoardsOptions =
    boardApiUtil.useGetBoardsByEntityTypeIdOptions(scheduleEntityTypeId);
  const scheduleBoardsOptions = boardApiUtil.useGetBoardsByEntityTypeIdOptions(scheduleId);

  const boardOptions = scheduleEntityTypeId
    ? scheduleEntityTypeBoardsOptions
    : scheduleBoardsOptions;

  const filterForm = useLocalObservable<FilterForm>(() => ({
    userIds: MultiselectModel.create(savedFilterSettings?.filter?.userIds ?? []),
    boardIds: MultiselectModel.create(savedFilterSettings?.filter?.boardIds ?? []),
    period: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter?.period?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.to),
    }),
  }));

  const [filter, setFilter] = useState<ScheduleReportFilterDto>(() => ({
    type: reportType,
    scheduleId: scheduleId,
    userIds: filterForm.userIds.valuesOrUndefined,
    period: getCreatedAtFilter(filterForm.period),
    boardIds: filterForm.boardIds.valuesOrUndefined,
  }));

  const { data: scheduleReport, isLoading, isRefetching } = useGetScheduleReport(filter);

  const data = useGetScheduleReportTableData({ reportType, scheduleReport });
  const columns = useGetScheduleReportColumns(reportType);

  const { columnVisibility, setColumnVisibility } = useSaveReportColumnsVisibility<
    ScheduleReportType,
    ScheduleReportFilterDto
  >({
    settings,
    reportType,
    id: scheduleId,
    savedFilterSettings,
  });

  const table = useGetReportTable<ScheduleReportSyntheticRow>({
    data,
    columns,
    columnVisibility,
    setColumnVisibility,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleApplyFilter = useCallback(
    debounce(() => {
      const filter = new ScheduleReportFilterDto({
        type: reportType,
        scheduleId: scheduleId,
        period: getCreatedAtFilter(filterForm.period),
        userIds: filterForm.userIds.values,
        boardIds: filterForm.boardIds.values,
      });

      const savedFilters = settings.filters ?? [];

      settings.filters = savedFilters.map(s =>
        s.reportType === reportType && s.id === scheduleId
          ? {
              filter,
              reportType,
              id: scheduleId,
              columnVisibility: s.columnVisibility,
            }
          : s
      );

      setFilter(filter);
    }, 500),
    [
      scheduleId,
      reportType,
      scheduleId,
      filterForm.period,
      filterForm.boardIds.values,
      filterForm.userIds.values,
    ]
  );

  return (
    <ReportRootTemplate
      table={table}
      refetching={isRefetching}
      sidebarShown={sidebarShown}
      settingsButtonRef={settingsButtonRef}
      settingsDrawerOpened={settingsDrawerOpened}
      Table={<ReportTable allHeadersSecondary loading={isLoading} table={table} />}
      Filters={
        <>
          {reportType !== ScheduleReportType.DEPARTMENT && (
            <UsersMultiselect
              withinPortal
              model={filterForm.userIds}
              users={userStore.activeUsers}
              placeholder={t('placeholders.users')}
              variant="outlined-without-active-shadow"
              titleWidth="var(--report-filter-select-width)"
              handleChange={handleApplyFilter}
            />
          )}

          {boardOptions.length > 0 && (
            <MultiselectWithCheckboxes
              withinPortal
              options={boardOptions}
              dropdownMinWidth="240px"
              model={filterForm.boardIds}
              variant="outlined-without-active-shadow"
              width="var(--report-filter-select-width)"
              placeholder={t('placeholders.pipeline')}
              handleChange={handleApplyFilter}
            />
          )}

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

export { ScheduleReportTemplate };

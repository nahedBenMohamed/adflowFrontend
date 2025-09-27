import { SettingsStore, boardApiUtil, userStore } from '@/app';
import { getCreatedAtFilter } from '@/modules/section';
import {
  CreatedAtDateSelect,
  DatePeriodFilterModel,
  DatePeriodFilterType,
  MultiselectModel,
  MultiselectWithCheckboxes,
  MySelect,
  SelectModel,
  UsersMultiselect,
  UtcDate,
  debounce,
  type Optional,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TelephonyReportFilterDto, useGetTelephonyReport } from '../../../api';
import {
  ReportStageType,
  TelephonyReportType,
  useGenerateStageOptions,
  useGetReportTable,
  useGetTelephonyReportColumns,
  useGetTelephonyReportTableData,
  useSaveReportColumnsVisibility,
  type DurationFilterSelectModel,
  type ReportFilterSettings,
  type ReportTemplateProps,
  type TelephonyReportSyntheticRow,
} from '../../../shared';
import { TimePickerGroup } from '../CallHistoryReportTemplate/components';
import { ReportRootTemplate, ReportTable } from '../components';

interface FilterForm {
  userIds: MultiselectModel<number>;
  boardIds: MultiselectModel<number>;
  period: DatePeriodFilterModel;
  duration: DurationFilterSelectModel;
  stageType: SelectModel;
}

const TELEPHONY_REPORT_FILTER_SETTINGS_KEY = 'TelephonyReportFilterSettings';

const { settings } = SettingsStore.getSettingsStore<{
  filters: ReportFilterSettings<TelephonyReportType, TelephonyReportFilterDto>[];
}>(TELEPHONY_REPORT_FILTER_SETTINGS_KEY);

if (!settings.filters) settings.filters = [];

interface Props extends ReportTemplateProps<TelephonyReportType> {
  entityTypeId: number;
}

const TelephonyReportTemplate = observer((props: Props) => {
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

  const savedFilterSettings = useMemo<
    Optional<ReportFilterSettings<TelephonyReportType, TelephonyReportFilterDto>>
  >(
    () =>
      settings.filters
        ? settings.filters.find(s => s.id === entityTypeId && s.reportType === reportType)
        : undefined,
    [entityTypeId, reportType]
  );

  const filterForm = useLocalObservable<FilterForm>(() => ({
    userIds: MultiselectModel.create(savedFilterSettings?.filter?.userIds ?? []),
    boardIds: MultiselectModel.create(savedFilterSettings?.filter?.boardIds ?? []),
    period: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter?.period?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.to),
    }),
    duration: {
      min: SelectModel.create(savedFilterSettings?.filter?.duration?.min ?? null),
      max: SelectModel.create(savedFilterSettings?.filter?.duration?.max ?? null),
    },
    stageType: SelectModel.create(savedFilterSettings?.filter?.stageType ?? ReportStageType.ALL),
  }));

  const [filter, setFilter] = useState<TelephonyReportFilterDto>(() => ({
    entityTypeId,
    type: reportType,
    userIds: filterForm.userIds.valuesOrUndefined,
    boardIds: filterForm.boardIds.valuesOrUndefined,
    stageType: filterForm.stageType.value,
    period: getCreatedAtFilter(filterForm.period),
    duration: { min: filterForm.duration.min.value, max: filterForm.duration.max.value },
  }));

  const stageOptions = useGenerateStageOptions();

  const { data: telephonyReport, isLoading, isRefetching } = useGetTelephonyReport(filter);

  const data = useGetTelephonyReportTableData({ reportType, telephonyReport });
  const columns = useGetTelephonyReportColumns({ reportType });

  const { columnVisibility, setColumnVisibility } = useSaveReportColumnsVisibility<
    TelephonyReportType,
    TelephonyReportFilterDto
  >({
    id: entityTypeId,
    settings,
    reportType,
    savedFilterSettings,
  });

  const table = useGetReportTable<TelephonyReportSyntheticRow>({
    data,
    columns,
    columnVisibility,
    setColumnVisibility,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleApplyFilter = useCallback(
    debounce(() => {
      const period = getCreatedAtFilter(filterForm.period);

      const filter = new TelephonyReportFilterDto({
        entityTypeId,
        period,
        type: reportType,
        userIds: filterForm.userIds.values,
        boardIds: filterForm.boardIds.values,
        stageType: filterForm.stageType.value,
        duration: { min: filterForm.duration.min.value, max: filterForm.duration.max.value },
      });

      const savedFilters = settings.filters ?? [];

      settings.filters = savedFilters.map<
        ReportFilterSettings<TelephonyReportType, TelephonyReportFilterDto>
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
    [filterForm, reportType, entityTypeId]
  );

  const boardsOptions = boardApiUtil.useGetBoardsByEntityTypeIdOptions(entityTypeId);

  return (
    <ReportRootTemplate
      table={table}
      refetching={isRefetching}
      sidebarShown={sidebarShown}
      settingsButtonRef={settingsButtonRef}
      settingsDrawerOpened={settingsDrawerOpened}
      Table={<ReportTable loading={isLoading} table={table} />}
      Filters={
        <>
          {reportType !== TelephonyReportType.TELEPHONY_GROUPS && (
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

          <MySelect
            withinPortal
            options={stageOptions}
            model={filterForm.stageType}
            variant="outlined-without-active-shadow"
            width="var(--report-filter-select-width)"
            placeholder={t('placeholders.stage')}
            handleChangeOption={handleApplyFilter}
          />

          <TimePickerGroup model={filterForm.duration} handleApplyFilter={handleApplyFilter} />
        </>
      }
      toggleSidebar={toggleSidebar}
      hideSettingsDrawer={hideSettingsDrawer}
    />
  );
});

export { TelephonyReportTemplate };

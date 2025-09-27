import { SettingsStore, stageApiUtil, userStore } from '@/app';
import { useGetProjectTaskBoardId } from '@/modules/card';
import { useGetProjectTaskUserReportColumns } from '@/modules/reporting';
import { getCreatedAtFilter } from '@/modules/section';
import {
  CommonQueryParams,
  CreatedAtDateSelect,
  DatePeriodFilterModel,
  DatePeriodFilterType,
  MultiselectModel,
  MultiselectWithCheckboxes,
  UsersMultiselect,
  UtcDate,
  debounce,
  type Option,
  type Stage,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ProjectTaskUserReportFilterDto, useGetTaskUserReport } from '../../../api';
import {
  useGetProjectTaskUserReportTableData,
  useGetReportTable,
  useSaveReportColumnsVisibility,
  type ProjectReportType,
  type ProjectTaskUserReportSyntheticRow,
  type ReportFilterSettings,
  type ReportTemplateProps,
} from '../../../shared';
import { ReportRootTemplate, ReportTable } from '../components';

interface FilterForm {
  taskUserIds: MultiselectModel<number>;
  period: DatePeriodFilterModel;
  taskBoardStageIds: MultiselectModel<number>;
}

const PROJECTS_REPORT_FILTER_SETTINGS_KEY = 'ProjectsTaskUserReportFilterSettings';

const { settings } = SettingsStore.getSettingsStore<{
  filters: ReportFilterSettings<ProjectReportType, ProjectTaskUserReportFilterDto>[];
}>(PROJECTS_REPORT_FILTER_SETTINGS_KEY);

if (!settings.filters) settings.filters = [];

const generateProjectStageOptions = (stages?: Stage[]): Option<number>[] => {
  return stages
    ? stages.map(s => ({
        label: s.name,
        value: s.id,
      }))
    : [];
};

interface Props extends ReportTemplateProps<ProjectReportType> {
  entityTypeId: number;
}

const ProjectTaskUserReportTemplate = observer((props: Props) => {
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

  const [searchParams] = useSearchParams();

  const section = searchParams.get(CommonQueryParams.SECTION);

  const [boardIdFromParams, entityIdFromParams] = section?.split('_') ?? [];

  const boardId = Number(boardIdFromParams);
  const entityId = entityIdFromParams ? Number(entityIdFromParams) : null;

  if (!boardId) {
    throw new Error(
      `failed to extract boardId from section param ${section}, unable to render ProjectTaskUserReportTemplate.`
    );
  }

  const taskBoardId = useGetProjectTaskBoardId(boardId);
  const { data: stages, isLoading: areStagesLoading } = stageApiUtil.useGetStagesByBoardId({
    boardId: taskBoardId,
  });

  const stagesIds = stages ? stages.map(s => s.id) : [];
  const stageOptions = generateProjectStageOptions(stages);

  const savedFilterSettings = useMemo(
    () =>
      settings.filters
        ? settings.filters.find(s => s.id === entityTypeId && s.reportType === reportType)
        : undefined,
    [entityTypeId, reportType]
  );

  const filterForm = useLocalObservable<FilterForm>(() => ({
    taskUserIds: MultiselectModel.create(savedFilterSettings?.filter?.taskUserIds ?? []),
    period: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter?.period?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.to),
    }),
    taskBoardStageIds: MultiselectModel.create(
      savedFilterSettings?.filter?.taskBoardStageIds ?? []
    ),
  }));

  const [filter, setFilter] = useState<ProjectTaskUserReportFilterDto>(() => ({
    boardId,
    entityId,
    taskUserIds: filterForm.taskUserIds.valuesOrUndefined,
    taskBoardStageIds: filterForm.taskBoardStageIds.valuesOrUndefined?.length
      ? filterForm.taskBoardStageIds.valuesOrUndefined
      : stagesIds,
    period: getCreatedAtFilter(filterForm.period),
  }));

  const filteredStages = (stages?: Stage[]): Stage[] => {
    if (!filter.taskBoardStageIds?.length) return stages || [];

    return stages ? stages.filter(s => filter.taskBoardStageIds?.includes(s.id)) : [];
  };

  const { data: projectTaskUserReport, isLoading, isRefetching } = useGetTaskUserReport(filter);

  const data = useGetProjectTaskUserReportTableData(projectTaskUserReport);
  const columns = useGetProjectTaskUserReportColumns(filteredStages(stages));

  const { columnVisibility, setColumnVisibility } = useSaveReportColumnsVisibility<
    ProjectReportType,
    ProjectTaskUserReportFilterDto
  >({
    settings,
    reportType,
    id: entityTypeId,
    savedFilterSettings,
  });

  const table = useGetReportTable<ProjectTaskUserReportSyntheticRow>({
    data,
    columns,
    columnVisibility,
    setColumnVisibility,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleApplyFilter = useCallback(
    debounce(() => {
      const period = getCreatedAtFilter(filterForm.period);

      const filter = new ProjectTaskUserReportFilterDto({
        boardId,
        entityId,
        taskBoardStageIds: filterForm.taskBoardStageIds.values,
        taskUserIds: filterForm.taskUserIds.values,
        period,
      });

      const savedFilters = settings.filters ?? [];

      settings.filters = savedFilters.map(s =>
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
      filterForm.period,
      filterForm.taskBoardStageIds.values,
      filterForm.taskUserIds.values,
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
          <UsersMultiselect
            withinPortal
            users={userStore.activeUsers}
            model={filterForm.taskUserIds}
            placeholder={t('placeholders.users')}
            variant="outlined-without-active-shadow"
            titleWidth="var(--report-filter-select-width)"
            handleChange={handleApplyFilter}
          />

          <MultiselectWithCheckboxes
            withinPortal
            options={stageOptions}
            dropdownMinWidth="240px"
            loading={areStagesLoading}
            model={filterForm.taskBoardStageIds}
            variant="outlined-without-active-shadow"
            width="var(--report-filter-select-width)"
            placeholder={t('placeholders.stage')}
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

export { ProjectTaskUserReportTemplate };

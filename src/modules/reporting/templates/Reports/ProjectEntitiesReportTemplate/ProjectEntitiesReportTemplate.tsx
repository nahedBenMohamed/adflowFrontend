import { SettingsStore, stageApiUtil, userStore } from '@/app';
import { useGetProjectTaskBoardId } from '@/modules/card';
import { getCreatedAtFilter } from '@/modules/section';
import {
  CommonQueryParams,
  CreatedAtDateSelect,
  DatePeriodFilterModel,
  DatePeriodFilterType,
  MultiselectModel,
  MultiselectWithCheckboxes,
  UriCodingUtil,
  UsersMultiselect,
  UtcDate,
  debounce,
  type Option,
  type Optional,
  type Stage,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import { ProjectEntitiesReportFilterDto, useGetProjectEntitiesReport } from '../../../api';
import {
  useGetProjectEntitiesReportColumns,
  useGetProjectEntitiesReportTableData,
  useGetReportTable,
  useSaveReportColumnsVisibility,
  type ProjectEntitiesReportSyntheticRow,
  type ProjectReportType,
  type ReportFilterSettings,
  type ReportTemplateProps,
} from '../../../shared';
import { ReportRootTemplate, ReportTable } from '../components';

interface FilterForm {
  ownerIds: MultiselectModel<number>;
  period: DatePeriodFilterModel;
  taskBoardStageIds: MultiselectModel<number>;
}

const PROJECTS_ENTITIES_REPORT_SETTINGS_KEY = 'ProjectsEntitiesReportFilterSettings';

const { settings } = SettingsStore.getSettingsStore<{
  filters: ReportFilterSettings<ProjectReportType, ProjectEntitiesReportFilterDto>[];
}>(PROJECTS_ENTITIES_REPORT_SETTINGS_KEY);

if (!settings.filters) {
  settings.filters = [];
}

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

const ProjectEntitiesReportTemplate = observer((props: Props) => {
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
  let boardId = Number(section);

  if (!boardId)
    throw new Error(
      `failed to extract boardId from section param ${boardId}, unable to render ProjectEntitiesReportTemplate.`
    );

  const taskBoardId = useGetProjectTaskBoardId(boardId);
  const { data: stages, isLoading: areStagesLoading } = stageApiUtil.useGetStagesByBoardId({
    boardId: taskBoardId,
  });

  const stagesIds = stages ? stages.map(s => s.id) : [];
  const stageOptions = generateProjectStageOptions(stages);

  const savedFilterSettings = useMemo<
    Optional<ReportFilterSettings<ProjectReportType, ProjectEntitiesReportFilterDto>>
  >(
    () =>
      settings.filters
        ? settings.filters.find(s => s.id === entityTypeId && s.reportType === reportType)
        : undefined,
    [entityTypeId, reportType]
  );

  const filterForm = useLocalObservable<FilterForm>(() => ({
    ownerIds: MultiselectModel.create(savedFilterSettings?.filter?.ownerIds ?? []),
    period: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter?.period?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter?.period?.to),
    }),
    taskBoardStageIds: MultiselectModel.create(
      savedFilterSettings?.filter?.taskBoardStageIds ?? []
    ),
  }));

  const [filter, setFilter] = useState<ProjectEntitiesReportFilterDto>(() => ({
    entityTypeId,
    boardId,
    ownerIds: filterForm.ownerIds.valuesOrUndefined,
    period: getCreatedAtFilter(filterForm.period),
    taskBoardStageIds: filterForm.taskBoardStageIds?.valuesOrUndefined?.length
      ? filterForm.taskBoardStageIds.valuesOrUndefined
      : stagesIds,
  }));

  const filteredStages = (stages?: Stage[]): Stage[] => {
    if (!filter.taskBoardStageIds?.length) return stages ?? [];

    return stages ? stages.filter(s => filter.taskBoardStageIds?.includes(s.id)) : [];
  };

  const {
    data: projectEntitiesReport,
    isLoading,
    isRefetching,
  } = useGetProjectEntitiesReport(filter);

  const { pathname, search } = useLocation();
  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const data = useGetProjectEntitiesReportTableData(projectEntitiesReport);
  const columns = useGetProjectEntitiesReportColumns({
    entityTypeId,
    currentPageEncodedUrl,
    projectEntitiesReport,
    stages: filteredStages(stages),
  });

  const { columnVisibility, setColumnVisibility } = useSaveReportColumnsVisibility<
    ProjectReportType,
    ProjectEntitiesReportFilterDto
  >({
    settings,
    reportType,
    id: entityTypeId,
    savedFilterSettings,
  });

  const table = useGetReportTable<ProjectEntitiesReportSyntheticRow>({
    data,
    columns,
    columnVisibility,
    setColumnVisibility,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleApplyFilter = useCallback(
    debounce(() => {
      const period = getCreatedAtFilter(filterForm.period);

      const filter = new ProjectEntitiesReportFilterDto({
        entityTypeId,
        boardId,
        taskBoardStageIds: filterForm.taskBoardStageIds.values,
        period,
        ownerIds: filterForm.ownerIds.values,
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
      filterForm.ownerIds.values,
      filterForm.taskBoardStageIds.values,
    ]
  );

  return (
    <ReportRootTemplate
      table={table}
      refetching={isRefetching}
      sidebarShown={sidebarShown}
      settingsButtonRef={settingsButtonRef}
      settingsDrawerOpened={settingsDrawerOpened}
      Table={<ReportTable withoutTotal table={table} loading={isLoading} allHeadersSecondary />}
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
            loading={areStagesLoading}
            model={filterForm.taskBoardStageIds}
            variant="outlined-without-active-shadow"
            width="var(--report-filter-select-width)"
            placeholder={t('placeholders.stage')}
            options={stageOptions}
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

ProjectEntitiesReportTemplate.displayName = 'ProjectEntitiesReportTemplate';
export { ProjectEntitiesReportTemplate };

import { SettingsStore, boardApiUtil, entityTypeStore, userStore } from '@/app';
import { authStore } from '@/modules/auth';
import { getCreatedAtFilter } from '@/modules/section';
import {
  ApplyToAllButton,
  CreatedAtDateSelect,
  DatePeriodFilterModel,
  DatePeriodFilterType,
  MultiselectModel,
  MultiselectWithCheckboxes,
  MySelect,
  PrimaryButton,
  SelectModel,
  UsersMultiselect,
  UtcDate,
  debounce,
  type FrontendObject,
  type Nullable,
  type Optional,
} from '@/shared';
import type { T } from '@fullcalendar/core/internal-common';
import { useDisclosure } from '@mantine/hooks';
import type { Column } from '@tanstack/react-table';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import {
  GeneralReportFilterDto,
  GeneralReportFilterVisibilityCallDto,
  GeneralReportFilterVisibilityDto,
  GeneralReportFilterVisibilityEntityDto,
  GeneralReportFilterVisibilityFieldDto,
  GeneralReportFilterVisibilityFieldOptionDto,
  GeneralReportFilterVisibilityFieldsDto,
  GeneralReportFilterVisibilityTaskDto,
  useGetGeneralReport,
} from '../../../api';
import {
  GeneralReportColumnMetaType,
  GeneralReportColumnsIds,
  GeneralReportSettings,
  GeneralReportType,
  OWNER_FIELDS_RESPONSIBLE_VALUE,
  ReportStageType,
  ReportsColumnsIds,
  extractOptionIdFromColumnId,
  useGenerateStageOptions,
  useGetGeneralReportColumns,
  useGetGeneralReportTableData,
  useGetOwnerFieldsFilterOptions,
  useGetReportTable,
  useSaveReportColumnsVisibility,
  type GeneralReportColumnMeta,
  type GeneralReportSyntheticRow,
  type ReportFilterSettings,
  type ReportTemplateProps,
} from '../../../shared';
import { GeneralReportTemplateSettingsStore } from '../../../store';
import { ReportRootTemplate, ReportTable } from '../components';

const Controls = styled.div<{ $disabled: boolean }>`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  ${p =>
    p.$disabled &&
    css`
      cursor: wait;

      opacity: 0.6;

      * {
        pointer-events: none;
      }
    `}
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
`;

interface FilterForm {
  userIds: MultiselectModel<number>;
  boardIds: MultiselectModel<number>;
  period: DatePeriodFilterModel;
  stageType: SelectModel;
  ownerFieldId: SelectModel;
}

const GENERAL_REPORT_FILTER_SETTINGS_KEY = 'GeneralReportFilterSettings';

type GeneralReportTemplateFilterSettings = ReportFilterSettings<
  GeneralReportType,
  GeneralReportFilterDto
>;

const { settings } = SettingsStore.getSettingsStore<{
  filters: GeneralReportTemplateFilterSettings[];
}>(GENERAL_REPORT_FILTER_SETTINGS_KEY);

if (!settings.filters) settings.filters = [];

interface Props extends ReportTemplateProps<GeneralReportType> {
  entityTypeId: number;
}

const GeneralReportTemplate = observer((props: Props) => {
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

  const savedFilterSettingsFromLS = useMemo<Optional<GeneralReportTemplateFilterSettings>>(
    () =>
      settings.filters
        ? settings.filters.find(s => s.id === entityTypeId && s.reportType === reportType)
        : undefined,
    [entityTypeId, reportType]
  );

  const filterForm = useLocalObservable<FilterForm>(() => ({
    userIds: MultiselectModel.create(savedFilterSettingsFromLS?.filter?.userIds ?? []),
    boardIds: MultiselectModel.create(savedFilterSettingsFromLS?.filter?.boardIds ?? []),
    period: new DatePeriodFilterModel({
      type: savedFilterSettingsFromLS?.filter?.period?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettingsFromLS?.filter?.period?.from),
      to: UtcDate.parseISONullable(savedFilterSettingsFromLS?.filter?.period?.to),
    }),
    stageType: SelectModel.create(
      savedFilterSettingsFromLS?.filter?.stageType ?? ReportStageType.ALL
    ),
    ownerFieldId: SelectModel.create(
      savedFilterSettingsFromLS?.filter?.ownerFieldId ?? OWNER_FIELDS_RESPONSIBLE_VALUE
    ),
  }));

  const stageOptions = useGenerateStageOptions();

  const entityType = entityTypeStore.getById(entityTypeId);

  const [filter, setFilter] = useState<GeneralReportFilterDto>(() => ({
    type: reportType,
    entityTypeId: entityTypeId,
    userIds: filterForm.userIds.values,
    boardIds: filterForm.boardIds.values,
    stageType: filterForm.stageType.value,
    period: getCreatedAtFilter(filterForm.period),
    visibility: savedFilterSettingsFromLS?.filter?.visibility,
    ownerFieldId:
      // this value is used for UI purposes only, we need to send null to backend if it's responsible option
      filterForm.ownerFieldId.value === OWNER_FIELDS_RESPONSIBLE_VALUE
        ? null
        : filterForm.ownerFieldId.value,
  }));

  const { data: generalReport, isLoading, isRefetching } = useGetGeneralReport(filter);

  const data = useGetGeneralReportTableData({ reportType, generalReport });
  const columns = useGetGeneralReportColumns({
    reportType,
    entityType,
    generalReport,
    stageType: filterForm.stageType.value,
  });

  const { columnVisibility, setColumnVisibility } = useSaveReportColumnsVisibility<
    GeneralReportType,
    GeneralReportFilterDto
  >({
    settings,
    reportType,
    id: entityTypeId,
    savedFilterSettings: savedFilterSettingsFromLS,
  });

  const table = useGetReportTable<GeneralReportSyntheticRow>({
    data,
    columns,
    columnVisibility,
    setColumnVisibility,
  });

  const [isApplyWarningOpened, { close: hideApplyWarning, open: showApplyWarning }] =
    useDisclosure(false);

  const generalReportTemplateSettingsStore = useMemo(
    () =>
      new GeneralReportTemplateSettingsStore({
        entityTypeId,
        reportType,
      }),
    [reportType, entityTypeId]
  );

  const {
    settingsFrontendObject: tableSettingsFromBackend,
    isLoaded: tableSettingsFromBackendLoaded,
    isUpdating: updatingBackendTableSettings,
    upsertSettings: upsertBackendTableSettings,
  } = generalReportTemplateSettingsStore;

  useEffect(() => {
    generalReportTemplateSettingsStore.loadData();
  }, [generalReportTemplateSettingsStore]);

  const handleGenerateVisibilityFilter = useCallback(() => {
    const filteredColumns = table.getAllColumns().filter(gc => gc.id !== ReportsColumnsIds.TITLE);

    const shouldExcludeColumn = (id: Column<GeneralReportSyntheticRow>['id']): boolean =>
      !(filteredColumns.find(c => c.id === id)?.getIsVisible() || false);

    const shouldExcludeSubColumn = (id: Column<T>['id']): boolean =>
      !(
        filteredColumns
          .flatMap(c => c.columns)
          .find(c => c.id === id)
          ?.getIsVisible() || false
      );

    const fieldsColumns = filteredColumns.filter(
      c =>
        (c.columnDef.meta as Optional<GeneralReportColumnMeta>)?.type ===
        GeneralReportColumnMetaType.FIELD
    );

    const entityVisibility = new GeneralReportFilterVisibilityEntityDto({
      exclude: shouldExcludeColumn(GeneralReportColumnsIds.CARDS),
      excludeOpen: shouldExcludeSubColumn(ReportStageType.OPEN),
      excludeLost: shouldExcludeSubColumn(ReportStageType.LOST),
      excludeWon: shouldExcludeSubColumn(ReportStageType.WON),
    });

    const taskVisibility = new GeneralReportFilterVisibilityTaskDto({
      exclude: shouldExcludeColumn(GeneralReportColumnsIds.TASKS),
      excludeOpen: shouldExcludeSubColumn(GeneralReportColumnsIds.TASKS_OPEN),
      excludeExpired: shouldExcludeSubColumn(GeneralReportColumnsIds.TASKS_EXPIRED),
      excludeResolved: shouldExcludeSubColumn(GeneralReportColumnsIds.TASKS_RESOLVED),
    });

    const activityVisibility = new GeneralReportFilterVisibilityTaskDto({
      exclude: shouldExcludeColumn(GeneralReportColumnsIds.ACTIVITIES),
      excludeOpen: shouldExcludeSubColumn(GeneralReportColumnsIds.ACTIVITIES_OPEN),
      excludeExpired: shouldExcludeSubColumn(GeneralReportColumnsIds.ACTIVITIES_EXPIRED),
      excludeResolved: shouldExcludeSubColumn(GeneralReportColumnsIds.ACTIVITIES_RESOLVED),
    });

    const fieldsVisibility = new GeneralReportFilterVisibilityFieldsDto({
      exclude: fieldsColumns.every(fc => shouldExcludeColumn(fc.id)),
      fields: fieldsColumns.map<GeneralReportFilterVisibilityFieldDto>(fc => {
        const excludeColumn = shouldExcludeColumn(fc.id);

        return new GeneralReportFilterVisibilityFieldDto({
          exclude: excludeColumn,
          fieldId: Number(fc.id),
          options: fc.columns
            .filter(
              c =>
                (c.columnDef.meta as GeneralReportColumnMeta)?.type ===
                GeneralReportColumnMetaType.VALUE
            )
            .map(
              c =>
                new GeneralReportFilterVisibilityFieldOptionDto({
                  optionId: extractOptionIdFromColumnId(c.id),
                  // if parent column is excluded, then all its children are excluded too
                  exclude: excludeColumn ? true : shouldExcludeSubColumn(c.id),
                })
            ),
        });
      }),
    });

    const callVisibility = new GeneralReportFilterVisibilityCallDto({
      exclude: shouldExcludeColumn(GeneralReportColumnsIds.CALLS),
    });

    return new GeneralReportFilterVisibilityDto({
      entity: entityVisibility,
      task: taskVisibility,
      activity: activityVisibility,
      fields: fieldsVisibility,
      call: callVisibility,
    });
  }, [table]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleApplyFilter = useCallback(
    debounce(() => {
      const visibility = handleGenerateVisibilityFilter();
      const period = getCreatedAtFilter(filterForm.period);

      const filter = new GeneralReportFilterDto({
        period,
        entityTypeId,
        type: reportType,
        userIds: filterForm.userIds.values,
        boardIds: filterForm.boardIds.values,
        stageType: filterForm.stageType.value,
        ownerFieldId:
          filterForm.ownerFieldId.value === OWNER_FIELDS_RESPONSIBLE_VALUE
            ? null
            : filterForm.ownerFieldId.value,
        visibility,
      });

      const savedFilters = settings.filters ?? [];

      settings.filters = savedFilters.map(s =>
        s.reportType === reportType && s.id === entityTypeId
          ? {
              id: entityTypeId,
              filter,
              reportType,
              columnVisibility: s.columnVisibility,
              updatedAt: UtcDate.nowISO(),
            }
          : s
      );

      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setFilter(filter);
    }, 500),
    [
      reportType,
      entityTypeId,
      filterForm.period,
      filterForm.boardIds.values,
      filterForm.userIds.values,
      filterForm.stageType.value,
    ]
  );

  useEffect(() => {
    const gotSettingsFromBackend =
      tableSettingsFromBackendLoaded &&
      tableSettingsFromBackend &&
      tableSettingsFromBackend.value.settings;

    const areSettingsFromBackendNewer = ({
      tableSettingsFromBackend,
      savedFilterSettingsFromLS,
    }: {
      tableSettingsFromBackend: FrontendObject<GeneralReportSettings>;
      savedFilterSettingsFromLS: Nullable<GeneralReportTemplateFilterSettings>;
    }): boolean => {
      // old accounts might not have updatedAt field or this field can be of an object type, so we need to check for it
      if (!savedFilterSettingsFromLS || typeof savedFilterSettingsFromLS.updatedAt !== 'string')
        return true;

      return tableSettingsFromBackend.createdAt.greaterThan(
        UtcDate.parseISO(savedFilterSettingsFromLS.updatedAt)
      );
    };

    // if we have settings in storage but we've also got settings from backend, we need to check
    // whether our last local update was before the last update from backend, if not - we need to update our local settings
    if (
      gotSettingsFromBackend &&
      areSettingsFromBackendNewer({
        tableSettingsFromBackend,
        savedFilterSettingsFromLS: savedFilterSettingsFromLS ?? null,
      })
    ) {
      const visibilityFromBackend = tableSettingsFromBackend.value.settings.columnVisibility;

      // we only want to update visibility
      if (savedFilterSettingsFromLS) {
        savedFilterSettingsFromLS.columnVisibility = visibilityFromBackend;
        savedFilterSettingsFromLS.updatedAt = UtcDate.nowISO();
      }

      setColumnVisibility(visibilityFromBackend);
      handleApplyFilter();

      return;
    }
  }, [
    entityTypeId,
    tableSettingsFromBackend,
    savedFilterSettingsFromLS,
    tableSettingsFromBackendLoaded,
    generalReportTemplateSettingsStore,
    handleApplyFilter,
    setColumnVisibility,
  ]);

  const handleResetColumnVisibilitySettings = useCallback(() => {
    table.resetColumnVisibility();
    handleApplyFilter();
  }, [table, handleApplyFilter]);

  const boardsOptions = boardApiUtil.useGetBoardsByEntityTypeIdOptions(entityTypeId);
  const loadingOrRefetching = isLoading || isRefetching;

  const handleUpdateBackendTableSettings = useCallback(async (): Promise<void> => {
    const dto = new GeneralReportSettings({
      settings: {
        // we only want to sync visibility
        columnVisibility,
      },
    });

    try {
      await upsertBackendTableSettings(dto);

      handleApplyFilter();
    } catch (e) {
      throw new Error(`Failed to apply general report table settings for all users: ${e}`);
    } finally {
      hideApplyWarning();
    }
  }, [columnVisibility, hideApplyWarning, handleApplyFilter, upsertBackendTableSettings]);

  const ownerFieldOptions = useGetOwnerFieldsFilterOptions(entityTypeStore.getById(entityTypeId));

  return (
    <ReportRootTemplate
      table={table}
      refetching={isRefetching}
      sidebarShown={sidebarShown}
      settingsButtonRef={settingsButtonRef}
      settingsDrawerOpened={settingsDrawerOpened}
      Table={<ReportTable loading={isLoading} table={table} />}
      ReportSettingsDrawerControls={
        <Controls $disabled={loadingOrRefetching}>
          {authStore.isAdmin() ? (
            <ApplyToAllButton
              isApplyWarningOpened={isApplyWarningOpened}
              isApproveLoading={updatingBackendTableSettings}
              onClick={showApplyWarning}
              onClose={hideApplyWarning}
              onApprove={handleUpdateBackendTableSettings}
            />
          ) : (
            // For template persistence
            <div />
          )}

          <ControlsGroup>
            <PrimaryButton onClick={handleApplyFilter}>{t('apply_filter')}</PrimaryButton>

            <PrimaryButton variant="empty" onClick={handleResetColumnVisibilitySettings}>
              {t('reset')}
            </PrimaryButton>
          </ControlsGroup>
        </Controls>
      }
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

          {reportType !== GeneralReportType.DEPARTMENT && (
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
            options={boardsOptions}
            dropdownMinWidth="240px"
            model={filterForm.boardIds}
            variant="outlined-without-active-shadow"
            placeholder={t('placeholders.pipeline')}
            width="var(--report-filter-select-width)"
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
            placeholder={t('placeholders.stage')}
            variant="outlined-without-active-shadow"
            width="var(--report-filter-select-width)"
            handleChangeOption={handleApplyFilter}
          />
        </>
      }
      toggleSidebar={toggleSidebar}
      hideSettingsDrawer={hideSettingsDrawer}
    />
  );
});

GeneralReportTemplate.displayName = 'GeneralReportTemplate';
export { GeneralReportTemplate };

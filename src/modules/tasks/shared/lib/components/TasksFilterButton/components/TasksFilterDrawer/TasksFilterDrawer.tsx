import { authStore } from '@/modules/auth';
import { getCreatedAtFilter } from '@/modules/section';
import {
  CreatedAtDateSelect,
  DatePeriodFilterModel,
  DatePeriodFilterType,
  FilterDelimiter,
  FilterDrawerTemplate,
  FilterItemWrapper,
  FilterItemsBlock,
  MultiselectModel,
  MultiselectWithCheckboxes,
  MyMultiselectColored,
  MySelect,
  MySwitch,
  ParticipantsSelectWithCreateButton,
  SelectModel,
  UtcDate,
  debounce,
  throttle,
  type EntityInfo,
  type Nullable,
  type Optional,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { getTasksFinalSortingValue } from '../../../../helpers';
import { useGetAllTasksFilterOptions } from '../../../../hooks';
import {
  BaseTaskBoardFilter,
  TaskSorting,
  TasksFilterType,
  type ActivityCardsFilter,
  type DeadlineType,
  type TaskBoardFilter,
  type TaskFilterDrawerAsyncStateProps,
  type TasksCardsFilterSettings,
  type TimeBoardFilter,
} from '../../../../models';
import { TaskEntitiesSearchBlock } from '../TaskEntitiesSearchBlock/TaskEntitiesSearchBlock';

interface Props {
  buttonRef: RefObject<HTMLButtonElement | null>;
  opened: boolean;
  filter: TaskBoardFilter;
  settings: {
    filters: TasksCardsFilterSettings[];
  };
  filterType: TasksFilterType;
  boardId: Nullable<number>;
  asyncStateProps: TaskFilterDrawerAsyncStateProps;
  hideEntitiesSearchBlock?: boolean;
  hide: () => void;
}

interface InitialForm {
  search: string;
  justMyCards: boolean;
  saveFilterSettings: boolean;
  showResolved: boolean;
  sorting: SelectModel;
  createdAt: DatePeriodFilterModel;
  startDate: DatePeriodFilterModel;
  endDate: DatePeriodFilterModel;
  resolvedDate: DatePeriodFilterModel;
  ownerIds: MultiselectModel<number>;
  createdBy: MultiselectModel<number>;
  entityInfos: EntityInfo[];
  typeIds: MultiselectModel<number>;
  stageIds: MultiselectModel<number>;
  groups: MultiselectModel<DeadlineType>;
}

const TasksFilterDrawer = observer((props: Props) => {
  const {
    buttonRef,
    opened,
    filter,
    filterType,
    boardId,
    settings,
    asyncStateProps,
    hideEntitiesSearchBlock = false,
    hide,
  } = props;

  const { filterClearing, hasError, applyFilter, clearFilter } = asyncStateProps;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.common.ui.tasks_filter_drawer',
  });

  let savedFilterSettings: Optional<TasksCardsFilterSettings> = settings.filters
    ? settings.filters.find(s => s.filterType === filterType && s.boardId === boardId)
    : undefined;

  const currentUser = authStore.user;

  const isActivityFilterType = filterType === TasksFilterType.ACTIVITY_CARDS_FILTER;
  const isTimeBoardFilterType = filterType === TasksFilterType.TIME_BOARD_FILTER;
  const isTaskBoardFilterType = filterType === TasksFilterType.TASK_BOARD_FILTER;

  const initialForm: InitialForm = {
    search: savedFilterSettings?.filter.search ?? '',
    justMyCards: savedFilterSettings?.justMyCards ?? false,
    showResolved: savedFilterSettings?.filter.showResolved ?? filter.showResolved ?? true,
    saveFilterSettings: savedFilterSettings?.saveFilterSettings ?? true,
    sorting: SelectModel.create(savedFilterSettings?.filter.sorting ?? TaskSorting.MANUAL),
    createdAt: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter.createdAt?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter.createdAt?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter.createdAt?.to),
    }),
    startDate: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter.startDate?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter.startDate?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter.startDate?.to),
    }),
    endDate: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter.endDate?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter.endDate?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter.endDate?.to),
    }),
    resolvedDate: new DatePeriodFilterModel({
      type: savedFilterSettings?.filter.resolvedDate?.type ?? DatePeriodFilterType.ALL,
      from: UtcDate.parseISONullable(savedFilterSettings?.filter.resolvedDate?.from),
      to: UtcDate.parseISONullable(savedFilterSettings?.filter.resolvedDate?.to),
    }),
    ownerIds: MultiselectModel.create<number>(savedFilterSettings?.filter.ownerIds ?? []),
    createdBy: MultiselectModel.create<number>(savedFilterSettings?.filter.createdBy ?? []),
    entityInfos: savedFilterSettings?.filter.entityInfos ?? [],
    typeIds: MultiselectModel.create<number>(
      isActivityFilterType
        ? ((savedFilterSettings?.filter as ActivityCardsFilter)?.typeIds ?? [])
        : []
    ),
    stageIds: MultiselectModel.create<number>(
      isTaskBoardFilterType
        ? ((savedFilterSettings?.filter as TaskBoardFilter)?.stageIds ?? [])
        : []
    ),
    groups: MultiselectModel.create<DeadlineType>(
      isTimeBoardFilterType ? ((savedFilterSettings?.filter as TimeBoardFilter)?.groups ?? []) : []
    ),
  };

  const form = useLocalObservable(() => initialForm);

  const { sortingOptions, activityTypesOptions, groupsOptions, stagesOptions } =
    useGetAllTasksFilterOptions(boardId);

  const handleApply = async (): Promise<void> => {
    const finalSorting = getTasksFinalSortingValue(form.sorting.value);
    const createdAtFilter = getCreatedAtFilter(form.createdAt);
    const startDateFilter = getCreatedAtFilter(form.startDate);
    const endDateFilter = getCreatedAtFilter(form.endDate);
    const resolvedDateFilter = getCreatedAtFilter(form.resolvedDate);

    const trimmedSearch = form.search.trim();

    const filter = new BaseTaskBoardFilter({
      sorting: finalSorting,
      search: trimmedSearch || undefined,
      showResolved: !form.showResolved ? false : undefined,
      ownerIds: form.ownerIds.valuesOrUndefined,
      createdBy: form.createdBy.valuesOrUndefined,
      entityInfos: form.entityInfos.length ? form.entityInfos : undefined,
      createdAt: createdAtFilter,
      startDate: startDateFilter,
      endDate: endDateFilter,
      resolvedDate: resolvedDateFilter,
    });

    if (filterType === TasksFilterType.TASK_BOARD_FILTER)
      (filter as TaskBoardFilter).stageIds = form.stageIds.values.length
        ? form.stageIds.values
        : undefined;

    if (filterType === TasksFilterType.ACTIVITY_CARDS_FILTER)
      (filter as ActivityCardsFilter).typeIds = form.typeIds.values.length
        ? form.typeIds.values
        : undefined;

    if (filterType === TasksFilterType.TIME_BOARD_FILTER)
      (filter as TimeBoardFilter).groups = form.groups.values.length
        ? form.groups.values
        : undefined;

    const savedFilters = settings.filters ?? [];

    if (form.saveFilterSettings) {
      settings.filters = [
        ...savedFilters.filter(f => f.filterType !== filterType || f.boardId !== boardId),
        {
          filterType,
          boardId: boardId ?? null,
          justMyCards: form.justMyCards,
          saveFilterSettings: form.saveFilterSettings,
          filter,
        },
      ];
    } else {
      settings.filters = [
        ...savedFilters.filter(f => f.filterType !== filterType || f.boardId !== boardId),
        {
          filterType,
          boardId: boardId ?? null,
          justMyCards: false,
          saveFilterSettings: form.saveFilterSettings,
          filter: {},
        },
      ];
    }

    applyFilter(filter);
  };

  const handleClearFilter = useCallback(() => {
    clearFilter();

    form.justMyCards = false;
  }, [clearFilter, form]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedApply = useCallback(debounce(handleApply, 1500), [applyFilter]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledClearFilter = useCallback(throttle(handleClearFilter, 1500), [handleClearFilter]);

  const handleChangeSearch = (value: string) => {
    form.search = value;

    debouncedApply();
  };

  const handleSwitchHideCompleted = () => {
    form.showResolved = !form.showResolved;

    debouncedApply();
  };

  const handleSwitchJustMyCards = () => {
    form.justMyCards = !form.justMyCards;

    if (!currentUser) return;

    if (form.justMyCards) form.ownerIds.setValue([currentUser.id]);

    if (!form.justMyCards && form.ownerIds.values.includes(currentUser.id))
      form.ownerIds.setValue(form.ownerIds.values.filter(id => id !== currentUser.id));

    debouncedApply();
  };

  const handleToggleSaveFilterSettings = () => {
    form.saveFilterSettings = !form.saveFilterSettings;

    debouncedApply();
  };

  const handleClearEntitiesInfos = () => {
    form.entityInfos = [];
  };

  return (
    <FilterDrawerTemplate
      opened={opened}
      buttonRef={buttonRef}
      searchProps={{
        value: form.search,
        placeholder: isActivityFilterType
          ? t('placeholders.search_by_activity_name')
          : t('placeholders.search_by_task_name'),
        handleChange: handleChangeSearch,
      }}
      controlsProps={{
        hasError: hasError,
        filterClearing: filterClearing,
        saveFilterSettings: form.saveFilterSettings,
        onClear: throttledClearFilter,
        handleToggleSaveFilterSettings,
      }}
      hide={hide}
    >
      <FilterItemsBlock>
        <FilterItemWrapper label={t('done')}>
          <MySwitch checked={form.showResolved} onChange={handleSwitchHideCompleted} />
        </FilterItemWrapper>

        <FilterItemWrapper label={t('just_my_tasks')}>
          <MySwitch checked={form.justMyCards} onChange={handleSwitchJustMyCards} />
        </FilterItemWrapper>

        <FilterItemWrapper
          label={t('sorting')}
          clearProps={{
            clearVisible: form.sorting.value !== TaskSorting.MANUAL,
            onClear: () => {
              form.sorting.setValue(TaskSorting.MANUAL);

              debouncedApply();
            },
          }}
        >
          <MySelect
            variant="outlined"
            model={form.sorting}
            options={sortingOptions}
            activeBgColor={form.sorting.value !== TaskSorting.MANUAL}
            handleChange={debouncedApply}
          />
        </FilterItemWrapper>

        {!isTimeBoardFilterType && (
          <>
            <FilterItemWrapper
              label={t('created_at')}
              clearProps={{
                clearVisible: form.createdAt.type !== DatePeriodFilterType.ALL,
                onClear: () => {
                  form.createdAt = new DatePeriodFilterModel({
                    to: null,
                    from: null,
                    type: DatePeriodFilterType.ALL,
                  });

                  debouncedApply();
                },
              }}
            >
              <CreatedAtDateSelect
                withQuarters
                createdAtModel={form.createdAt}
                activeBgColor={form.createdAt.type !== DatePeriodFilterType.ALL}
                handleApply={debouncedApply}
              />
            </FilterItemWrapper>

            <FilterItemWrapper
              label={t('start_date')}
              clearProps={{
                clearVisible: form.startDate.type !== DatePeriodFilterType.ALL,
                onClear: () => {
                  form.startDate = new DatePeriodFilterModel({
                    to: null,
                    from: null,
                    type: DatePeriodFilterType.ALL,
                  });

                  debouncedApply();
                },
              }}
            >
              <CreatedAtDateSelect
                withQuarters
                createdAtModel={form.startDate}
                activeBgColor={form.startDate.type !== DatePeriodFilterType.ALL}
                handleApply={debouncedApply}
              />
            </FilterItemWrapper>

            <FilterItemWrapper
              label={t('end_date')}
              clearProps={{
                clearVisible: form.endDate.type !== DatePeriodFilterType.ALL,
                onClear: () => {
                  form.endDate = new DatePeriodFilterModel({
                    to: null,
                    from: null,
                    type: DatePeriodFilterType.ALL,
                  });

                  debouncedApply();
                },
              }}
            >
              <CreatedAtDateSelect
                withQuarters
                createdAtModel={form.endDate}
                activeBgColor={form.endDate.type !== DatePeriodFilterType.ALL}
                handleApply={debouncedApply}
              />
            </FilterItemWrapper>

            <FilterItemWrapper
              label={t('resolve_date')}
              clearProps={{
                clearVisible: form.resolvedDate.type !== DatePeriodFilterType.ALL,
                onClear: () => {
                  form.resolvedDate = new DatePeriodFilterModel({
                    to: null,
                    from: null,
                    type: DatePeriodFilterType.ALL,
                  });

                  debouncedApply();
                },
              }}
            >
              <CreatedAtDateSelect
                withQuarters
                createdAtModel={form.resolvedDate}
                activeBgColor={form.resolvedDate.type !== DatePeriodFilterType.ALL}
                handleApply={debouncedApply}
              />
            </FilterItemWrapper>
          </>
        )}

        {!hideEntitiesSearchBlock && (
          <TaskEntitiesSearchBlock
            entitiesInfosModel={form.entityInfos}
            handleApply={debouncedApply}
            clearEntitiesInfos={handleClearEntitiesInfos}
          />
        )}
      </FilterItemsBlock>

      <FilterDelimiter />

      <FilterItemsBlock>
        <FilterItemWrapper label={t('assignee')}>
          <ParticipantsSelectWithCreateButton
            model={form.ownerIds}
            maxAvatarCount={2}
            handleChange={() => {
              form.justMyCards = false;

              debouncedApply();
            }}
          />
        </FilterItemWrapper>

        <FilterItemWrapper label={t('reporter')}>
          <ParticipantsSelectWithCreateButton
            model={form.createdBy}
            maxAvatarCount={2}
            handleChange={debouncedApply}
          />
        </FilterItemWrapper>

        {isActivityFilterType && (
          <FilterItemWrapper label={t('type')}>
            <MultiselectWithCheckboxes
              withinPortal
              variant="outlined"
              model={form.typeIds}
              options={activityTypesOptions}
              handleChange={debouncedApply}
            />
          </FilterItemWrapper>
        )}

        {isTaskBoardFilterType && boardId && (
          <FilterItemWrapper label={t('stage')}>
            <MyMultiselectColored
              withinPortal
              model={form.stageIds}
              options={stagesOptions}
              handleChange={debouncedApply}
            />
          </FilterItemWrapper>
        )}

        {isTimeBoardFilterType && (
          <FilterItemWrapper label={t('stage')}>
            <MultiselectWithCheckboxes
              withinPortal
              variant="outlined"
              model={form.groups}
              options={groupsOptions}
              handleChange={debouncedApply}
            />
          </FilterItemWrapper>
        )}
      </FilterItemsBlock>
    </FilterDrawerTemplate>
  );
});

TasksFilterDrawer.displayName = 'TasksFilterDrawer';
export { TasksFilterDrawer };

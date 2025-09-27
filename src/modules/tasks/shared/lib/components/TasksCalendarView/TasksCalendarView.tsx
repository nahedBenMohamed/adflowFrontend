import { SettingsStore, stageApiUtil } from '@/app';
import { AddTaskModal } from '@/modules/card';
import {
  CalendarView,
  MultiselectModel,
  SelectModel,
  UtcDate,
  batchRequest,
  debounce,
  throttle,
  type Nullable,
  type Option,
  type Optional,
} from '@/shared';
import type { DateSelectArg, EventChangeArg } from '@fullcalendar/core';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UpdateTaskDto, type CreateTaskDto } from '../../../../api';
import { calendarViewStore, tasksStore } from '../../../../store';
import { UpdateTaskDrawer } from '../../components';
import {
  SELECTED_TASK_ID_PARAM,
  TaskColorType,
  TaskDeadlineType,
  type AddTaskPreset,
  type BaseTask,
  type Task,
  type TaskCalendarFilterForm,
  type TasksCardsFilterSettings,
  type TasksFilterType,
} from '../../models';
import type { TasksCalendarViewCommonProps } from '../../types';
import { TasksCalendarWrapper } from './components';

export const TASKS_CALENDAR_FILTER_SETTINGS_KEY = 'TasksCalendarFilterSettings';

const { settings } = SettingsStore.getSettingsStore<{ filters: TasksCardsFilterSettings[] }>(
  TASKS_CALENDAR_FILTER_SETTINGS_KEY
);

const EMPTY_TASKS_ARRAY: BaseTask[] = [];

interface Props extends TasksCalendarViewCommonProps {
  isLoading: boolean;
  tasks?: BaseTask[];
  filterType: TasksFilterType;
  addTask?: (taskDto: CreateTaskDto) => void;
  deleteTask?: (taskId: number) => void;
  updateTask?: ({ taskId, dto }: { taskId: number; dto: UpdateTaskDto }) => void;
}

const TasksCalendarView = observer((props: Props) => {
  const {
    tasks,
    isLoading,
    startDate,
    filterDto,
    filterType,
    identifier,
    boardId = null,
    entityId = null,
    calendarView,
    addTask,
    setFilter,
    updateTask,
    deleteTask,
    routeGenerator,
  } = props;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [taskPreset, setTaskPreset] = useState<Nullable<AddTaskPreset>>(null);
  const [isTaskDrawerOpened, { open: openTaskDrawer, close: closeTaskDrawer }] =
    useDisclosure(false);

  const selectedTaskId = useMemo<Nullable<number>>(() => {
    const selectedTaskIdFromParams = searchParams.get(SELECTED_TASK_ID_PARAM);

    return selectedTaskIdFromParams ? Number(selectedTaskIdFromParams) : null;
  }, [searchParams]);

  const { getView, taskColorType: taskColorTypeFromStore, setView } = calendarViewStore;

  let savedFilterSettings: Optional<TasksCardsFilterSettings> = settings.filters
    ? settings.filters.find(s => s.filterType === filterType && s.boardId === boardId)
    : undefined;

  const taskColorType =
    taskColorTypeFromStore ?? savedFilterSettings?.taskColorType ?? TaskColorType.COLORED;

  useLayoutEffect(() => {
    let view = calendarView;
    let startDateFromURI = startDate;

    if (view && startDateFromURI) return;

    if (!view) view = savedFilterSettings?.calendarView ?? getView();

    if (!startDateFromURI) startDateFromURI = UtcDate.startOfCurrentDay();

    navigate(
      routeGenerator({
        view,
        year: startDateFromURI.year,
        month: startDateFromURI.canonicalMonth,
        day: startDateFromURI.day,
      }),
      { replace: true }
    );
  }, [
    startDate,
    calendarView,
    savedFilterSettings?.calendarView,
    getView,
    navigate,
    routeGenerator,
  ]);

  useEffect(() => {
    if (selectedTaskId) openTaskDrawer();
  }, [selectedTaskId, openTaskDrawer]);

  const filterForm = useLocalObservable<TaskCalendarFilterForm>(() => ({
    viewSelectModel: SelectModel.create(calendarView),
    usersSelectModel: MultiselectModel.create<number>(filterDto.ownerIds ?? []),
    taskTypeSelectModel: SelectModel.create(
      savedFilterSettings?.filter.showResolved === false || filterDto.showResolved === false
        ? TaskDeadlineType.PENDING
        : TaskDeadlineType.ALL
    ),
    entityInfos: savedFilterSettings?.filter.entityInfos ?? [],
    stageIds: MultiselectModel.create<number>(
      savedFilterSettings?.filter.stageIds ?? filterDto.stageIds ?? []
    ),
    colorSelectModel: SelectModel.create(taskColorType),
    saveFilterSettings: savedFilterSettings?.saveFilterSettings ?? true,
  }));

  // To preselect current user if the filter is not set
  useLayoutEffect(() => {
    filterForm.usersSelectModel.setValue(filterDto.ownerIds ?? []);
  }, [filterDto.ownerIds, filterForm.usersSelectModel]);

  const saveFilters = useCallback(() => {
    const savedFilters = settings.filters ?? [];

    if (filterForm.saveFilterSettings) {
      settings.filters = [
        ...savedFilters.filter(f => f.filterType !== filterType || f.boardId !== boardId),
        {
          filterType,
          taskColorType,
          justMyCards: false,
          boardId: boardId ?? null,
          calendarView: calendarViewStore.view,
          saveFilterSettings: filterForm.saveFilterSettings,
          filter: {
            ...filterDto,
            ownerIds:
              filterForm.usersSelectModel.values.length > 0
                ? filterForm.usersSelectModel.values
                : undefined,
            showResolved:
              filterForm.taskTypeSelectModel.value === TaskDeadlineType.PENDING ? false : undefined,
            stageIds:
              filterForm.stageIds.values.length > 0 ? filterForm.stageIds.values : undefined,
            entityInfos: filterForm.entityInfos.length > 0 ? filterForm.entityInfos : undefined,
          },
        },
      ];
    } else {
      settings.filters = [
        ...savedFilters.filter(f => f.filterType !== filterType || f.boardId !== boardId),
        {
          filter: {},
          filterType,
          justMyCards: false,
          boardId: boardId ?? null,
          calendarView: CalendarView.DAY,
          saveFilterSettings: filterForm.saveFilterSettings,
        },
      ];
    }
  }, [boardId, filterDto, filterForm, filterType, taskColorType]);

  const handleChangeCalendarView = useCallback(
    (period: CalendarView) => {
      if (!startDate) return;

      setView(period);
      saveFilters();

      navigate(
        routeGenerator({
          view: period,
          year: startDate.year,
          month: startDate.canonicalMonth,
          day: startDate.day,
        }),
        { replace: true }
      );
    },
    [routeGenerator, saveFilters, setView, startDate, navigate]
  );

  const setColorType = useCallback(
    (color: TaskColorType) => {
      calendarViewStore.taskColorType = color;

      filterForm.colorSelectModel.setValue(color);
    },
    [filterForm.colorSelectModel]
  );

  const selectUsers = useCallback(
    (userIds: number[]) => {
      filterForm.usersSelectModel.setValue([...userIds]);

      setFilter({
        ...filterDto,
        ownerIds: userIds.length > 0 ? userIds : undefined,
      });

      saveFilters();
    },
    [filterDto, filterForm.usersSelectModel, saveFilters, setFilter]
  );

  const handleClearFilter = useCallback(() => {
    filterForm.usersSelectModel.setValue([]);
    filterForm.taskTypeSelectModel.setValue(TaskDeadlineType.ALL);
    filterForm.entityInfos = [];
    filterForm.stageIds.setValue([]);
    filterForm.colorSelectModel.setValue(TaskColorType.COLORED);

    setFilter({});
    saveFilters();
  }, [filterForm, saveFilters, setFilter]);

  const setTaskDeadlineTypeFilter = useCallback(
    (type: TaskDeadlineType) => {
      filterForm.taskTypeSelectModel.setValue(type);

      setFilter({
        ...filterDto,
        showResolved: type === TaskDeadlineType.PENDING ? false : undefined,
      });

      saveFilters();
    },
    [filterDto, filterForm.taskTypeSelectModel, saveFilters, setFilter]
  );

  const setStage = useCallback(() => {
    setFilter({
      ...filterDto,
      stageIds: filterForm.stageIds.values.length > 0 ? filterForm.stageIds.values : undefined,
    });

    saveFilters();
  }, [filterDto, filterForm.stageIds.values, saveFilters, setFilter]);

  const setLinkedCards = useCallback(() => {
    setFilter({
      ...filterDto,
      entityInfos: filterForm.entityInfos.length > 0 ? filterForm.entityInfos : undefined,
    });

    saveFilters();
  }, [filterDto, filterForm.entityInfos, saveFilters, setFilter]);

  const toggleSaveFilterSettings = useCallback(() => {
    filterForm.saveFilterSettings = !filterForm.saveFilterSettings;

    saveFilters();
  }, [filterForm, saveFilters]);

  const handleClearTaskPreset = useCallback(() => setTaskPreset(null), []);

  const handleAddTask = useCallback(
    async (dto: CreateTaskDto): Promise<void> => {
      addTask?.(dto);
      handleClearTaskPreset();
    },
    [addTask, handleClearTaskPreset]
  );

  const handleAddRepeatingTask = useCallback(
    async (dtos: CreateTaskDto[]): Promise<void> => {
      await batchRequest({
        array: dtos,
        cb: async (dto): Promise<void> => addTask?.(dto),
      });

      handleClearTaskPreset();
    },
    [addTask, handleClearTaskPreset]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleResolved = useCallback(
    throttle(async (task: BaseTask): Promise<void> => {
      const newTask = tasksStore.ensureResolved({ task, resolved: !task.isResolved });

      const dto = UpdateTaskDto.create({ isResolved: newTask.isResolved });

      updateTask?.({ taskId: task.id, dto });
    }, 200),
    [updateTask]
  );

  const handleCloseTaskDrawer = useCallback(() => {
    handleClearTaskPreset();

    closeTaskDrawer();

    // To prevent showing skeleton in drawer
    setTimeout(() => {
      setSearchParams(prev => {
        prev.delete(SELECTED_TASK_ID_PARAM);

        return prev;
      });
    }, 100);
  }, [closeTaskDrawer, handleClearTaskPreset, setSearchParams]);

  const handleSelectEvent = useCallback(
    (taskId: number) => {
      setSearchParams(prev => {
        prev.set(SELECTED_TASK_ID_PARAM, String(taskId));

        return prev;
      });
    },
    [setSearchParams]
  );

  const handleSelectCell = useCallback((args: DateSelectArg) => {
    const { start, end } = args;

    setTaskPreset({
      endDate: UtcDate.fromDate(end),
      startDate: UtcDate.fromDate(start),
    });
  }, []);

  const handleUpdateEventDragEnd = useCallback(
    async (ev: EventChangeArg): Promise<void> => {
      const newEvent = ev.event;

      const task: Task = newEvent.extendedProps.task;

      const newStartDate = UtcDate.fromNullableDate(newEvent.start);

      const newEndDateInDayOrWeek =
        UtcDate.fromNullableDate(newEvent.end) ?? newStartDate?.addMinutes(60);

      const isMonthOrAllDay = calendarView === CalendarView.MONTH || newEvent.allDay;

      // in month and week view we subtract one day, because we expanded it in generateTaskCalendarEvents
      const newEndDate = isMonthOrAllDay
        ? newEndDateInDayOrWeek?.subtractDays(1).endOfDay()
        : newEndDateInDayOrWeek;

      if (!newStartDate || !newEndDate)
        throw new Error(`Failed to identify startDate or endDate for event ${newEvent.title})`);

      const dto = UpdateTaskDto.fromTask(task);

      dto.startDate = newStartDate.formatISO();
      dto.endDate = newEndDate.formatISO();

      updateTask?.({
        taskId: task.id,
        dto,
      });
    },
    [calendarView, updateTask]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleUpdateEventDragEnd = useCallback(debounce(handleUpdateEventDragEnd, 1000), [
    handleUpdateEventDragEnd,
  ]) as (ev: EventChangeArg) => Promise<void>;

  const isCalendarEditable = Boolean(addTask) && Boolean(updateTask) && Boolean(deleteTask);

  const { data: stages } = stageApiUtil.useGetStagesByBoardId({ boardId: boardId });

  const stagesOptions = useMemo<Option<number, { bgColor: string }>[]>(
    () =>
      stages
        ? stages.map(s => ({
            label: s.name,
            value: s.id,
            extra: {
              bgColor: s.color,
            },
          }))
        : [],
    [stages]
  );

  return (
    <>
      {calendarView && (
        <TasksCalendarWrapper
          tasks={tasks ?? EMPTY_TASKS_ARRAY}
          startDate={startDate}
          taskPreset={taskPreset}
          filterForm={filterForm}
          isLoading={isLoading}
          stagesOptions={stagesOptions}
          calendarView={calendarView}
          selectedTaskId={selectedTaskId}
          selectUsers={selectUsers}
          setStage={setStage}
          setLinkedCards={setLinkedCards}
          routeGenerator={routeGenerator}
          setColorType={setColorType}
          toggleResolved={toggleResolved}
          handleCreateEvent={handleSelectCell}
          handleClearFilter={handleClearFilter}
          handleSelectEvent={handleSelectEvent}
          toggleSaveFilterSettings={toggleSaveFilterSettings}
          handleChangeCalendarView={handleChangeCalendarView}
          handleUpdateEventDragEnd={debouncedHandleUpdateEventDragEnd}
          setTaskDeadlineTypeFilter={setTaskDeadlineTypeFilter}
          editable={isCalendarEditable}
        />
      )}

      {isCalendarEditable && updateTask && deleteTask && (
        <UpdateTaskDrawer
          id={selectedTaskId}
          opened={isTaskDrawerOpened}
          hide={handleCloseTaskDrawer}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onResolveTask={toggleResolved}
        />
      )}

      {isCalendarEditable && taskPreset && (
        <AddTaskModal
          boardId={boardId}
          preset={taskPreset}
          entityId={entityId}
          identifier={identifier}
          isOpened={Boolean(taskPreset)}
          onTaskAdd={handleAddTask}
          onRepeatingTaskAdd={handleAddRepeatingTask}
          onClose={handleClearTaskPreset}
        />
      )}
    </>
  );
});

TasksCalendarView.displayName = 'TasksCalendarView';
export { TasksCalendarView };

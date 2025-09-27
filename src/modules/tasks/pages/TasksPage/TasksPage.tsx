import { appStore, boardApiUtil, routes } from '@/app';
import { authStore } from '@/modules/auth';
import {
  type GanttView,
  generateTimelineRoute,
  type TimelineRouteGenerator,
} from '@/modules/gantt';
import {
  BoardTabIcon,
  type CalendarView,
  DefaultHeader,
  lastTasksBoardService,
  ListTabIcon,
  type Optional,
  PageTemplateWithSubheader,
  type TabModel,
  TasksCalendarTabIcon,
  UriCodingUtil,
  useCheckProjectOwnerOrAdmin,
  useMobile,
  useTitle,
  useTypedParams,
  UtcDate,
  WholePageLoaderWithLogo,
} from '@/shared';
import { Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  type CreateTaskDto,
  TaskSettingsIdentifier,
  useGetTasksForCalendarCount,
  type UserTimeAllocation,
} from '../../api';
import {
  findSavedCalendarFilter,
  findSavedTasksFilter,
  generateTasksCalendarRoute,
  SELECTED_TASK_ID_PARAM,
  type TaskBoardFilter,
  type TaskCalendarRouteGenerator,
  TasksBoard,
  TasksBoardType,
  TasksCount,
  TasksFilterButton,
  TasksFilterType,
  TasksList,
  TasksPageCalendarView,
  TasksPageHeader,
  TasksSettingsButton,
  TasksTab,
  type TasksTableSettingsDrawerProps,
  TimelineTabIcon,
  useGetCalendarQueryParams,
} from '../../shared';
import {
  calendarViewStore,
  TasksBoardPageStore,
  tasksFilterStore,
  TasksListsPageStore,
  TasksTimelinePageStore,
} from '../../store';
import { TimelinePage } from '../TimelinePage/TimelinePage';

const TasksPage = observer(() => {
  const { boardId, tab, view, year, month, day } = useTypedParams<{
    boardId: number;
    tab: TasksTab;
    view?: CalendarView | GanttView;
    year?: number;
    month?: number;
    day?: number;
  }>();

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.common.ui.tasks_page_header',
  });

  const { user: currentUser } = authStore;

  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  const [pageTitle, setPageTitle] = useState<string>();

  useTitle({ dynamicTitle: pageTitle });

  const isMobile = useMobile();

  const today = useMemo<UtcDate>(() => UtcDate.startOfCurrentDay(), []);

  const calendarViewFromSettings = findSavedCalendarFilter({
    filterType: TasksFilterType.TASK_BOARD_FILTER,
    boardId,
  })?.calendarView;

  const tasksTabs = useMemo<TabModel[]>(
    () => [
      { href: routes.tasksBoard(boardId), title: t('board'), Icon: <BoardTabIcon /> },
      { href: routes.tasksList(boardId), title: t('list'), Icon: <ListTabIcon /> },
      {
        href: routes.tasksCalendar({
          boardId,
          day: today.day,
          year: today.year,
          month: today.canonicalMonth,
          view: calendarViewFromSettings ?? calendarViewStore.view,
        }),
        title: t('calendar'),
        Icon: <TasksCalendarTabIcon />,
        active: pathname.includes(TasksTab.CALENDAR),
      },
      {
        title: t('timeline'),
        Icon: <TimelineTabIcon />,
        active: pathname.includes(TasksTab.TIMELINE),
        href: routes.tasksTimeline({ boardId, view: 'day' }),
      },
    ],
    [boardId, calendarViewFromSettings, today.year, today.canonicalMonth, today.day, pathname, t]
  );

  const selectedTaskIdFromParams = searchParams.get(SELECTED_TASK_ID_PARAM);
  const selectedTaskId = selectedTaskIdFromParams ? Number(selectedTaskIdFromParams) : null;

  const tasksPageStore = useMemo(() => new TasksBoardPageStore(), []);
  const tasksListPageStore = useMemo(() => new TasksListsPageStore(), []);
  const tasksTimelinePageStore = useMemo(() => new TasksTimelinePageStore(boardId), [boardId]);

  const identifier = TaskSettingsIdentifier.forTaskBoard(boardId);

  const { filter, filterDto, isCalendarInitialFilterSet, setFilter } = tasksFilterStore;

  const [
    tableSettingsDrawerOpened,
    { close: hideTableSettingsDrawer, toggle: toggleTableSettingsDrawer },
  ] = useDisclosure(false);

  const { isList, isBoard, isCalendar, isListOrCalendar } = useMemo(
    () => ({
      isList: tab === TasksTab.LIST,
      isBoard: tab === TasksTab.BOARD,
      isCalendar: tab === TasksTab.CALENDAR,
      isListOrCalendar: [TasksTab.LIST, TasksTab.CALENDAR].includes(tab),
    }),
    [tab]
  );

  const savedFilter = useMemo<Optional<TaskBoardFilter>>(
    () =>
      findSavedTasksFilter({
        filterType: TasksFilterType.TASK_BOARD_FILTER,
        boardId,
      }),
    [boardId]
  );

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        if (isCalendar) {
          if (!tasksFilterStore.isFilterSet) {
            const savedCalendarFilter = findSavedCalendarFilter({
              filterType: TasksFilterType.TASK_BOARD_FILTER,
              boardId,
            });

            setFilter(savedCalendarFilter?.filter ?? {});

            const currentUserFilter = currentUser ? { ownerIds: [currentUser.id] } : {};

            if (!tasksFilterStore.isFilterSet) setFilter(currentUserFilter);
          }

          tasksFilterStore.markCalendarFilterAsInitiallySet();
        } else {
          setFilter(savedFilter ?? {});

          tasksFilterStore.unmarkCalendarFilterAsInitiallySet();
        }

        const { filterDto } = tasksFilterStore;

        switch (tab) {
          case TasksTab.LIST: {
            tasksListPageStore.loadData({ boardId, filterDto });

            break;
          }

          case TasksTab.BOARD: {
            tasksPageStore.loadData({ boardId, filterDto });

            break;
          }
        }

        return () => {
          tasksPageStore.reset();
          tasksListPageStore.reset();
        };
      }
    );
  }, [
    boardId,
    tasksPageStore,
    tasksListPageStore,
    isCalendar,
    tab,
    currentUser,
    savedFilter,
    setFilter,
    t,
  ]);

  const { data: board, status: boardQueryStatus } = boardApiUtil.useGetBoard(boardId);

  useLayoutEffect(() => {
    if (!board && boardQueryStatus !== 'pending') {
      navigate(routes.timeBoard());
    }
  }, [board, boardQueryStatus, navigate]);

  useEffect(() => {
    if (board)
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setPageTitle(board.name);
  }, [board]);

  useEffect(() => {
    lastTasksBoardService.setLastTasksBoardParams({ tasksType: TasksBoardType.TASKS, boardId });
  }, [boardId]);

  const isProjectOwnerOrAdmin = useCheckProjectOwnerOrAdmin({ boardId });

  const {
    meta: tasksBoardMeta,
    loadData: loadTasksBoard,
    addTask: handleAddBoardTask,
  } = tasksPageStore;

  const {
    meta: tasksListMeta,
    loadData: loadTasksList,
    addTask: handleAddListTask,
  } = tasksListPageStore;

  const {
    meta: tasksTimelineMeta,
    loadData: loadTasksTimeline,
    addTask: handleAddTimelineTask,
  } = tasksTimelinePageStore;

  const handleLoadData = useCallback(
    async (filter: TaskBoardFilter): Promise<void> => {
      setFilter(filter);

      const { filterDto } = tasksFilterStore;

      switch (tab) {
        case TasksTab.LIST: {
          await loadTasksList({ boardId, filterDto });

          break;
        }

        case TasksTab.BOARD: {
          await loadTasksBoard({ boardId, filterDto });

          break;
        }

        case TasksTab.TIMELINE: {
          await loadTasksTimeline(filterDto);

          break;
        }
      }
    },
    [tab, boardId, setFilter, loadTasksBoard, loadTasksList, loadTasksTimeline]
  );

  const handleAddTask = useCallback(
    async (dto: CreateTaskDto): Promise<void> => {
      switch (tab) {
        case TasksTab.LIST: {
          await handleAddListTask(dto);

          break;
        }

        case TasksTab.BOARD: {
          await handleAddBoardTask({ dto, filterDto: filter });

          break;
        }

        case TasksTab.TIMELINE: {
          await handleAddTimelineTask(dto);

          break;
        }
      }
    },
    [tab, filter, handleAddBoardTask, handleAddListTask, handleAddTimelineTask]
  );

  // Subtract 1 from month because we use canonical months (1-12) in url, but in code it is 0-11
  const startDate = year && month && day ? UtcDate.create({ year, month: month - 1, day }) : null;

  const queryParams = useGetCalendarQueryParams({
    boardId,
    startDate,
    filterDto,
    calendarView: view as CalendarView,
  });

  const { data: tasksCountForCalendar } = useGetTasksForCalendarCount({
    queryParams,
    enabled: isCalendar && isCalendarInitialFilterSet,
  });

  const tasksCount = useMemo<number>(() => {
    switch (tab) {
      case TasksTab.BOARD:
        return tasksBoardMeta.total;

      case TasksTab.LIST:
        return tasksListMeta.total;

      case TasksTab.TIMELINE:
        return tasksTimelineMeta.total;

      default:
        return tasksCountForCalendar ?? 0;
    }
  }, [
    tab,
    tasksListMeta.total,
    tasksBoardMeta.total,
    tasksCountForCalendar,
    tasksTimelineMeta.total,
  ]);

  const timeAllocation = useMemo<UserTimeAllocation[]>(() => {
    switch (tab) {
      case TasksTab.BOARD:
        return tasksBoardMeta.timeAllocation;

      case TasksTab.LIST:
        return tasksListMeta.timeAllocation;

      case TasksTab.TIMELINE:
        return tasksTimelineMeta.timeAllocation;

      default:
        return tasksTimelineMeta.timeAllocation;
    }
  }, [
    tab,
    tasksListMeta.timeAllocation,
    tasksBoardMeta.timeAllocation,
    tasksTimelineMeta.timeAllocation,
  ]);

  const tableSettingsDrawerProps = useMemo<Optional<TasksTableSettingsDrawerProps>>(
    () =>
      isList
        ? {
            drawerOpened: tableSettingsDrawerOpened,
            toggleDrawer: toggleTableSettingsDrawer,
          }
        : undefined,
    [isList, tableSettingsDrawerOpened, toggleTableSettingsDrawer]
  );

  const calendarRouteGenerator = useMemo<TaskCalendarRouteGenerator>(
    () =>
      generateTasksCalendarRoute({
        baseRoute: 'tasks',
        boardId,
      }),
    [boardId]
  );

  const timelineRouteGenerator = useMemo<TimelineRouteGenerator>(
    () =>
      generateTimelineRoute({
        boardId,
        baseRoute: 'tasks',
      }),
    [boardId]
  );

  if (!appStore.isLoaded || !board)
    return (
      <PageTemplateWithSubheader Header={<DefaultHeader />} tabs={tasksTabs}>
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      </PageTemplateWithSubheader>
    );

  return (
    <PageTemplateWithSubheader
      tabs={tasksTabs}
      rootMinWidth={isListOrCalendar ? 0 : undefined}
      rootWidth={isListOrCalendar ? '100%' : undefined}
      pageMinWidth={isBoard && isMobile ? 0 : undefined}
      marginLeft={isCalendar ? 0 : undefined}
      marginRight={isListOrCalendar ? 0 : undefined}
      Header={
        <TasksPageHeader
          boardId={boardId}
          identifier={identifier}
          timeAllocation={timeAllocation}
          handleAddTask={handleAddTask}
        />
      }
      SubheaderControls={
        <>
          <TasksCount count={tasksCount} />

          {!isCalendar && (
            <TasksFilterButton
              filter={filter}
              boardId={boardId}
              filterType={TasksFilterType.TASK_BOARD_FILTER}
              loadData={handleLoadData}
              setFilter={setFilter}
            />
          )}

          {isProjectOwnerOrAdmin && (
            <TasksSettingsButton
              boardId={boardId}
              currentPageEncodedUrl={currentPageEncodedUrl}
              tableSettingsDrawerProps={tableSettingsDrawerProps}
            />
          )}
        </>
      }
    >
      <Tabs.Panel value={TasksTab.BOARD}>
        <TasksBoard
          boardId={boardId}
          filterDto={filterDto}
          identifier={identifier}
          tasksPageStore={tasksPageStore}
          selectedTaskId={selectedTaskId}
          canEditBoard={isProjectOwnerOrAdmin}
          currentPageEncodedUrl={currentPageEncodedUrl}
        />
      </Tabs.Panel>

      <Tabs.Panel value={TasksTab.LIST}>
        <TasksList
          boardId={boardId}
          filterDto={filterDto}
          identifier={identifier}
          selectedTaskId={selectedTaskId}
          currentPathname={currentPageEncodedUrl}
          tasksListPageStore={tasksListPageStore}
          settingsDrawerOpened={tableSettingsDrawerOpened}
          hideSettingsDrawer={hideTableSettingsDrawer}
        />
      </Tabs.Panel>

      <Tabs.Panel value={TasksTab.CALENDAR}>
        <TasksPageCalendarView
          boardId={boardId}
          startDate={startDate}
          filterDto={filterDto}
          identifier={identifier}
          isInitialFilterSet={isCalendarInitialFilterSet}
          calendarView={view as CalendarView}
          setFilter={setFilter}
          routeGenerator={calendarRouteGenerator}
        />
      </Tabs.Panel>

      <Tabs.Panel value={TasksTab.TIMELINE}>
        <TimelinePage
          boardId={boardId}
          filterDto={filterDto}
          view={view as GanttView}
          routeGenerator={timelineRouteGenerator}
          tasksTimelinePageStore={tasksTimelinePageStore}
        />
      </Tabs.Panel>
    </PageTemplateWithSubheader>
  );
});

export { TasksPage };

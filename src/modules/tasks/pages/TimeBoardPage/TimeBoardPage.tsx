import { appStore, routes } from '@/app';
import { authStore } from '@/modules/auth';
import {
  BoardTabIcon,
  DefaultHeader,
  PageTemplateWithSubheader,
  TasksCalendarTabIcon,
  UtcDate,
  WholePageLoaderWithLogo,
  useMobile,
  useTitle,
  useTypedParams,
  type CalendarView,
  type TabModel,
} from '@/shared';
import { Tabs } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  TaskSettingsIdentifier,
  useGetTimeBoardTasksForCalendarCount,
  type CreateTaskDto,
} from '../../api';
import {
  TasksCount,
  TasksFilterButton,
  TasksFilterType,
  TasksPageHeader,
  TasksTab,
  TimeBoardPageCalendarView,
  findSavedCalendarFilter,
  findSavedTasksFilter,
  generateTasksCalendarRoute,
  useGetCalendarQueryParams,
  type TaskBoardFilter,
  type TaskCalendarRouteGenerator,
} from '../../shared';
import { calendarViewStore, taskSettingsStore, timeBoardPageStore } from '../../store';
import { TimeBoardView } from './components';

const TimeBoardPage = observer(() => {
  const { tab, view, year, month, day } = useTypedParams<{
    tab: TasksTab;
    day?: number;
    year?: number;
    month?: number;
    view?: CalendarView;
  }>();

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.tasks_page_by_deadline',
  });

  const { user: currentUser } = authStore;

  useTitle({ titleTranslationKey: 'time_board' });

  const isMobile = useMobile();

  const { pathname } = useLocation();

  const today = useMemo<UtcDate>(() => UtcDate.startOfCurrentDay(), []);

  const calendarViewFromSettings = findSavedCalendarFilter({
    filterType: TasksFilterType.TIME_BOARD_FILTER,
    boardId: null,
  })?.calendarView;

  const tasksTabs = useMemo<TabModel[]>(
    () => [
      {
        title: t('board'),
        Icon: <BoardTabIcon />,
        href: routes.timeBoard(),
        active: !pathname.includes(TasksTab.CALENDAR),
      },
      {
        href: routes.timeBoardCalendar({
          day: today.day,
          year: today.year,
          month: today.canonicalMonth,
          view: calendarViewFromSettings ?? calendarViewStore.view,
        }),
        title: t('calendar'),
        Icon: <TasksCalendarTabIcon />,
        active: pathname.includes(TasksTab.CALENDAR),
      },
    ],
    [today, pathname, calendarViewFromSettings, t]
  );

  const isBoard = tab === TasksTab.BOARD;
  const isCalendar = tab === TasksTab.CALENDAR;

  const {
    filter,
    filterDto,
    totalMeta,
    timeAllocation,
    isCalendarInitialFilterSet,
    addTask,
    loadData,
    setFilter,
  } = timeBoardPageStore;

  // Subtract 1 from month because we use canonical months (1-12) in url, but in code it is 0-11
  const startDate = year && month && day ? UtcDate.create({ year, month: month - 1, day }) : null;

  const queryParams = useGetCalendarQueryParams({
    startDate,
    filterDto,
    boardId: null,
    calendarView: view,
  });

  const { data: tasksCountForCalendar } = useGetTimeBoardTasksForCalendarCount({
    queryParams,
    enabled: isCalendar && isCalendarInitialFilterSet,
  });

  const tasksCount = useMemo<number>(() => {
    switch (tab) {
      case TasksTab.BOARD:
        return totalMeta;

      case TasksTab.CALENDAR:
        return tasksCountForCalendar ?? 0;

      default:
        return totalMeta;
    }
  }, [tab, totalMeta, tasksCountForCalendar]);

  useEffect(() => {
    if (!appStore.isLoaded) return;

    if (isCalendar) {
      if (!timeBoardPageStore.isFilterSet) {
        const savedCalendarFilter = findSavedCalendarFilter({
          filterType: TasksFilterType.TIME_BOARD_FILTER,
          boardId: null,
        });

        setFilter(savedCalendarFilter?.filter ?? {});

        const currentUserFilter = currentUser ? { ownerIds: [currentUser.id] } : {};

        if (!timeBoardPageStore.isFilterSet) setFilter(currentUserFilter);
      }

      timeBoardPageStore.markCalendarFilterAsInitiallySet();
    } else {
      const savedFilter = findSavedTasksFilter({
        filterType: TasksFilterType.TIME_BOARD_FILTER,
        boardId: null,
      });

      setFilter(savedFilter ?? {});

      timeBoardPageStore.unmarkCalendarFilterAsInitiallySet();
    }
  }, [currentUser, isCalendar, setFilter, tab]);

  const identifier = TaskSettingsIdentifier.forTimeBoard();

  const handleAddTask = useCallback(
    async (dto: CreateTaskDto): Promise<void> => {
      dto.settingsId = (await taskSettingsStore.findOrCreateByIdentifier(identifier)).id;

      await addTask(dto);
    },
    [addTask, identifier]
  );

  const handleLoadData = useCallback(
    async (filter: TaskBoardFilter): Promise<void> => {
      if (tab === TasksTab.BOARD) loadData({ filter, t });
    },
    [loadData, tab, t]
  );

  const calendarRouteGenerator = useMemo<TaskCalendarRouteGenerator>(
    () => generateTasksCalendarRoute({ baseRoute: 'time_board' }),
    []
  );

  if (!appStore.isLoaded)
    return (
      <PageTemplateWithSubheader tabs={tasksTabs} Header={<DefaultHeader />}>
        <WholePageLoaderWithLogo ensureSubheaderWithOffset />
      </PageTemplateWithSubheader>
    );

  return (
    <PageTemplateWithSubheader
      tabs={tasksTabs}
      pageMinWidth={isBoard && isMobile ? 0 : undefined}
      marginLeft={isCalendar ? 0 : undefined}
      marginRight={isCalendar ? 0 : undefined}
      Header={
        <TasksPageHeader
          boardId={null}
          entityId={null}
          isCalendar={isCalendar}
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
              boardId={null}
              filter={filter}
              filterType={TasksFilterType.TIME_BOARD_FILTER}
              loadData={handleLoadData}
            />
          )}
        </>
      }
    >
      <Tabs.Panel value={TasksTab.BOARD}>
        <TimeBoardView />
      </Tabs.Panel>

      <Tabs.Panel value={TasksTab.CALENDAR}>
        <TimeBoardPageCalendarView
          calendarView={view}
          startDate={startDate}
          filterDto={filterDto}
          identifier={identifier}
          setFilter={setFilter}
          isInitialFilterSet={isCalendarInitialFilterSet}
          routeGenerator={calendarRouteGenerator}
        />
      </Tabs.Panel>
    </PageTemplateWithSubheader>
  );
});

export { TimeBoardPage };

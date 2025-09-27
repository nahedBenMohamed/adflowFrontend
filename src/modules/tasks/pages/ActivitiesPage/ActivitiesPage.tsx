import { appStore, routes } from '@/app';
import { authStore } from '@/modules/auth';
import {
  BoardTabIcon,
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
import { TaskSettingsIdentifier, useGetTasksForCalendarCount } from '../../api';
import {
  ActivitiesPageCalendarView,
  TasksCount,
  TasksFilterButton,
  TasksFilterType,
  TasksPageHeader,
  TasksTab,
  findSavedCalendarFilter,
  findSavedTasksFilter,
  generateTasksCalendarRoute,
  useGetCalendarQueryParams,
  type TaskBoardFilter,
  type TaskCalendarRouteGenerator,
} from '../../shared';
import { activitiesPageStore, calendarViewStore } from '../../store';
import { ActivitiesPageView } from './components';

const ActivitiesPage = observer(() => {
  const { tab, view, year, month, day } = useTypedParams<{
    tab: TasksTab;
    view?: CalendarView;
    year?: number;
    month?: number;
    day?: number;
  }>();

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.tasks_page_by_deadline',
  });

  const { user: currentUser } = authStore;

  useTitle({ titleTranslationKey: 'activities_board' });

  const isMobile = useMobile();

  const { pathname } = useLocation();

  const today = useMemo<UtcDate>(() => UtcDate.startOfCurrentDay(), []);

  const calendarViewFromSettings = findSavedCalendarFilter({
    filterType: TasksFilterType.ACTIVITY_CARDS_FILTER,
    boardId: null,
  })?.calendarView;

  const tasksTabs = useMemo<TabModel[]>(
    () => [
      {
        href: routes.activities,
        title: t('board'),
        Icon: <BoardTabIcon />,
        active: !pathname.includes(TasksTab.CALENDAR),
      },
      {
        href: routes.activitiesCalendar({
          view: calendarViewFromSettings ?? calendarViewStore.view,
          year: today.year,
          month: today.canonicalMonth,
          day: today.day,
        }),
        title: t('calendar'),
        Icon: <TasksCalendarTabIcon />,
        active: pathname.includes(TasksTab.CALENDAR),
      },
    ],
    [pathname, calendarViewFromSettings, today, t]
  );

  const { isBoard, isCalendar } = useMemo(
    () => ({
      isBoard: tab === TasksTab.BOARD,
      isCalendar: tab === TasksTab.CALENDAR,
    }),
    [tab]
  );

  const { totalCount, filter, filterDto, isCalendarInitialFilterSet, loadData, setFilter } =
    activitiesPageStore;

  // Subtract 1 from month because we use canonical months (1-12) in url, but in code it is 0-11
  const startDate = year && month && day ? UtcDate.create({ year, month: month - 1, day }) : null;

  const queryParams = useGetCalendarQueryParams({
    boardId: null,
    startDate,
    filterDto,
    calendarView: view,
  });

  const { data: tasksCountForCalendar } = useGetTasksForCalendarCount({
    queryParams,
    enabled: isCalendar && isCalendarInitialFilterSet,
  });

  const tasksCount = useMemo<number>(() => {
    switch (tab) {
      case TasksTab.BOARD:
        return totalCount;

      case TasksTab.CALENDAR:
        return tasksCountForCalendar ?? 0;

      default:
        return totalCount;
    }
  }, [tab, totalCount, tasksCountForCalendar]);

  useEffect(() => {
    if (!appStore.isLoaded) return;

    if (isCalendar) {
      if (!activitiesPageStore.isFilterSet) {
        const savedCalendarFilter = findSavedCalendarFilter({
          filterType: TasksFilterType.ACTIVITY_CARDS_FILTER,
          boardId: null,
        });

        setFilter(savedCalendarFilter?.filter ?? {});

        const currentUserFilter = currentUser ? { ownerIds: [currentUser.id] } : {};

        if (!activitiesPageStore.isFilterSet) setFilter(currentUserFilter);
      }

      activitiesPageStore.markCalendarFilterAsInitiallySet();
    } else {
      const savedFilter = findSavedTasksFilter({
        filterType: TasksFilterType.ACTIVITY_CARDS_FILTER,
        boardId: null,
      });

      setFilter(savedFilter ?? {});

      activitiesPageStore.unmarkCalendarFilterAsInitiallySet();
    }
  }, [currentUser, isCalendar, setFilter]);

  const handleLoadData = useCallback(
    async (filter: TaskBoardFilter) => {
      if (tab === TasksTab.BOARD) loadData({ filter, t });
    },
    [tab, loadData, t]
  );

  const identifier = TaskSettingsIdentifier.forTimeBoard();

  const calendarRouteGenerator = useMemo<TaskCalendarRouteGenerator>(
    () => generateTasksCalendarRoute({ baseRoute: 'activities' }),
    []
  );

  if (!appStore.isLoaded)
    return (
      <PageTemplateWithSubheader Header={<TasksPageHeader boardId={null} />} tabs={tasksTabs}>
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
          filterType={TasksFilterType.ACTIVITY_CARDS_FILTER}
        />
      }
      SubheaderControls={
        <>
          <TasksCount count={tasksCount} activities />

          {!isCalendar && (
            <TasksFilterButton
              boardId={null}
              filter={filter}
              filterType={TasksFilterType.ACTIVITY_CARDS_FILTER}
              setFilter={setFilter}
              loadData={handleLoadData}
            />
          )}
        </>
      }
    >
      <Tabs.Panel value={TasksTab.BOARD}>
        <ActivitiesPageView />
      </Tabs.Panel>

      <Tabs.Panel value={TasksTab.CALENDAR}>
        <ActivitiesPageCalendarView
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

export { ActivitiesPage };

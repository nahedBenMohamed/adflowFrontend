import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useGetActivitiesForCalendar, useUpdateActivityInCalendar } from '../../../../api';
import { CalendarServerEventServiceStore } from '../../../../store';
import { useGetCalendarQueryParams } from '../../hooks';
import { TasksFilterType } from '../../models';
import type { TasksCalendarViewCommonProps } from '../../types';
import { TasksCalendarView } from '../TasksCalendarView/TasksCalendarView';

const ActivitiesPageCalendarView = (props: TasksCalendarViewCommonProps) => {
  const { filterDto, calendarView, isInitialFilterSet, startDate } = props;

  const queryParams = useGetCalendarQueryParams({
    boardId: null,
    startDate,
    calendarView,
    filterDto,
  });

  const { data: activities, isLoading: areActivitiesLoading } = useGetActivitiesForCalendar({
    queryParams,
    enabled: isInitialFilterSet,
  });
  const { mutate: updateTask } = useUpdateActivityInCalendar(queryParams);

  const queryClient = useQueryClient();

  const calendarServerEventServiceStore = useMemo(
    () =>
      new CalendarServerEventServiceStore({
        type: 'activities',
        queryParams,
        queryClient,
      }),
    [queryClient, queryParams]
  );

  useEffect(() => {
    calendarServerEventServiceStore.subscribe();

    return () => calendarServerEventServiceStore.reset();
  }, [calendarServerEventServiceStore]);

  return (
    <TasksCalendarView
      tasks={activities}
      filterType={TasksFilterType.ACTIVITY_CARDS_FILTER}
      isLoading={areActivitiesLoading}
      updateTask={updateTask}
      {...props}
    />
  );
};

export { ActivitiesPageCalendarView };

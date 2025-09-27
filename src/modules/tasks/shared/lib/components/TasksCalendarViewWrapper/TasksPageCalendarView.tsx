import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import {
  useAddTaskToCalendar,
  useDeleteTaskFromCalendar,
  useGetTasksForCalendar,
  useUpdateTaskInCalendar,
} from '../../../../api';
import { CalendarServerEventServiceStore } from '../../../../store';
import { useGetCalendarQueryParams } from '../../hooks';
import { TasksFilterType } from '../../models';
import type { TasksCalendarViewCommonProps } from '../../types';
import { TasksCalendarView } from '../TasksCalendarView/TasksCalendarView';

interface Props extends TasksCalendarViewCommonProps {
  boardId: number;
}

const TasksPageCalendarView = (props: Props) => {
  const { boardId, filterDto, calendarView, isInitialFilterSet, startDate } = props;

  const queryParams = useGetCalendarQueryParams({ boardId, startDate, filterDto, calendarView });

  const { data: tasks, isLoading: areTasksLoading } = useGetTasksForCalendar({
    queryParams,
    enabled: isInitialFilterSet,
  });

  const { mutate: addTask } = useAddTaskToCalendar({ type: 'tasks', queryParams });
  const { mutate: deleteTask } = useDeleteTaskFromCalendar({ type: 'tasks', queryParams });
  const { mutate: updateTask } = useUpdateTaskInCalendar({ type: 'tasks', queryParams });

  const queryClient = useQueryClient();

  const calendarServerEventServiceStore = useMemo(
    () =>
      new CalendarServerEventServiceStore({
        type: 'tasks',
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
      tasks={tasks}
      filterType={TasksFilterType.TASK_BOARD_FILTER}
      isLoading={areTasksLoading}
      addTask={addTask}
      deleteTask={deleteTask}
      updateTask={updateTask}
      {...props}
    />
  );
};

export { TasksPageCalendarView };

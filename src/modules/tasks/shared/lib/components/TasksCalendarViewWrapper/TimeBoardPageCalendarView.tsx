import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import {
  useAddTaskToCalendar,
  useDeleteTaskFromCalendar,
  useGetTimeBoardTasksForCalendar,
  useUpdateActivityInCalendar,
  useUpdateTaskInCalendar,
  type UpdateTaskDto,
} from '../../../../api';
import { CalendarServerEventServiceStore } from '../../../../store';
import { useGetCalendarQueryParams } from '../../hooks';
import { Task, TasksFilterType } from '../../models';
import type { TasksCalendarViewCommonProps } from '../../types';
import { TasksCalendarView } from '../TasksCalendarView/TasksCalendarView';

const TimeBoardPageCalendarView = (props: TasksCalendarViewCommonProps) => {
  const { filterDto, calendarView, isInitialFilterSet, startDate } = props;

  const queryParams = useGetCalendarQueryParams({
    boardId: null,
    startDate,
    filterDto,
    calendarView,
  });

  const { data: tasks, isLoading: areTasksLoading } = useGetTimeBoardTasksForCalendar({
    queryParams,
    enabled: isInitialFilterSet,
  });

  const { mutate: addTask } = useAddTaskToCalendar({ type: 'time_board', queryParams });
  const { mutate: deleteTask } = useDeleteTaskFromCalendar({ type: 'time_board', queryParams });
  const { mutate: updateTask } = useUpdateTaskInCalendar({ type: 'time_board', queryParams });
  const { mutate: updateActivity } = useUpdateActivityInCalendar(queryParams);

  const queryClient = useQueryClient();

  const calendarServerEventServiceStore = useMemo(
    () =>
      new CalendarServerEventServiceStore({
        type: 'time_board',
        queryParams,
        queryClient,
      }),
    [queryClient, queryParams]
  );

  useEffect(() => {
    calendarServerEventServiceStore.subscribe();

    return () => calendarServerEventServiceStore.reset();
  }, [calendarServerEventServiceStore]);

  const handleUpdateTask = useCallback(
    ({ taskId, dto }: { taskId: number; dto: UpdateTaskDto }) => {
      const task = tasks?.find(t => t.id === taskId);

      if (!task) return;

      if (task instanceof Task) {
        updateTask({ taskId, dto });
      } else {
        updateActivity({ taskId, dto });
      }
    },
    [tasks, updateTask, updateActivity]
  );

  return (
    <TasksCalendarView
      tasks={tasks}
      filterType={TasksFilterType.TIME_BOARD_FILTER}
      isLoading={areTasksLoading}
      addTask={addTask}
      deleteTask={deleteTask}
      updateTask={handleUpdateTask}
      {...props}
    />
  );
};

export { TimeBoardPageCalendarView };

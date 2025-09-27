import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { BaseTask } from '../../../shared';
import { taskApi } from '../../TaskApi/TaskApi';
import { TASKS_QUERY_KEYS } from '../../TasksQueryKeys';
import type { TasksForCalendarQueryParamsDto } from '../../dtos';
import { deleteTaskFromCalendarCache } from '../helpers/deleteTaskFromCalendarCache';

export const useDeleteTaskFromCalendar = ({
  type,
  queryParams,
}: {
  type: 'tasks' | 'time_board';
  queryParams: TasksForCalendarQueryParamsDto;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskApi.deleteTask(id),
    onMutate: async (id: number): Promise<{ previousTasks?: BaseTask[] }> => {
      await queryClient.cancelQueries({
        queryKey: TASKS_QUERY_KEYS.tasksCalendar(),
      });

      const previousTasks =
        type === 'tasks'
          ? queryClient.getQueryData<BaseTask[]>(TASKS_QUERY_KEYS.tasksForCalendar(queryParams))
          : queryClient.getQueryData<BaseTask[]>(
              TASKS_QUERY_KEYS.timeBoardTasksForCalendar(queryParams)
            );

      deleteTaskFromCalendarCache({ type, queryParams, queryClient, taskId: id });

      return { previousTasks };
    },
    onError: (context: { previousTasks: BaseTask[] }) => {
      if (type === 'tasks') {
        queryClient.setQueryData<BaseTask[]>(
          TASKS_QUERY_KEYS.tasksForCalendar(queryParams),
          context.previousTasks
        );
      } else if (type === 'time_board') {
        queryClient.setQueryData<BaseTask[]>(
          TASKS_QUERY_KEYS.timeBoardTasksForCalendar(queryParams),
          context.previousTasks
        );
      }
    },
    onSettled: async (): Promise<void> => {
      if (type === 'tasks') {
        await queryClient.invalidateQueries({
          queryKey: TASKS_QUERY_KEYS.tasksForCalendar(queryParams),
        });
      } else if (type === 'time_board') {
        await queryClient.invalidateQueries({
          queryKey: TASKS_QUERY_KEYS.timeBoardTasksForCalendar(queryParams),
        });
      }
    },
  });
};

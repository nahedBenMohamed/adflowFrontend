import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../../TaskApi/TaskApi';
import { TASKS_QUERY_KEYS } from '../../TasksQueryKeys';
import type { TasksForCalendarQueryParamsDto, UpdateTaskDto } from '../../dtos';
import { updateTaskInCalendarCache } from '../helpers/updateTaskInCalendarCache';

export const useUpdateTaskInCalendar = ({
  type,
  queryParams,
}: {
  type: 'tasks' | 'time_board';
  queryParams: TasksForCalendarQueryParamsDto;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: TASKS_QUERY_KEYS.updateTaskInCalendar(queryParams),
    mutationFn: ({ taskId, dto }: { taskId: number; dto: UpdateTaskDto }) =>
      taskApi.updateTask({ taskId, dto }),
    onMutate: async (): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TASKS_QUERY_KEYS.updateTaskInCalendar(queryParams),
      });
    },
    onSuccess: async (newTask, context): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TASKS_QUERY_KEYS.tasksCalendar(),
      });

      updateTaskInCalendarCache({
        type,
        queryParams,
        queryClient,
        taskId: context.taskId,
        newTask,
      });
    },
  });
};

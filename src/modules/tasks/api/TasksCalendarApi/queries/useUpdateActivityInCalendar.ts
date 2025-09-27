import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../../TaskApi/TaskApi';
import { TASKS_QUERY_KEYS } from '../../TasksQueryKeys';
import type { TasksForCalendarQueryParamsDto, UpdateActivityDto, UpdateTaskDto } from '../../dtos';
import { updateTaskInCalendarCache } from '../helpers/updateTaskInCalendarCache';

export const useUpdateActivityInCalendar = (queryParams: TasksForCalendarQueryParamsDto) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: TASKS_QUERY_KEYS.updateActivityInCalendar(queryParams),
    mutationFn: ({ taskId, dto }: { taskId: number; dto: UpdateTaskDto }) =>
      taskApi.updateActivity({ activityId: taskId, dto: dto as UpdateActivityDto }),
    onMutate: async (): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TASKS_QUERY_KEYS.updateActivityInCalendar(queryParams),
      });
    },
    onSuccess: async (newTask, context): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TASKS_QUERY_KEYS.tasksCalendar(),
      });

      updateTaskInCalendarCache({
        type: 'activities',
        queryParams,
        queryClient,
        taskId: context.taskId,
        newTask,
      });
    },
  });
};

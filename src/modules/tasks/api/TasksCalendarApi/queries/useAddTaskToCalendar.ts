import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { TasksCalendarUseType } from '../../../shared';
import { taskApi } from '../../TaskApi/TaskApi';
import { TASKS_QUERY_KEYS } from '../../TasksQueryKeys';
import type { CreateTaskDto, TasksForCalendarQueryParamsDto } from '../../dtos';
import { addTaskToCalendarCache } from '../helpers/addTaskToCalendarCache';

export const useAddTaskToCalendar = ({
  type,
  queryParams,
}: {
  type: Omit<TasksCalendarUseType, 'activities'>;
  queryParams: TasksForCalendarQueryParamsDto;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTaskDto) => taskApi.addTask(dto),
    onSuccess: async (createdTask): Promise<void> => {
      await queryClient.cancelQueries({
        queryKey: TASKS_QUERY_KEYS.tasksCalendar(),
      });

      addTaskToCalendarCache({
        type,
        queryParams,
        queryClient,
        createdTask,
      });
    },
  });
};

import { baseApi } from '@/app';
import { UrlTemplateUtil, type Nullable } from '@/shared';
import { Activity, Task, TaskComment } from '../../shared';
import { TasksApiRoutes } from '../TasksApiRoutes';
import type {
  CreateActivityDto,
  CreateTaskCommentDto,
  CreateTaskDto,
  TaskCommentDto,
  UpdateActivityDto,
  UpdateTaskCommentDto,
  UpdateTaskDto,
} from '../dtos';

const DEFAULT_COMMENTS_LIMIT = 20;

export const DEFAULT_CARDS_LIMIT = 20;
export const CARDS_LIST_LIMIT = DEFAULT_CARDS_LIMIT * 1.5;

export interface TaskCommentsMeta {
  total: number;
}

interface TaskCommentsResult {
  result: TaskCommentDto[];
  meta: TaskCommentsMeta;
}

class TaskApi {
  getTask = async (id: number): Promise<Task> => {
    const response = await baseApi.get(UrlTemplateUtil.toPath(TasksApiRoutes.GET_TASK, { id }));

    return Task.fromDto(response.data);
  };

  addTask = async (dto: CreateTaskDto): Promise<Task> => {
    const response = await baseApi.post(TasksApiRoutes.ADD_TASK, dto);

    return Task.fromDto(response.data);
  };

  addActivity = async (dto: CreateActivityDto): Promise<Activity> => {
    const response = await baseApi.post(TasksApiRoutes.ADD_ACTIVITY, dto);

    return Activity.fromDto(response.data);
  };

  updateTask = async ({ taskId, dto }: { taskId: number; dto: UpdateTaskDto }): Promise<Task> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(TasksApiRoutes.UPDATE_TASK, { id: taskId }),
      dto
    );

    return Task.fromDto(response.data);
  };

  updateActivity = async ({
    activityId,
    dto,
  }: {
    activityId: number;
    dto: UpdateActivityDto;
  }): Promise<Activity> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(TasksApiRoutes.UPDATE_ACTIVITY, { id: activityId }),
      dto
    );

    return Activity.fromDto(response.data);
  };

  deleteTask = async (taskId: number): Promise<void> => {
    await baseApi.delete(UrlTemplateUtil.toPath(TasksApiRoutes.DELETE_TASK, { id: taskId }));
  };

  deleteActivity = async (activityId: number): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(TasksApiRoutes.DELETE_ACTIVITY, { id: activityId })
    );
  };

  deleteSubtask = async ({
    taskId,
    subtaskId,
  }: {
    taskId: number;
    subtaskId: number;
  }): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(TasksApiRoutes.DELETE_SUBTASK, { taskId, subtaskId })
    );
  };

  getComments = async ({
    taskId,
    offset = null,
  }: {
    taskId: number;
    offset?: Nullable<number>;
  }): Promise<{ comments: TaskComment[]; meta: TaskCommentsMeta }> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(TasksApiRoutes.GET_TASK_COMMENTS, { taskId }),
      {
        params: {
          limit: DEFAULT_COMMENTS_LIMIT,
          offset,
        },
      }
    );

    const { result: dtos, meta } = response.data as TaskCommentsResult;

    return {
      meta,
      comments: TaskComment.fromDtos(dtos),
    };
  };

  addComment = async ({
    taskId,
    dto,
  }: {
    taskId: number;
    dto: CreateTaskCommentDto;
  }): Promise<TaskComment> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(TasksApiRoutes.ADD_TASK_COMMENT, { taskId }),
      dto
    );

    return TaskComment.fromDto(response.data);
  };

  updateComment = async ({
    taskId,
    commentId,
    dto,
  }: {
    taskId: number;
    commentId: number;
    dto: UpdateTaskCommentDto;
  }): Promise<TaskComment> => {
    const response = await baseApi.put(
      UrlTemplateUtil.toPath(TasksApiRoutes.UPDATE_TASK_COMMENT, { taskId, commentId }),
      dto
    );

    return TaskComment.fromDto(response.data);
  };

  deleteComment = async ({
    taskId,
    commentId,
  }: {
    taskId: number;
    commentId: number;
  }): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(TasksApiRoutes.DELETE_TASK_COMMENT, { taskId, commentId })
    );
  };

  likeComment = async ({
    taskId,
    commentId,
  }: {
    taskId: number;
    commentId: number;
  }): Promise<void> => {
    await baseApi.post(
      UrlTemplateUtil.toPath(TasksApiRoutes.LIKE_TASK_COMMENT, { taskId, commentId })
    );
  };

  unlikeComment = async ({
    taskId,
    commentId,
  }: {
    taskId: number;
    commentId: number;
  }): Promise<void> => {
    await baseApi.post(
      UrlTemplateUtil.toPath(TasksApiRoutes.UNLIKE_TASK_COMMENT, { taskId, commentId })
    );
  };
}

export const taskApi = new TaskApi();

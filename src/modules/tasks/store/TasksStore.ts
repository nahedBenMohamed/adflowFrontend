import { UtcDate, type ManualSorting } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { UpdateActivityDto, UpdateTaskDto, taskApi } from '../api';
import { Activity, Task, type BaseTask } from '../shared';

class TasksStore {
  constructor() {
    makeAutoObservable(this);
  }

  ensureResolved = ({ task, resolved }: { task: BaseTask; resolved: boolean }): BaseTask => {
    task.isResolved = resolved;
    task.resolvedDate = resolved ? UtcDate.now() : null;

    return task;
  };

  update = async ({
    baseTask,
    sorting,
  }: {
    baseTask: BaseTask;
    sorting?: ManualSorting;
  }): Promise<void> => {
    if (baseTask instanceof Task) {
      const dto = UpdateTaskDto.fromTask(baseTask);
      dto.sorting = sorting;

      await this.updateTask({
        taskId: baseTask.id,
        dto,
      });
    } else if (baseTask instanceof Activity) {
      const dto = UpdateActivityDto.fromActivity(baseTask);
      dto.sorting = sorting;

      await this.updateActivity({
        activityId: baseTask.id,
        dto,
      });
    }
  };

  updateTask = async ({ taskId, dto }: { taskId: number; dto: UpdateTaskDto }): Promise<Task> => {
    return await taskApi.updateTask({ taskId, dto });
  };

  updateActivity = async ({
    activityId,
    dto,
  }: {
    activityId: number;
    dto: UpdateActivityDto;
  }): Promise<void> => {
    await taskApi.updateActivity({ activityId, dto });
  };

  deleteTask = async (id: number): Promise<void> => {
    await taskApi.deleteTask(id);
  };

  deleteActivity = async (id: number): Promise<void> => {
    await taskApi.deleteActivity(id);
  };
}

export const tasksStore = new TasksStore();

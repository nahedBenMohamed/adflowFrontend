import { serverEventService, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import {
  UpdateTaskDto,
  taskApi,
  taskBoardApi,
  type CreateTaskDto,
  type TaskBoardFilterDto,
  type TaskListMeta,
} from '../api';
import { type Task } from '../shared';
import { tasksStore } from './TasksStore';

const initialMeta: TaskListMeta = {
  total: 0,
  timeAllocation: [],
};

export class TasksListsPageStore {
  meta: TaskListMeta = initialMeta;
  tasks: Task[] = [];

  isLoaded = false;
  isLoading = false;
  isMetaLoaded = false;
  isLoadingMore = false;

  entityId: Nullable<number> = null;

  constructor(entityId: Nullable<number> = null) {
    this.entityId = entityId;

    makeAutoObservable(this);
  }

  loadData = async ({
    boardId,
    filterDto,
  }: {
    boardId: number;
    filterDto: TaskBoardFilterDto;
  }): Promise<void> => {
    this._unsubscribe();

    try {
      this.isLoading = true;
      this.isLoaded = false;

      const tasks = await taskBoardApi.getTaskBoardCardsForList({ boardId, filter: filterDto });

      this._subscribe({ boardId, filterDto });

      this.tasks = tasks;

      this._loadMeta({ boardId, filterDto });
    } catch (e) {
      throw new Error(`Failed to load tasks for list view on board ${boardId}: ${e}`);
    } finally {
      this.isLoaded = true;
      this.isLoading = false;
    }
  };

  loadMore = async ({
    boardId,
    filterDto,
  }: {
    boardId: number;
    filterDto: TaskBoardFilterDto;
  }): Promise<void> => {
    try {
      if (this.isLoading || this.isLoadingMore || this.tasks.length >= this.meta.total) return;

      this.isLoadingMore = true;

      const tasks = await taskBoardApi.getTaskBoardCardsForList({
        boardId,
        filter: filterDto,
        offset: this.tasks.length,
      });

      this.tasks = [...this.tasks, ...tasks];
    } catch (e) {
      throw new Error(
        `Error while trying to load more tasks on entity board ${boardId} with list view: ${e}`
      );
    } finally {
      this.isLoadingMore = false;
    }
  };

  syncState = (newTask: Task): void => {
    const oldTask = this.tasks.find(t => t.id === newTask.id);

    // task may not be loaded yet, in this case state sync is irrelevant
    if (!oldTask) return;

    this.tasks = this.tasks.map(t => (t.id === newTask.id ? newTask : t));
  };

  toggleResolve = (task: Task): void => {
    const newTask = tasksStore.ensureResolved({ task, resolved: !task.isResolved });

    tasksStore.updateTask({
      taskId: task.id,
      dto: UpdateTaskDto.create({
        isResolved: newTask.isResolved,
      }),
    });
  };

  addTask = async (dto: CreateTaskDto): Promise<void> => {
    try {
      await taskApi.addTask(dto);
    } catch (e) {
      throw new Error(`Failed to add task ${dto.title}: ${e}`);
    }
  };

  deleteTask = (taskId: number): void => {
    this.tasks = this.tasks.filter(t => t.id !== taskId);

    try {
      tasksStore.deleteTask(taskId);
    } catch (e) {
      throw new Error(`Failed to delete task with id ${taskId}: ${e}`);
    }
  };

  private _subscribe = ({
    boardId,
    filterDto,
  }: {
    boardId: number;
    filterDto: TaskBoardFilterDto;
  }): void => {
    serverEventService.on<number>('task:created', async (...args: number[]) => {
      if (args[0]) this._taskCreatedHandler({ taskId: args[0], boardId, filterDto });
    });

    serverEventService.on<number>('task:updated', async (...args: number[]) => {
      if (args[0]) this._taskUpdatedHandler({ taskId: args[0], boardId, filterDto });
    });

    serverEventService.on<number>('task:deleted', async (...args: number[]) => {
      if (args[0]) this._taskDeletedHandler({ taskId: args[0], boardId, filterDto });
    });
  };

  private _unsubscribe = (): void => {
    serverEventService.off('task:created');
    serverEventService.off('task:updated');
    serverEventService.off('task:deleted');
  };

  private _taskCreatedHandler = async ({
    taskId,
    boardId,
    filterDto,
  }: {
    taskId: number;
    boardId: number;
    filterDto: TaskBoardFilterDto;
  }): Promise<void> => {
    const task = await taskBoardApi.getTaskBoardCard({ boardId, taskId, filter: filterDto });

    if (task) this.tasks = [task, ...this.tasks];

    this._updateMeta({ boardId, filterDto });
  };

  private _taskUpdatedHandler = async ({
    taskId,
    boardId,
    filterDto,
  }: {
    taskId: number;
    boardId: number;
    filterDto: TaskBoardFilterDto;
  }): Promise<void> => {
    const taskIdx = this.tasks.findIndex(t => t.id === taskId);

    const taskCard = await taskBoardApi.getTaskBoardCard({ boardId, taskId, filter: filterDto });

    if (taskIdx !== -1 && taskCard) {
      this.syncState(taskCard);
    } else if (taskCard) {
      this.tasks = [taskCard, ...this.tasks];
    } else if (taskIdx !== -1) {
      this.tasks = this.tasks.filter(t => t.id !== taskId);
    }

    this._updateMeta({ boardId, filterDto });
  };

  private _taskDeletedHandler = async ({
    taskId,
    boardId,
    filterDto,
  }: {
    taskId: number;
    boardId: number;
    filterDto: TaskBoardFilterDto;
  }): Promise<void> => {
    this.tasks = this.tasks.filter(t => t.id !== taskId);

    this._updateMeta({ boardId, filterDto });
  };

  private _updateMeta = async ({
    boardId,
    filterDto,
  }: {
    boardId: number;
    filterDto: TaskBoardFilterDto;
  }): Promise<void> => {
    const newMeta = await taskBoardApi.getTasksListMeta({ boardId, filter: filterDto });

    this.meta = newMeta;
  };

  private _loadMeta = async ({
    boardId,
    filterDto,
  }: {
    boardId: number;
    filterDto: TaskBoardFilterDto;
  }): Promise<void> => {
    try {
      this.isMetaLoaded = false;

      await this._updateMeta({ boardId, filterDto });
    } catch (e) {
      throw new Error(`Failed to load tasks meta for list view on board ${boardId}: ${e}`);
    } finally {
      this.isMetaLoaded = true;
    }
  };

  reset = (): void => {
    this.meta = initialMeta;
    this.tasks = [];

    this.isLoading = false;
    this.isLoaded = false;
    this.isMetaLoaded = false;

    this._unsubscribe();
  };
}

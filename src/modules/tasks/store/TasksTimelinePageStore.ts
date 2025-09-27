import { tasksStore } from '@/modules/tasks';
import { serverEventService, type Nullable, type UtcDate } from '@/shared';
import { makeAutoObservable } from 'mobx';
import {
  UpdateTaskDto,
  taskApi,
  taskBoardApi,
  type CreateTaskDto,
  type TaskBoardFilterDto,
  type TaskListMeta,
} from '../api';
import type { BaseTask, Task } from '../shared';

const initialMeta: TaskListMeta = {
  total: 0,
  timeAllocation: [],
};

export class TasksTimelinePageStore {
  boardId: number;

  tasks: Task[] = [];
  meta: TaskListMeta = initialMeta;

  isLoaded = false;
  isLoading = false;
  isMetaLoaded = false;
  isLoadingMore = false;

  constructor(boardId: number) {
    this.boardId = boardId;

    makeAutoObservable(this);
  }

  get canLoadMore(): boolean {
    return this.tasks.length < this.meta.total;
  }

  loadData = async (filterDto: TaskBoardFilterDto): Promise<void> => {
    this._unsubscribe();

    try {
      this.isLoading = true;
      this.isLoaded = false;

      const tasks = await taskBoardApi.getTaskBoardCardsForList({
        boardId: this.boardId,
        filter: filterDto,
      });

      this._subscribe({ boardId: this.boardId, filterDto });

      this.tasks = tasks;

      this._loadMeta({ boardId: this.boardId, filterDto });
    } catch (e) {
      throw new Error(`Error while loading tasks for board ${this.boardId}: ${e}`);
    } finally {
      this.isLoaded = true;
      this.isLoading = false;
    }
  };

  loadMore = async (filterDto: TaskBoardFilterDto): Promise<void> => {
    try {
      if (this.isLoading || this.isLoadingMore || this.tasks.length >= this.meta.total) return;

      this.isLoadingMore = true;

      const tasks = await taskBoardApi.getTaskBoardCardsForList({
        filter: filterDto,
        boardId: this.boardId,
        offset: this.tasks.length,
      });

      this.tasks = [...this.tasks, ...tasks];
    } catch (e) {
      throw new Error(
        `Error while trying to load more tasks on entity board ${this.boardId} with list view: ${e}`
      );
    } finally {
      this.isLoadingMore = false;
    }
  };

  addTask = async (dto: CreateTaskDto): Promise<void> => {
    try {
      await taskApi.addTask(dto);
    } catch (e) {
      throw new Error(`Failed to add task ${dto.title}: ${e}`);
    }
  };

  updateTask = async ({ taskId, dto }: { taskId: number; dto: UpdateTaskDto }): Promise<Task> => {
    const updatedTask = await taskApi.updateTask({ taskId, dto });

    this.tasks = this.tasks.map(t => (t.id === taskId ? updatedTask : t));

    return updatedTask;
  };

  updateTaskTitle = async ({ id, title }: { id: number; title: string }): Promise<void> => {
    await this.updateTask({ taskId: id, dto: UpdateTaskDto.create({ title }) });
  };

  updateTaskResponsibleUser = async ({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }): Promise<void> => {
    await this.updateTask({ taskId: id, dto: UpdateTaskDto.create({ responsibleUserId: userId }) });
  };

  updateTaskStartDate = async ({
    taskId,
    startDate,
  }: {
    taskId: number;
    startDate: Nullable<UtcDate>;
  }): Promise<void> => {
    await this.updateTask({
      taskId,
      dto: UpdateTaskDto.create({ startDate: startDate?.formatISO() }),
    });
  };

  updateTaskEndDate = async ({
    taskId,
    endDate,
  }: {
    taskId: number;
    endDate: Nullable<UtcDate>;
  }): Promise<void> => {
    await this.updateTask({ taskId, dto: UpdateTaskDto.create({ endDate: endDate?.formatISO() }) });
  };

  deleteTask = async (taskId: number): Promise<void> => {
    await taskApi.deleteTask(taskId);

    this.tasks = this.tasks.filter(t => t.id !== taskId);
  };

  syncState = async (task: Task): Promise<void> => {
    this.tasks = this.tasks.map(t => (t.id === task.id ? task : t));
  };

  toggleResolveTask = async (baseTask: BaseTask): Promise<Task> => {
    const task = baseTask as Task;

    const newTask = tasksStore.ensureResolved({ task, resolved: !task.isResolved });

    return await this.updateTask({
      taskId: task.id,
      dto: UpdateTaskDto.create({
        isResolved: newTask.isResolved,
      }),
    });
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
    const taskIdx = this.tasks.findIndex(t => t.id === task?.id);

    if (task && taskIdx === -1) this.tasks = [task, ...this.tasks];

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
    this.tasks = [];
    this.meta = initialMeta;

    this.isLoaded = false;
    this.isLoading = false;
    this.isMetaLoaded = false;
    this.isLoadingMore = false;

    this._unsubscribe();
  };
}

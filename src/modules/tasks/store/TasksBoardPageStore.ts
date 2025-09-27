import { stageApiUtil } from '@/app';
import { StageCode, serverEventService, type ManualSorting, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import {
  UpdateActivityDto,
  UpdateTaskDto,
  taskApi,
  taskBoardApi,
  type CreateTaskDto,
  type TaskBoardFilterDto,
  type TaskBoardMeta,
} from '../api';
import { Activity, Task, TaskGroup, type BaseTask, type TaskBoardFilter } from '../shared';
import { TasksGroupStore } from './TasksGroupStore';
import { tasksStore } from './TasksStore';

const initialMeta: TaskBoardMeta = {
  total: 0,
  timeAllocation: [],
  stages: [],
};

export class TasksBoardPageStore {
  meta: TaskBoardMeta = initialMeta;

  isLoading = false;
  isLoaded = false;
  isLoadingMore = false;
  isMetaLoaded = false;

  entityId: Nullable<number> = null;

  constructor(entityId: Nullable<number> = null) {
    this.entityId = entityId;

    makeAutoObservable(this);
  }

  dropCard = async ({
    task,
    newGroupId,
    sorting,
  }: {
    newGroupId: number;
    task: BaseTask;
    sorting: ManualSorting;
  }): Promise<void> => {
    if (task instanceof Task) {
      const taskGroup = this.taskGroupStore.findGroup(newGroupId);

      if (!taskGroup) throw new Error(`Task group with id ${newGroupId} was not found`);

      task.stageId = newGroupId;

      const dto = UpdateTaskDto.create({
        sorting,
        stageId: task.stageId,
        boardId: task.boardId,
      });

      tasksStore.updateTask({ taskId: task.id, dto });
    } else {
      throw new Error('droppedTask should be an instance of Task class, failed to dropCard');
    }
  };

  toggleResolved = (task: BaseTask): void => {
    const newTask = tasksStore.ensureResolved({ task, resolved: !task.isResolved });

    if (task instanceof Task) {
      const dto = UpdateTaskDto.create({ isResolved: newTask.isResolved });

      tasksStore.updateTask({ taskId: task.id, dto });
    } else if (task instanceof Activity) {
      const dto = UpdateActivityDto.create({ isResolved: newTask.isResolved });

      tasksStore.updateActivity({ activityId: task.id, dto });
    }
  };

  taskGroupStore = new TasksGroupStore({
    dropCard: this.dropCard,
    toggleResolved: this.toggleResolved,
  });

  syncState = (task: Task): void => {
    const taskGroup = this.taskGroupStore.findGroupByTaskId(task.id);

    // task may not be loaded yet, in this case state sync is irrelevant
    if (!taskGroup) return;

    const idx = taskGroup.tasks.findIndex(t => t.id === task.id);
    taskGroup.tasks.splice(idx, 1, task);
  };

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

      this._subscribe({ boardId, filterDto });

      const tasks = await taskBoardApi.getTaskBoardCards({ boardId, filter: filterDto });
      let stages = await stageApiUtil.getStagesByBoardId(boardId);

      if (filterDto.showResolved) stages = stages.filter(s => s.code !== StageCode.DONE);

      const taskGroups = stages.map<TaskGroup>(
        s =>
          new TaskGroup({
            id: s.id,
            count: 0,
            name: s.name,
            code: s.code,
            timeAllocation: [],
            titleColor: s.color,
            tasks: this.getTasksByStageId({ tasks, stageId: s.id }),
            loadMoreFn: (offset?: number) => {
              if (!this.isLoadingMore)
                return this.loadMore({ boardId, stageId: s.id, filterDto, offset });
            },
          })
      );

      this.taskGroupStore.setTaskGroups(taskGroups);
      this._loadMeta({ boardId, filterDto });
    } catch (e) {
      throw new Error(`Failed to load tasks for board with id ${boardId}: ${e}`);
    } finally {
      this.isLoaded = true;
      this.isLoading = false;
    }
  };

  loadMore = async ({
    boardId,
    stageId,
    filterDto,
    offset,
  }: {
    boardId: number;
    stageId: number;
    filterDto: TaskBoardFilterDto;
    offset?: number;
  }): Promise<void> => {
    const tasks = await taskBoardApi.getTaskBoardCards({
      boardId: boardId,
      filter: { ...filterDto, stageIds: [stageId] },
      offset,
    });

    const taskGroup = this.taskGroupStore.findGroup(stageId);

    if (!taskGroup) throw new Error(`Task group with id ${stageId} was not found`);

    // check and filter duplicates out
    const newTasks = tasks.filter(t1 => {
      const isDuplicate = taskGroup.tasks.find(t2 => t2.id === t1.id);

      return !isDuplicate;
    });

    // we do not use push here because we need to update the reference
    // so that the component will rerender
    taskGroup.tasks = [...taskGroup.tasks, ...newTasks];
  };

  getTasksByStageId = ({ tasks, stageId }: { tasks: Task[]; stageId: number }): Task[] => {
    return tasks.filter(t => t.stageId === stageId);
  };

  addTaskToGroup = ({ task, showResolved }: { task: Task; showResolved: boolean }): void => {
    // when user hides resolved tasks, we need to remove resolved tasks from the board
    if (task.isResolved && !showResolved) {
      const oldTaskGroup = this.taskGroupStore.findGroupByTaskId(task.id);

      if (!oldTaskGroup) return;

      const originalIdx = oldTaskGroup.tasks.findIndex(t => t.id === task.id);
      oldTaskGroup.tasks.splice(originalIdx, 1);

      return;
    }

    if (!task.stageId) throw new Error(`Task with id ${task.id} has no stageId`);

    const oldTaskGroup = this.taskGroupStore.findGroupByTaskId(task.id);
    const taskGroup = this.taskGroupStore.findGroup(task.stageId);

    if (!taskGroup) throw new Error(`Task group with id ${task.stageId} was not found`);

    if (oldTaskGroup && taskGroup.id !== oldTaskGroup.id) {
      const originalIdx = oldTaskGroup.tasks.findIndex(t => t.id === task.id);

      oldTaskGroup.tasks.splice(originalIdx, 1);
    }

    const taskIdx = taskGroup.tasks.findIndex(t => t.id === task.id);

    if (taskIdx !== -1) taskGroup.tasks.splice(taskIdx, 1);

    const insertBeforeIdx = taskGroup.tasks.findIndex(t => t.weight > task.weight);

    if (insertBeforeIdx === -1) {
      taskGroup.tasks = [...taskGroup.tasks, task];
    } else {
      taskGroup.tasks = [
        ...taskGroup.tasks.slice(0, insertBeforeIdx),
        task,
        ...taskGroup.tasks.slice(insertBeforeIdx),
      ];
    }
  };

  addTask = async ({
    dto,
    filterDto,
  }: {
    dto: CreateTaskDto;
    filterDto: TaskBoardFilterDto | TaskBoardFilter;
  }): Promise<void> => {
    const newTask = await taskApi.addTask(dto);

    this.addTaskToGroup({ task: newTask, showResolved: filterDto.showResolved !== false });
  };

  deleteTaskFromGroup = (id: number): void => {
    const taskGroup = this.taskGroupStore.findGroupByTaskId(id);

    if (taskGroup) {
      const idx = taskGroup.tasks.findIndex(t => t.id === id);

      taskGroup.tasks.splice(idx, 1);
    }
  };

  deleteTask = (taskId: number): void => {
    tasksStore.deleteTask(taskId);

    this.deleteTaskFromGroup(taskId);
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

    if (task) this.addTaskToGroup({ task, showResolved: filterDto.showResolved !== false });

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
    const taskCard = await taskBoardApi.getTaskBoardCard({ boardId, taskId, filter: filterDto });

    const originalTaskGroup = this.taskGroupStore.findGroupByTaskId(taskId);

    if (taskCard) {
      this.addTaskToGroup({ task: taskCard, showResolved: filterDto.showResolved !== false });
    } else if (originalTaskGroup) {
      this.deleteTaskFromGroup(taskId);
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
    this.deleteTaskFromGroup(taskId);

    this._updateMeta({ boardId, filterDto });
  };

  private _updateMeta = async ({
    boardId,
    filterDto,
  }: {
    boardId: number;
    filterDto: TaskBoardFilterDto;
  }): Promise<void> => {
    const newMeta = await taskBoardApi.getTaskBoardMeta({ boardId, filter: filterDto });

    this.meta = newMeta;

    for (const newStageMeta of this.meta.stages) {
      this.taskGroupStore.updateMetaById({
        groupId: newStageMeta.id,
        count: newStageMeta.total,
        timeAllocation: newStageMeta.timeAllocation,
      });
    }
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
      throw new Error(`Failed to load meta for board with id ${boardId}: ${e}`);
    } finally {
      this.isMetaLoaded = true;
    }
  };

  reset = () => {
    this.meta = initialMeta;

    this.isLoading = false;
    this.isLoaded = false;
    this.isLoadingMore = false;
    this.isMetaLoaded = false;

    this.entityId = null;

    this.taskGroupStore.taskGroups = [];

    this._unsubscribe();
  };
}

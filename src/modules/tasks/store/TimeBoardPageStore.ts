import { UtcDate, serverEventService, shallowEqual, type ManualSorting } from '@/shared';
import type { TFunction } from 'i18next';
import { makeAutoObservable } from 'mobx';
import {
  TimeBoardFilterDto,
  UpdateActivityDto,
  UpdateTaskDto,
  taskApi,
  timeBoardApi,
  type CreateTaskDto,
  type UserTimeAllocation,
} from '../api';
import {
  Activity,
  DeadlineType,
  Task,
  TaskGroup,
  TaskView,
  type BaseTask,
  type TimeBoardFilter,
} from '../shared';
import { TasksGroupStore } from './TasksGroupStore';
import { tasksStore } from './TasksStore';

export class TimeBoardPageStore {
  timeAllocation: UserTimeAllocation[] = [];

  filter: TimeBoardFilter = {};
  isCalendarInitialFilterSet = false;

  isLoading = false;
  isMetaLoaded = false;

  get filterDto(): TimeBoardFilterDto {
    return TimeBoardFilterDto.fromModel(this.filter);
  }

  // we need to check showResolved this way because by default (when showResolved is undefined)
  // we are showing resolved tasks
  get areResolvedTasksVisible(): boolean {
    return this.filter.showResolved !== false;
  }

  get totalMeta(): number {
    if (this.isMetaLoaded) {
      return Object.values(DeadlineType).reduce((acc, code) => {
        if (!this.areResolvedTasksVisible && code === DeadlineType.RESOLVED) {
          return acc;
        }

        const taskGroup = this.taskGroupStore.findGroupByCode(code);

        return taskGroup ? acc + taskGroup.count : acc;
      }, 0);
    }

    return 0;
  }

  get isFilterSet(): boolean {
    return !shallowEqual({ obj1: { ...this.filter }, obj2: {} });
  }

  setFilter = (filter: TimeBoardFilter): void => {
    this.filter = filter;
  };

  markCalendarFilterAsInitiallySet = (): void => {
    this.isCalendarInitialFilterSet = true;
  };

  unmarkCalendarFilterAsInitiallySet = (): void => {
    this.isCalendarInitialFilterSet = false;
  };

  dropCard = ({
    task,
    newGroupId,
    sorting,
  }: {
    task: BaseTask;
    newGroupId: number;
    sorting: ManualSorting;
  }): void => {
    const duration = task.duration() ?? 1800;
    const deadlineType = this.taskGroupStore.findGroup(newGroupId)?.code as DeadlineType;

    switch (deadlineType) {
      case DeadlineType.UNALLOCATED:
        return;

      case DeadlineType.OVERDUE:
        return;

      case DeadlineType.TODAY:
        if (task.isResolved) tasksStore.ensureResolved({ task, resolved: false });

        task.startDate = UtcDate.now();
        task.endDate = task.startDate.endOfDay();

        break;

      case DeadlineType.TOMORROW:
        if (task.isResolved) tasksStore.ensureResolved({ task, resolved: false });

        const startDate = task.startDate ?? UtcDate.now();
        const startHours = startDate.hours;
        const startMinutes = startDate.minutes;

        task.startDate = UtcDate.now()
          .setSeconds(0)
          .addDays(1)
          .setHours(startHours)
          .setMinutes(startMinutes);
        task.endDate = task.startDate.addTimestamp(duration);

        break;

      case DeadlineType.RESOLVED:
        tasksStore.ensureResolved({ task, resolved: true });

        break;

      case DeadlineType.UPCOMING:
        return;

      default:
        throw new Error(`Unknown task deadline type: ${newGroupId}`);
    }

    tasksStore.update({ baseTask: task, sorting });
  };

  syncState = (task: BaseTask): void => {
    const taskGroup = this.taskGroupStore.findGroupByTaskId(task.id);

    // task may not be loaded yet, in this case state sync is irrelevant
    if (!taskGroup) return;

    const idx = taskGroup.tasks.findIndex(t => t.id === task.id);
    taskGroup.tasks.splice(idx, 1, task);
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

  constructor() {
    makeAutoObservable(this);
  }

  loadData = async ({ filter, t }: { filter: TimeBoardFilter; t: TFunction }): Promise<void> => {
    this._unsubscribe();
    this.setFilter(filter);

    try {
      this.isLoading = true;

      const tasks = await timeBoardApi.getCardsByTime(this.filterDto);

      this._subscribe();

      const initialTaskGroups: TaskGroup[] = [
        new TaskGroup({
          id: -1,
          count: 0,
          timeAllocation: [],
          dropForbidden: true,
          name: t('unallocated'),
          code: DeadlineType.UNALLOCATED,
          tasks: this.getUnallocatedTasks(tasks),
          titleColor: 'var(--button-text-graphite-primary-text)',
          loadMoreFn: (offset?: number) =>
            this.loadMore({ code: DeadlineType.UNALLOCATED, offset }),
        }),
        new TaskGroup({
          id: -2,
          count: 0,
          timeAllocation: [],
          name: t('overdue'),
          dropForbidden: true,
          code: DeadlineType.OVERDUE,
          tasks: this.getOverdueTasks(tasks),
          titleColor: 'var(--button-text-red-default)',
          loadMoreFn: (offset?: number) => this.loadMore({ code: DeadlineType.OVERDUE, offset }),
        }),
        new TaskGroup({
          id: -3,
          count: 0,
          name: t('today'),
          timeAllocation: [],
          code: DeadlineType.TODAY,
          tasks: this.getTodayTasks(tasks),
          titleColor: 'var(--button-text-green-default)',
          loadMoreFn: (offset?: number) => this.loadMore({ code: DeadlineType.TODAY, offset }),
        }),
        new TaskGroup({
          id: -4,
          count: 0,
          timeAllocation: [],
          name: t('tomorrow'),
          code: DeadlineType.TOMORROW,
          tasks: this.getTomorrowTasks(tasks),
          titleColor: 'var(--button-text-graphite-priory-text)',
          loadMoreFn: (offset?: number) => this.loadMore({ code: DeadlineType.TOMORROW, offset }),
        }),
        new TaskGroup({
          id: -5,
          count: 0,
          timeAllocation: [],
          dropForbidden: true,
          name: t('upcoming'),
          code: DeadlineType.UPCOMING,
          tasks: this.getUpcomingTasks(tasks),
          titleColor: 'var(--button-text-graphite-primary-text)',
          loadMoreFn: (offset?: number) => this.loadMore({ code: DeadlineType.UPCOMING, offset }),
        }),
      ];

      if (this.areResolvedTasksVisible)
        initialTaskGroups.push(
          new TaskGroup({
            id: -6,
            count: 0,
            timeAllocation: [],
            name: t('resolved'),
            code: DeadlineType.RESOLVED,
            tasks: this.getResolvedTasks(tasks),
            titleColor: 'var(--button-text-graphite-secondary-text)',
            loadMoreFn: (offset?: number) => this.loadMore({ code: DeadlineType.RESOLVED, offset }),
          })
        );

      this.taskGroupStore.setTaskGroups(initialTaskGroups);
      this._loadMeta();
    } catch (e) {
      throw new Error(`Error while loading tasks by deadline: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  loadMore = async ({ code, offset }: { code: DeadlineType; offset?: number }): Promise<void> => {
    const tasks = await timeBoardApi.getCardsByTime({ ...this.filterDto, groups: [code] }, offset);

    const taskGroup = this.taskGroupStore.findGroupByCode(code);

    // check and filter duplicates out
    if (taskGroup) {
      const newTasks = tasks.filter(t1 => {
        const isDuplicate = taskGroup.tasks.find(t2 => t2.id === t1.id);

        return !isDuplicate;
      });

      // we do not use push here because we need to update the reference
      // so that the component will rerender
      taskGroup.tasks = [...taskGroup.tasks, ...newTasks];
    }
  };

  addTaskToGroup = (task: BaseTask): void => {
    // when user hides resolved tasks, we need to remove resolved tasks from the board
    if (!this.areResolvedTasksVisible && task.isResolved) {
      const oldTaskGroup = this.taskGroupStore.findGroupByTaskId(task.id);

      if (!oldTaskGroup) return;

      const originalIdx = oldTaskGroup.tasks.findIndex(t => t.id === task.id);
      oldTaskGroup.tasks.splice(originalIdx, 1);

      return;
    }

    const oldTaskGroup = this.taskGroupStore.findGroupByTaskId(task.id);
    const taskGroup = this.taskGroupStore.findGroupByCode(task.deadlineType());

    if (!taskGroup)
      throw new Error(`Task group for deadline type ${task.deadlineType()} was not found`);

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

  addTask = async (dto: CreateTaskDto): Promise<void> => {
    const newTask = await taskApi.addTask(dto);

    this.addTaskToGroup(newTask);
  };

  deleteTaskFromGroup = (id: number): void => {
    const taskGroup = this.taskGroupStore.findGroupByTaskId(id);

    if (taskGroup) {
      const idx = taskGroup.tasks.findIndex(t => t.id === id);

      taskGroup.tasks.splice(idx, 1);
    }
  };

  deleteTaskCard = (taskId: number): void => {
    tasksStore.deleteTask(taskId);

    this.deleteTaskFromGroup(taskId);
  };

  getUnallocatedTasks = (tasks: BaseTask[]): BaseTask[] => {
    return tasks.filter(t => t.isUnallocated() && !t.isResolved);
  };

  getOverdueTasks = (tasks: BaseTask[]): BaseTask[] => {
    return tasks.filter(t => t.isTaskExpired() && !t.isResolved);
  };

  getTodayTasks = (tasks: BaseTask[]): BaseTask[] => {
    return tasks.filter(t => t.isTaskToday() && !t.isResolved && !t.isTaskExpired());
  };

  getTomorrowTasks = (tasks: BaseTask[]): BaseTask[] => {
    return tasks.filter(t => t.isTaskTomorrow() && !t.isResolved && !t.isTaskExpired());
  };

  getUpcomingTasks = (tasks: BaseTask[]): BaseTask[] => {
    return tasks.filter(t => t.isTaskUpcoming() && !t.isResolved && !t.isTaskExpired());
  };

  getResolvedTasks = (tasks: BaseTask[]): BaseTask[] => {
    return tasks
      .filter(t => t.isResolved)
      .sort((t1, t2) => t1.compareResolvedDate(t2))
      .reverse();
  };

  private _subscribe = (): void => {
    serverEventService.on<any>('task:created', async (...args: number[]) => {
      if (args[0]) this._taskCreatedHandler({ type: TaskView.TASK, taskId: args[0] });
    });
    serverEventService.on<any>('task:updated', async (...args: number[]) => {
      if (args[0]) this._taskUpdatedHandler({ type: TaskView.TASK, taskId: args[0] });
    });
    serverEventService.on<number>('task:deleted', async (...args: number[]) => {
      if (args[0]) this._taskDeletedHandler(args[0]);
    });
    serverEventService.on<any>('activity:created', async (...args: number[]) => {
      if (args[0]) this._taskCreatedHandler({ type: TaskView.ACTIVITY, taskId: args[0] });
    });
    serverEventService.on<any>('activity:updated', async (...args: number[]) => {
      if (args[0]) this._taskUpdatedHandler({ type: TaskView.ACTIVITY, taskId: args[0] });
    });
    serverEventService.on<number>('activity:deleted', async (...args: number[]) => {
      if (args[0]) this._taskDeletedHandler(args[0]);
    });
  };

  private _unsubscribe = (): void => {
    serverEventService.off('task:created');
    serverEventService.off('task:updated');
    serverEventService.off('task:deleted');
    serverEventService.off('activity:created');
    serverEventService.off('activity:updated');
    serverEventService.off('activity:deleted');
  };

  private _taskCreatedHandler = async ({
    type,
    taskId,
  }: {
    type: TaskView;
    taskId: number;
  }): Promise<void> => {
    const task = await timeBoardApi.getCardByTime({ type, taskId, filter: this.filterDto });

    if (task && this.filter.ownerIds && !this.filter.ownerIds.includes(task.responsibleUserId))
      return;

    if (task) this.addTaskToGroup(task);

    this._updateMeta();
  };

  private _taskUpdatedHandler = async ({
    type,
    taskId,
  }: {
    type: TaskView;
    taskId: number;
  }): Promise<void> => {
    const taskCard = await timeBoardApi.getCardByTime({ type, taskId, filter: this.filterDto });

    const originalTaskGroup = this.taskGroupStore.findGroupByTaskId(taskId);

    if (taskCard) {
      this.addTaskToGroup(taskCard);
    } else if (originalTaskGroup) {
      this.deleteTaskFromGroup(taskId);
    }

    this._updateMeta();
  };

  private _taskDeletedHandler = async (taskId: number): Promise<void> => {
    this.deleteTaskFromGroup(taskId);

    this._updateMeta();
  };

  private _updateMeta = async (): Promise<void> => {
    const newMeta = await timeBoardApi.getCardsByTimeMeta(this.filterDto);

    this.timeAllocation = newMeta.timeAllocation;

    Object.values(DeadlineType).forEach(code => {
      if (!this.areResolvedTasksVisible && code === DeadlineType.RESOLVED) return;

      const meta = newMeta[code];

      this.taskGroupStore.updateMetaByCode({
        code,
        count: meta?.total ?? 0,
        timeAllocation: meta?.timeAllocation,
      });
    });
  };

  private _loadMeta = async (): Promise<void> => {
    try {
      this.isMetaLoaded = false;

      await this._updateMeta();
    } catch (e) {
      throw new Error(`Failed to load meta for tasks by deadline page: ${e}`);
    } finally {
      this.isMetaLoaded = true;
    }
  };

  reset = (): void => {
    this.timeAllocation = [];

    this.filter = {};

    this.isLoading = false;
    this.isMetaLoaded = false;

    this._unsubscribe();
  };
}

export const timeBoardPageStore = new TimeBoardPageStore();

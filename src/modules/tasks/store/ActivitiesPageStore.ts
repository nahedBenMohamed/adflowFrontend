import { StageCode, serverEventService, shallowEqual, type ManualSorting } from '@/shared';
import type { TFunction } from 'i18next';
import { makeAutoObservable } from 'mobx';
import {
  ActivityCardsFilterDto,
  UpdateActivityDto,
  activityBoardApi,
  type ActivityCardByTypeMeta,
  type ActivityCardsMeta,
} from '../api';
import { Activity, TaskGroup, type ActivityCardsFilter, type BaseTask } from '../shared';
import { activityTypeStore } from './ActivityTypeStore';
import { TasksGroupStore } from './TasksGroupStore';
import { tasksStore } from './TasksStore';

export class ActivitiesPageStore {
  totalCount = 0;
  resolvedTotal = 0;

  isLoading = false;
  isMetaLoaded = false;

  filter: ActivityCardsFilter = {};
  isCalendarInitialFilterSet = false;

  get filterDto(): ActivityCardsFilterDto {
    return ActivityCardsFilterDto.fromModel({ ...this.filter });
  }

  // we need to check showResolved this way because by default (when showResolved is undefined)
  // we are showing resolved tasks
  get areResolvedActivitiesVisible(): boolean {
    return this.filter.showResolved !== false;
  }

  get isFilterSet(): boolean {
    return !shallowEqual({ obj1: { ...this.filter }, obj2: {} });
  }

  setFilter = (filter: ActivityCardsFilter): void => {
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
    if (task instanceof Activity) {
      const code = this.taskGroupStore.findGroup(newGroupId)?.code;

      tasksStore.ensureResolved({ task, resolved: code === StageCode.DONE });

      // activities group with code StageCode.DONE is a synthetic group with id = -1, it's not an activity type
      if (code !== StageCode.DONE) task.activityTypeId = newGroupId;

      tasksStore.update({ baseTask: task, sorting });
    } else {
      throw new Error('droppedTask should be an instance of Activity class, failed to dropCard');
    }
  };

  toggleResolved = (activity: BaseTask): void => {
    const newActivity = tasksStore.ensureResolved({
      task: activity,
      resolved: !activity.isResolved,
    });

    const dto = UpdateActivityDto.create({ isResolved: newActivity.isResolved });

    tasksStore.updateActivity({ activityId: activity.id, dto });
  };

  taskGroupStore = new TasksGroupStore({
    dropCard: this.dropCard,
    toggleResolved: this.toggleResolved,
  });

  constructor() {
    makeAutoObservable(this);
  }

  getResolvedActivities = (activityCards: Activity[]): Activity[] => {
    return activityCards.filter(a => a.isResolved);
  };

  loadData = async ({
    filter,
    t,
  }: {
    filter: ActivityCardsFilter;
    t: TFunction;
  }): Promise<void> => {
    this._unsubscribe();
    this.setFilter(filter);

    try {
      this.isLoading = true;

      const activityCards = await activityBoardApi.getActivityCardsByType(this.filterDto);

      this._subscribe();

      const taskGroups = activityTypeStore.activeActivityTypes.map<TaskGroup>(
        activityType =>
          new TaskGroup({
            count: 0,
            code: null,
            id: activityType.id,
            name: activityType.name,
            titleColor: 'var(--button-text-graphite-priory-text)',
            tasks: this.getByType({ activityCards, activityTypeId: activityType.id }).filter(
              i => !i.isResolved
            ),
            loadMoreFn: (offset?: number) =>
              this.loadMore({ activityTypeId: activityType.id, offset }),
          })
      );

      if (this.areResolvedActivitiesVisible) {
        taskGroups.push(
          new TaskGroup({
            id: -1,
            count: 0,
            name: t('resolved'),
            code: StageCode.DONE,
            tasks: this.getResolvedActivities(activityCards),
            titleColor: 'var(--button-text-graphite-secondary-text)',
            loadMoreFn: (offset?: number) => this.loadMoreResolved(offset),
          })
        );
      }

      this.taskGroupStore.setTaskGroups(taskGroups);
      this._loadMeta();
    } catch (e) {
      throw new Error(`Error while loading activities: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  loadMore = async ({
    activityTypeId,
    offset,
  }: {
    activityTypeId: number;
    offset?: number;
  }): Promise<void> => {
    const activities = await activityBoardApi.getActivityCardsByType(
      { ...this.filterDto, typeIds: [activityTypeId] },
      offset
    );

    const activityGroup = this.taskGroupStore.findGroup(activityTypeId);

    if (!activityGroup) throw new Error(`Activity group with id ${activityTypeId} was not found`);

    // check and filter duplicates out
    const newActivities = activities.filter(a1 => {
      const isDuplicate = activityGroup.tasks.find(a2 => a2.id === a1.id);

      return !isDuplicate;
    });

    // we do not use push here because we need to update the reference
    // so that the component will rerender
    activityGroup.tasks = [...activityGroup.tasks, ...newActivities];
  };

  loadMoreResolved = async (offset?: number): Promise<void> => {
    const activities = await activityBoardApi.getActivityCardsByType(
      { ...this.filterDto, typeIds: [], showResolved: true },
      offset
    );

    const activityGroup = this.taskGroupStore.findGroupByCode(StageCode.DONE);

    if (!activityGroup) throw new Error(`Activity group with code ${StageCode.DONE} was not found`);

    // check and filter duplicates out
    const newActivities = activities.filter(a1 => {
      const isDuplicate = activityGroup.tasks.find(a2 => a2.id === a1.id);

      return !isDuplicate;
    });

    // we do not use push here because we need to update the reference
    // so that the component will rerender
    activityGroup.tasks = [...activityGroup.tasks, ...newActivities];
  };

  getByType = ({
    activityCards,
    activityTypeId,
  }: {
    activityCards: Activity[];
    activityTypeId: number;
  }): Activity[] => {
    return activityCards.filter(a => a.activityTypeId === activityTypeId);
  };

  getActivityTypeMeta = ({
    meta,
    activityTypeId,
  }: {
    meta: ActivityCardsMeta;
    activityTypeId: number;
  }): ActivityCardByTypeMeta => {
    const metaByType = meta.types.find(i => i.id === activityTypeId);

    if (!metaByType)
      throw new Error(`Meta was not found for activity type with id ${activityTypeId}`);

    return metaByType;
  };

  addActivityToGroup = (activity: Activity): void => {
    // if activity is resolved we remove it from old group ...
    if (activity.isResolved) {
      const oldTaskGroup = this.taskGroupStore.findGroupByTaskId(activity.id);

      if (!oldTaskGroup) return;

      const originalIdx = oldTaskGroup.tasks.findIndex(t => t.id === activity.id);
      oldTaskGroup.tasks.splice(originalIdx, 1);

      // ... but if resolved group is visible we than insert it into it
      if (this.areResolvedActivitiesVisible) {
        const resolvedGroup = this.taskGroupStore.findGroupByCode(StageCode.DONE);

        if (!resolvedGroup) return;

        const insertBeforeIdx = resolvedGroup.tasks.findIndex(a => a.weight > activity.weight);

        if (insertBeforeIdx === -1) {
          resolvedGroup.tasks = [...resolvedGroup.tasks, activity];
        } else {
          resolvedGroup.tasks = [
            ...resolvedGroup.tasks.slice(0, insertBeforeIdx),
            activity,
            ...resolvedGroup.tasks.slice(insertBeforeIdx),
          ];
        }
      }

      return;
    }

    const oldActivityGroup = this.taskGroupStore.findGroupByTaskId(activity.id);
    const activityGroup = this.taskGroupStore.findGroup(activity.activityTypeId);

    if (!activityGroup)
      throw new Error(`Task group with id ${activity.activityTypeId} was not found`);

    if (oldActivityGroup && activityGroup.id !== oldActivityGroup.id) {
      const originalIdx = oldActivityGroup.tasks.findIndex(a => a.id === activity.id);

      oldActivityGroup.tasks.splice(originalIdx, 1);
    }

    const activityIdx = activityGroup.tasks.findIndex(a => a.id === activity.id);

    if (activityIdx !== -1) activityGroup.tasks.splice(activityIdx, 1);

    const insertBeforeIdx = activityGroup.tasks.findIndex(a => a.weight > activity.weight);

    if (insertBeforeIdx === -1) {
      activityGroup.tasks = [...activityGroup.tasks, activity];
    } else {
      activityGroup.tasks = [
        ...activityGroup.tasks.slice(0, insertBeforeIdx),
        activity,
        ...activityGroup.tasks.slice(insertBeforeIdx),
      ];
    }
  };

  deleteActivityFromGroup = (activityId: number): void => {
    const activityGroup = this.taskGroupStore.findGroupByTaskId(activityId);

    if (activityGroup) {
      const idx = activityGroup.tasks.findIndex(a => a.id === activityId);

      activityGroup.tasks.splice(idx, 1);
    }
  };

  private _subscribe = (): void => {
    serverEventService.on<any>('activity:created', async (...args: number[]) => {
      if (args[0]) this._activityCreatedHandler(args[0]);
    });
    serverEventService.on<any>('activity:updated', async (...args: number[]) => {
      if (args[0]) this._activityUpdatedHandler(args[0]);
    });
    serverEventService.on<number>('activity:deleted', async (...args: number[]) => {
      if (args[0]) this._activityDeletedHandler(args[0]);
    });
  };

  private _unsubscribe = (): void => {
    serverEventService.off('activity:created');
    serverEventService.off('activity:updated');
    serverEventService.off('activity:deleted');
  };

  private _activityCreatedHandler = async (activityId: number): Promise<void> => {
    const activityCard = await activityBoardApi.getActivityCard({
      activityId,
      filter: this.filter,
    });

    if (activityCard) this.addActivityToGroup(activityCard);

    this._updateMeta();
  };

  private _activityUpdatedHandler = async (activityId: number): Promise<void> => {
    const activityCard = await activityBoardApi.getActivityCard({
      activityId,
      filter: this.filterDto,
    });

    const originalActivityGroup = this.taskGroupStore.findGroupByTaskId(activityId);

    if (activityCard) {
      this.addActivityToGroup(activityCard);
    } else if (originalActivityGroup) {
      this.deleteActivityFromGroup(activityId);
    }

    this._updateMeta();
  };

  private _activityDeletedHandler = async (activityId: number): Promise<void> => {
    this.deleteActivityFromGroup(activityId);

    this._updateMeta();
  };

  private _updateMeta = async (): Promise<void> => {
    const newMeta = await activityBoardApi.getActivityCardsMeta(this.filterDto);

    this.totalCount = newMeta.total;
    this.resolvedTotal = newMeta.resolvedTotal;

    for (const newTypeMeta of newMeta.types) {
      this.taskGroupStore.updateMetaById({
        groupId: newTypeMeta.id,
        count: newTypeMeta.totalCount,
      });
    }

    const doneGroup = this.taskGroupStore.findGroupByCode(StageCode.DONE);

    if (doneGroup) doneGroup.count = newMeta.resolvedTotal;
  };

  private _loadMeta = async (): Promise<void> => {
    try {
      this.isMetaLoaded = false;

      await this._updateMeta();
    } catch (e) {
      throw new Error(`Error while loading meta: ${e}`);
    } finally {
      this.isMetaLoaded = true;
    }
  };

  reset = (): void => {
    this.totalCount = 0;
    this.resolvedTotal = 0;

    this.isLoading = false;
    this.isMetaLoaded = false;

    this.filter = {};

    this._unsubscribe();
  };
}

export const activitiesPageStore = new ActivitiesPageStore();

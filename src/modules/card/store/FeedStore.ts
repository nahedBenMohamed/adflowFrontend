import { noteApi } from '@/modules/card';
import {
  taskApi,
  type BaseTask,
  type CreateActivityDto,
  type CreateTaskDto,
  type Task,
  type UpdateActivityDto,
  type UpdateTaskDto,
} from '@/modules/tasks';
import { voximplantApi, type UpdateVoximplantCallDto } from '@/modules/telephony';
import { batchRequest, FeedItemFilter, type FeedGroup, type FeedItem, type Note } from '@/shared';
import { computed, makeAutoObservable } from 'mobx';
import { feedApi, type CreateNoteDto, type UpdateNoteDto } from '../api';
import { FeedItemType, type FeedItemMeta } from '../shared';

export class FeedStore {
  feedItems: FeedItem[] = [];
  meta: FeedItemMeta = {
    total: 0,
    offset: 0,
  };

  isLoading = false;
  isLoadingMore = false;
  isLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  fromNote = (note: Note): FeedItem => {
    return {
      id: note.id,
      createdAt: note.createdAt,
      type: FeedItemType.NOTE,
      data: note,
    };
  };

  fromTask = (task: BaseTask): FeedItem => {
    return {
      id: task.id,
      createdAt: task.createdAt,
      type: task.isTaskView() ? FeedItemType.TASK : FeedItemType.ACTIVITY,
      data: task,
    };
  };

  getFeedItems = async ({
    entityId,
    activeFilter,
  }: {
    entityId: number;
    activeFilter: FeedItemFilter;
  }): Promise<void> => {
    try {
      this.isLoading = true;

      const { meta, feedItems } = await feedApi.getFeedItems({ entityId, filter: activeFilter });

      this.feedItems = feedItems;
      this.meta = meta;
    } catch (e) {
      throw new Error(
        `Error while loading feed items for entity ${entityId} with filter ${activeFilter}: ${e}`
      );
    } finally {
      this.isLoading = false;
      this.isLoaded = true;
    }
  };

  loadMoreFeedItems = async ({
    entityId,
    activeFilter,
  }: {
    entityId: number;
    activeFilter: FeedItemFilter;
  }): Promise<void> => {
    if (this.meta.offset < this.meta.total && !this.isLoadingMore && !this.isLoading) {
      try {
        this.isLoadingMore = true;

        const { meta, feedItems } = await feedApi.getFeedItems({
          entityId,
          filter: activeFilter,
          offset: this.meta.offset,
        });

        this.meta = meta;
        this.feedItems.push(...feedItems);
      } catch (e) {
        throw new Error(
          `Error while loading more feed items for entity ${entityId} with filter ${activeFilter}: ${e}`
        );
      } finally {
        this.isLoadingMore = false;
      }
    }
  };

  clearFeedItems = (): void => {
    this.feedItems = [];
  };

  @computed.struct
  getFeedGroups = (): FeedGroup[] => {
    const feedGroups: FeedGroup[] = [];

    this.feedItems.forEach(item => {
      const date = item.createdAt.startOfDay();
      const feedGroup = feedGroups.find(group => group.date.equals(date));

      /** temporary solution until orders, rental_orders, shipments are added to feed */
      if (
        [FeedItemType.ORDER, FeedItemType.RENTAL_ORDER, FeedItemType.SHIPMENT].includes(item.type)
      )
        return;

      if (feedGroup) {
        feedGroup.items.push(item);
      } else {
        feedGroups.push({
          date: date,
          items: [item],
        });
      }
    });

    return feedGroups.sort((a: FeedGroup, b: FeedGroup) => (a.date.greaterThan(b.date) ? -1 : 1));
  };

  addNote = async ({
    entityId,
    dto,
    activeFilter,
  }: {
    entityId: number;
    dto: CreateNoteDto;
    activeFilter: FeedItemFilter;
  }): Promise<boolean> => {
    const createdNote = await noteApi.addNote({ entityId, dto });

    if (
      activeFilter === FeedItemFilter.NOTES ||
      activeFilter === FeedItemFilter.ALL ||
      (activeFilter === FeedItemFilter.FILES && createdNote.fileLinks.length > 0)
    )
      this.feedItems.unshift(this.fromNote(createdNote));

    return Boolean(createdNote);
  };

  updateNote = async ({ note, feedItemId }: { note: Note; feedItemId: number }): Promise<void> => {
    const feedItemIdx = this.feedItems.findIndex(
      i => i.id === feedItemId && i.type === FeedItemType.NOTE
    );

    if (feedItemIdx === -1)
      throw new Error(`Feed item with note type and id ${feedItemId} not found`);

    this.feedItems.splice(feedItemIdx, 1, this.fromNote(note));

    const dto: UpdateNoteDto = {
      text: note.text,
      fileIds: note.fileLinks.map<string>(f => f.fileInfo.fileId),
    };

    await noteApi.updateNote({ entityId: note.entityId, noteId: note.id, dto });
  };

  deleteNote = async ({
    entityId,
    noteId,
    feedItemId,
  }: {
    entityId: number;
    noteId: number;
    feedItemId: number;
  }): Promise<void> => {
    const feedItemIdx = this.feedItems.findIndex(
      i => i.id === feedItemId && i.type === FeedItemType.NOTE
    );

    if (feedItemIdx === -1) {
      throw new Error(`Feed item with note type and id ${feedItemId} not found`);
    }

    this.feedItems.splice(feedItemIdx, 1);

    await noteApi.deleteNote({ entityId, noteId });
  };

  addTask = async ({
    dto,
    activeFilter,
  }: {
    dto: CreateTaskDto;
    activeFilter: FeedItemFilter;
  }): Promise<boolean> => {
    const createdTask = await taskApi.addTask(dto);

    if (
      activeFilter === FeedItemFilter.TASKS ||
      activeFilter === FeedItemFilter.ALL ||
      (activeFilter === FeedItemFilter.FILES && createdTask.fileLinks.length > 0)
    )
      this.feedItems.unshift(this.fromTask(createdTask));

    return Boolean(createdTask);
  };

  addRepeatingTask = async ({
    dtos,
    activeFilter,
  }: {
    dtos: CreateTaskDto[];
    activeFilter: FeedItemFilter;
  }): Promise<boolean> => {
    let success: boolean = false;

    await batchRequest({
      array: dtos,
      cb: async (dto): Promise<void> => {
        success = await this.addTask({ dto, activeFilter });
      },
    });

    return success;
  };

  addActivity = async ({
    dto,
    activeFilter,
  }: {
    dto: CreateActivityDto;
    activeFilter: FeedItemFilter;
  }): Promise<boolean> => {
    const createdActivity = await taskApi.addActivity(dto);

    if (activeFilter === FeedItemFilter.ACTIVITIES || activeFilter === FeedItemFilter.ALL)
      this.feedItems.unshift(this.fromTask(createdActivity));

    return Boolean(createdActivity);
  };

  updateTask = async ({ taskId, dto }: { taskId: number; dto: UpdateTaskDto }): Promise<void> => {
    await taskApi.updateTask({ taskId, dto });
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

  updateCall = async ({
    sessionId,
    dto,
  }: {
    sessionId: string;
    dto: UpdateVoximplantCallDto;
  }): Promise<void> => {
    await voximplantApi.patchVoximplantCall({ externalId: sessionId, dto });
  };

  deleteTask = async ({
    taskId,
    feedItemId,
  }: {
    taskId: number;
    feedItemId: number;
  }): Promise<void> => {
    const feedItemIdx = this.feedItems.findIndex(
      i => i.id === feedItemId && i.type === FeedItemType.TASK
    );

    if (feedItemIdx === -1)
      throw new Error(`Feed item with task type and id ${feedItemId} not found`);

    this.feedItems.splice(feedItemIdx, 1);

    await taskApi.deleteTask(taskId);
  };

  deleteActivity = async ({
    activityId,
    feedItemId,
  }: {
    activityId: number;
    feedItemId: number;
  }): Promise<void> => {
    const feedItemIdx = this.feedItems.findIndex(
      i => i.id === feedItemId && i.type === FeedItemType.ACTIVITY
    );

    if (feedItemIdx === -1)
      throw new Error(`Feed item with activity type and id ${feedItemId} not found`);

    this.feedItems.splice(feedItemIdx, 1);

    await taskApi.deleteActivity(activityId);
  };

  getById = (id: number): FeedItem => {
    const feedItem = this.feedItems.find(i => i.id === id);

    if (!feedItem) throw new Error(`Feed item with id ${id} not found`);

    return feedItem;
  };

  syncTaskState = ({ newState, feedItemId }: { newState: Task; feedItemId: number }): void => {
    const feedItem = this.getById(feedItemId);

    if (feedItem.type !== FeedItemType.TASK)
      throw new Error(`Feed item ${feedItem.id} is not a task`);

    const task = feedItem.data as Task;

    Object.assign(task, newState);
  };
}

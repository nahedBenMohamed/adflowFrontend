import { stageApiUtil } from '@/app';
import {
  ErrorCode,
  serverEventService,
  type EntityEvent,
  type ManualSorting,
  type Nullable,
  type Optional,
  type ServiceError,
  type StageGroup,
} from '@/shared';
import { type AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import {
  UpdateEntityDto,
  entityApi,
  type EntityBoardMeta,
  type EntityBoardStageMeta,
} from '../api';
import { EntityApiUtil, type EntityBoardCard, type EntityBoardCardFilter } from '../shared';

interface Card {
  id: number;
  idx: number;
  groupId: number;
  entityBoardCard: EntityBoardCard;
}

const metaFb: EntityBoardMeta = {
  totalCount: 0,
  totalPrice: 0,
  hasPrice: false,
  stages: [],
};

class EntitiesCardStore {
  meta: EntityBoardMeta = metaFb;

  entitiesCards: EntityBoardCard[] = [];
  boardId: Nullable<number> = null;

  isLoaded = false;
  isLoading = false;
  isLoadingMore = false;
  isMetaLoaded = false;
  isMetaUpdating = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadCards = async ({
    entityTypeId,
    boardId,
    filter,
  }: {
    entityTypeId: number;
    boardId: number;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    this._unsubscribe();

    try {
      this.isLoaded = false;
      this.isLoading = true;

      // to prevent unwanted load more triggering
      this.meta.totalCount = 0;
      this.meta.stages = [];

      this.entitiesCards = await entityApi.getEntitiesBoardCards({ entityTypeId, boardId, filter });

      this._loadMeta({ entityTypeId, boardId, filter });
      this._subscribe({ entityTypeId, boardId, filter });
    } catch (e) {
      throw new Error(
        `Error while loading cards for entityType ${entityTypeId} on board ${boardId}: ${e}`
      );
    } finally {
      this.isLoaded = true;
      this.isLoading = false;
    }
  };

  loadMoreCards = async ({
    entityTypeId,
    boardId,
    stageId,
    filter,
  }: {
    entityTypeId: number;
    boardId: number;
    stageId: number;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    try {
      const stageGroup = stageGroupStore.findGroup(stageId);

      if (!stageGroup) throw new Error(`Stage group for stage ${stageId} not found`);

      const offset = stageGroup.entities.length;

      if (
        offset < this.getMetaByStageId(stageId).totalCount &&
        !this.isMetaUpdating &&
        this.isLoaded &&
        !this.isLoadingMore
      ) {
        this.isLoadingMore = true;

        const entitiesCards = await entityApi.loadMoreEntitiesBoardCards({
          entityTypeId,
          boardId,
          offset,
          filter: {
            ...filter,
            includeStageIds: [stageId],
          },
        });

        // check and filter duplicates out
        const newCards = entitiesCards.filter(c => {
          const isDuplicate = stageGroup.entities.find(e => e.id === c.id);

          return !isDuplicate;
        });

        stageGroup.entities.push(...newCards);

        this._updateMeta({ entityTypeId, boardId, filter });
      }
    } catch (e) {
      throw new Error(
        `Error while loading more cards for entityType ${entityTypeId} on board ${boardId} on stage ${stageId}: ${e}`
      );
    } finally {
      this.isLoadingMore = false;
    }
  };

  getMetaByStageId = (stageId: number): EntityBoardStageMeta => {
    const meta = this.meta.stages.find(s => s.id === stageId);

    if (!meta)
      return {
        id: stageId,
        totalCount: 0,
        totalPrice: 0,
      };

    return meta;
  };

  getCardsByStageId = (stageId: number): EntityBoardCard[] => {
    return this.entitiesCards.filter(c => c.stageId === stageId);
  };

  reset = (): void => {
    this.boardId = null;
    this.entitiesCards = [];
    this.meta = metaFb;

    this.isLoaded = false;
    this.isLoadingMore = false;
    this.isMetaLoaded = false;
    this.isMetaUpdating = false;

    this._unsubscribe();
  };

  addEntityToGroup = (entity: EntityBoardCard): boolean => {
    if (!entity.stageId) throw new Error(`Entity with id ${entity.id} has no stageId`);

    const oldEntityGroup = stageGroupStore.findGroupByEntityId(entity.id);
    const entityGroup = stageGroupStore.findGroup(entity.stageId);

    if (!entityGroup) throw new Error(`Entity group with id ${entity.stageId} was not found`);

    if (oldEntityGroup && entityGroup.id !== oldEntityGroup.id) {
      const originalIdx = oldEntityGroup.entities.findIndex(t => t.id === entity.id);

      oldEntityGroup.entities.splice(originalIdx, 1);
    }

    const entityIdx = entityGroup.entities.findIndex(t => t.id === entity.id);

    if (entityIdx !== -1) entityGroup.entities.splice(entityIdx, 1);

    const insertBeforeIdx = entityGroup.entities.findIndex(t => t.weight > entity.weight);

    if (insertBeforeIdx === -1) {
      entityGroup.entities.push(entity);
    } else {
      entityGroup.entities.splice(insertBeforeIdx, 0, entity);
    }

    return true;
  };

  deleteEntityFromGroup = (id: number): boolean => {
    const entityGroup = stageGroupStore.findGroupByEntityId(id);

    if (entityGroup) {
      const idx = entityGroup.entities.findIndex(t => t.id === id);

      entityGroup.entities.splice(idx, 1);
    }

    return Boolean(entityGroup);
  };

  private _subscribe = ({
    entityTypeId,
    boardId,
    filter,
  }: {
    entityTypeId: number;
    boardId: number;
    filter: EntityBoardCardFilter;
  }): void => {
    serverEventService.on<EntityEvent>('entity:created', async (...args: EntityEvent[]) => {
      if (args[0]) this._entityCreatedHandler({ entityTypeId, boardId, event: args[0], filter });
    });
    serverEventService.on<EntityEvent>('entity:updated', async (...args: EntityEvent[]) => {
      if (args[0]) this._entityUpdatedHandler({ entityTypeId, boardId, event: args[0], filter });
    });
    serverEventService.on<EntityEvent>('entity:deleted', async (...args: EntityEvent[]) => {
      if (args[0]) this._entityDeletedHandler({ entityTypeId, boardId, event: args[0], filter });
    });
  };

  private _unsubscribe = (): void => {
    serverEventService.off('entity:created');
    serverEventService.off('entity:updated');
    serverEventService.off('entity:deleted');
  };

  private _entityCreatedHandler = async ({
    entityTypeId,
    boardId,
    event,
    filter,
  }: {
    entityTypeId: number;
    boardId: number;
    event: EntityEvent;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    if (event.entityTypeId === entityTypeId && event.boardId === boardId) {
      const card = await entityApi.getEntitiesBoardCard({
        boardId,
        entityTypeId,
        entityId: event.entityId,
        filter,
      });

      if (card && this.addEntityToGroup(card)) this._updateMeta({ entityTypeId, boardId, filter });
    }
  };

  private _entityUpdatedHandler = async ({
    entityTypeId,
    boardId,
    event,
    filter,
  }: {
    entityTypeId: number;
    boardId: number;
    event: EntityEvent;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    if (event.entityTypeId === entityTypeId) {
      let updateMeta = false;

      if (event.boardId === boardId) {
        const card = await entityApi.getEntitiesBoardCard({
          boardId,
          entityTypeId,
          entityId: event.entityId,
          filter,
        });

        updateMeta = card
          ? this.addEntityToGroup(card)
          : this.deleteEntityFromGroup(event.entityId);
      } else {
        updateMeta = this.deleteEntityFromGroup(event.entityId);
      }

      if (updateMeta) this._updateMeta({ entityTypeId, boardId, filter });
    }
  };

  private _entityDeletedHandler = async ({
    entityTypeId,
    boardId,
    event,
    filter,
  }: {
    entityTypeId: number;
    boardId: number;
    event: EntityEvent;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    if (event.entityTypeId === entityTypeId && this.deleteEntityFromGroup(event.entityId))
      this._updateMeta({ entityTypeId, boardId, filter });
  };

  private _loadMeta = async ({
    entityTypeId,
    boardId,
    filter,
  }: {
    entityTypeId: number;
    boardId: number;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    try {
      this.meta = filter
        ? await entityApi.getEntitiesBoardMeta({ entityTypeId, boardId, filter })
        : await entityApi.getEntitiesBoardMeta({ entityTypeId, boardId });
    } catch (e) {
      throw new Error(
        `Error while loading meta for entityType ${entityTypeId} on board ${boardId}: ${e}`
      );
    } finally {
      this.isMetaLoaded = true;
    }
  };

  private _updateMeta = async ({
    entityTypeId,
    boardId,
    filter,
  }: {
    entityTypeId: number;
    boardId: number;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    try {
      this.isMetaUpdating = true;

      this.meta = await entityApi.getEntitiesBoardMeta({ entityTypeId, boardId, filter });
    } catch (e) {
      throw new Error(
        `Error while updating meta for entityType ${entityTypeId} on board ${boardId}: ${e}`
      );
    } finally {
      this.isMetaUpdating = false;
    }
  };
}

class StageGroupStore {
  stageGroups: StageGroup[] = [];

  isLoading = false;

  showMutationWarning: Nullable<() => void> = null;

  constructor() {
    makeAutoObservable(this);
  }

  setStageGroups = (stageGroups: StageGroup[]): void => {
    this.stageGroups = stageGroups.sort((a, b) => a.stage.sortOrder - b.stage.sortOrder);
  };

  setShowMutationWarningCb = (cb: Nullable<() => void>): void => {
    this.showMutationWarning = cb;
  };

  loadData = async ({
    boardId,
    entityTypeId,
    filter,
  }: {
    boardId: number;
    entityTypeId: number;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    try {
      this.isLoading = true;

      await entitiesCardStore.loadCards({ entityTypeId, boardId, filter });

      const stages = await stageApiUtil.getStagesByBoardId(boardId);

      const initialStageGroups = stages.map<StageGroup>(s => ({
        id: s.id,
        stage: s,
        entities: entitiesCardStore.getCardsByStageId(s.id),
      }));

      this.setStageGroups(initialStageGroups);
    } catch (e) {
      throw new Error(
        `Error while loading stage groups for entityType ${entityTypeId} on board ${boardId}: ${e}`
      );
    } finally {
      this.isLoading = false;
    }
  };

  moveCard = ({ id, atGroupId, atIdx }: { id: number; atGroupId: number; atIdx: number }): void => {
    const card = this._findCard(id);

    if (!card) return;

    const { entityBoardCard, groupId: oldGroupId } = card;

    const oldGroup = this.findGroup(oldGroupId);
    const newGroup = this.findGroup(atGroupId);

    if (oldGroup && newGroup) {
      const oldIdx = oldGroup.entities.findIndex(e => e.id === id);

      if (oldIdx !== -1) {
        oldGroup.entities.splice(oldIdx, 1);
        newGroup.entities.splice(atIdx, 0, entityBoardCard);
      }
    }
  };

  dropCard = async ({
    entityId,
    stageId,
    sorting,
    oldIdx,
    oldGroupId,
  }: {
    entityId: number;
    stageId: number;
    sorting: ManualSorting;
    oldIdx: number;
    oldGroupId: number;
  }): Promise<void> => {
    try {
      await EntityApiUtil.update({
        id: entityId,
        dto: UpdateEntityDto.create({
          stageId,
          sorting,
        }),
      });
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      if (serviceError?.errorCode === ErrorCode.REQUIRED_FIELD_EMPTY) this.showMutationWarning?.();

      // we need to return card to its original position if error occurred while dropping
      this.moveCard({ id: entityId, atIdx: oldIdx, atGroupId: oldGroupId });
    }
  };

  findGroup = (id: number): Optional<StageGroup> => {
    return this.stageGroups.find(i => i.id === id);
  };

  findGroupByEntityId = (id: number): Optional<StageGroup> => {
    return this.stageGroups.find(item => item.entities.find(e => e.id === id));
  };

  private _findCard = (entityId: number): Optional<Card> => {
    for (const group of this.stageGroups) {
      const idx = group.entities.findIndex(e => e.id === entityId);

      if (idx === -1) continue;

      const entityBoardCard = group.entities[idx];

      if (entityBoardCard) return { id: entityId, entityBoardCard, groupId: group.id, idx };
    }
  };

  reset = (): void => {
    entitiesCardStore.reset();

    this.setShowMutationWarningCb(null);

    this.stageGroups = [];
  };
}

export const entitiesCardStore = new EntitiesCardStore();
export const stageGroupStore = new StageGroupStore();

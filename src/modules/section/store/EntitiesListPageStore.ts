import {
  EntityApiUtil,
  ErrorCode,
  ObjectState,
  serverEventService,
  type EntityEvent,
  type Nullable,
  type Optional,
  type ServiceError,
} from '@/shared';
import type { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import {
  DEFAULT_ENTITY_LIST_ITEMS_LIMIT,
  UpdateEntityDto,
  entityApi,
  type EntityListMeta,
} from '../api';
import type {
  ChangeFieldValueHandler,
  ColumnChangeNameHandler,
  ColumnChangeStageHandler,
  ColumnResponsibleChangeHandler,
  EntityBoardCardFilter,
  EntityListItem,
} from '../shared';

const defaultMeta: EntityListMeta = {
  totalCount: 0,
  totalPrice: 0,
  hasPrice: false,
};

export class EntitiesListPageStore {
  entityTypeId: number;

  meta: EntityListMeta = defaultMeta;
  entities: EntityListItem[] = [];

  pageCount = 1;
  isLoaded = false;
  isLoading = false;

  showMutationWarning: Nullable<() => void> = null;

  constructor(entityTypeId: number) {
    this.entityTypeId = entityTypeId;

    makeAutoObservable(this);
  }

  setShowMutationWarningCb = (cb: Nullable<() => void>): void => {
    this.showMutationWarning = cb;
  };

  loadData = async ({
    filter,
    page,
    boardId = null,
  }: {
    filter: EntityBoardCardFilter;
    page: number;
    boardId?: Nullable<number>;
  }): Promise<void> => {
    this._unsubscribe();

    const offset = page * DEFAULT_ENTITY_LIST_ITEMS_LIMIT - DEFAULT_ENTITY_LIST_ITEMS_LIMIT;

    this.entities = [];

    try {
      this.isLoading = true;
      this.isLoaded = false;

      this.meta.totalCount = 0;

      this.entities = await entityApi.getEntityListItems({
        filter,
        offset,
        boardId,
        entityTypeId: this.entityTypeId,
      });

      this._subscribe({ boardId, filter });
      this._updateMeta({ boardId, filter });

      // for better change page experience
      window.scrollTo({
        top: 0,
      });
    } catch (e) {
      throw new Error(
        `Error while loading entityType ${this.entityTypeId} entity list items for board ${boardId}: ${e}`
      );
    } finally {
      this.isLoading = false;
      this.isLoaded = true;
    }
  };

  getById = (id: number): EntityListItem => {
    const entity = this.entities.find(e => e.id === id);

    if (!entity) throw new Error(`Entity with id ${id} not found`);

    return entity;
  };

  changeName: ColumnChangeNameHandler = async ({ id, name }) => {
    const entity = this.getById(id);

    await entityApi.updateEntity({ id, dto: UpdateEntityDto.create({ name }) });
    entity.name = name;
  };

  changeResponsible: ColumnResponsibleChangeHandler = async ({ id, responsibleUserId }) => {
    const entity = this.getById(id);

    await entityApi.updateEntity({ id, dto: UpdateEntityDto.create({ responsibleUserId }) });
    entity.responsibleUserId = responsibleUserId;
  };

  changeStage: ColumnChangeStageHandler = async ({ id, stageId }) => {
    const entity = this.getById(id);

    try {
      await EntityApiUtil.update({ id, dto: UpdateEntityDto.create({ stageId }) });

      entity.stageId = stageId;

      return true;
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      if (serviceError?.errorCode === ErrorCode.REQUIRED_FIELD_EMPTY) this.showMutationWarning?.();

      return false;
    }
  };

  changeFieldValue: ChangeFieldValueHandler = async ({ entityId, fieldValue }) => {
    await entityApi.saveFieldValue({ entityId, dto: fieldValue.toDto() });

    fieldValue.changeState(ObjectState.UNCHANGED);
  };

  clearListItem = (id: number): void => {
    this.entities = this.entities.filter(e => e.id !== id);
  };

  private _subscribe = ({
    boardId,
    filter,
  }: {
    boardId: Nullable<number>;
    filter: EntityBoardCardFilter;
  }): void => {
    serverEventService.on<EntityEvent>('entity:created', async (...args: EntityEvent[]) => {
      if (args[0]) this._entityCreatedHandler({ boardId, event: args[0], filter });
    });
    serverEventService.on<EntityEvent>('entity:updated', async (...args: EntityEvent[]) => {
      if (args[0]) this._entityUpdatedHandler({ boardId, event: args[0], filter });
    });
    serverEventService.on<EntityEvent>('entity:deleted', async (...args: EntityEvent[]) => {
      if (args[0]) this._entityDeletedHandler({ boardId, event: args[0], filter });
    });
  };

  private _unsubscribe = (): void => {
    serverEventService.off('entity:created');
    serverEventService.off('entity:updated');
    serverEventService.off('entity:deleted');
  };

  private _entityCreatedHandler = async ({
    boardId,
    event,
    filter,
  }: {
    boardId: Nullable<number>;
    event: EntityEvent;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    if (event.entityTypeId === this.entityTypeId && (!boardId || event.boardId === boardId))
      this._updateMeta({ boardId, filter });
  };

  private _entityUpdatedHandler = async ({
    boardId,
    event,
    filter,
  }: {
    boardId: Nullable<number>;
    event: EntityEvent;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    const idx = this.entities.findIndex(e => e.id === event.entityId);

    if (idx !== -1) {
      if (event.entityTypeId === this.entityTypeId && (!boardId || event.boardId === boardId)) {
        const listItem = await entityApi.getEntityListItem({
          filter,
          entityId: event.entityId,
          entityTypeId: event.entityTypeId,
        });

        if (listItem) {
          this.entities = [
            ...this.entities.slice(0, idx),
            listItem,
            ...this.entities.slice(idx + 1),
          ];
        } else {
          this.clearListItem(event.entityId);
        }
      } else {
        this.clearListItem(event.entityId);
      }

      this._updateMeta({ boardId, filter });
    }
  };

  private _entityDeletedHandler = async ({
    boardId,
    event,
    filter,
  }: {
    boardId: Nullable<number>;
    event: EntityEvent;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    if (event.entityTypeId === this.entityTypeId) {
      const idx = this.entities.findIndex(e => e.id === event.entityId);

      if (idx !== -1) {
        this.entities = this.entities.filter(e => e.id !== event.entityId);

        this._updateMeta({ boardId, filter });
      }
    }
  };

  private _updateMeta = async ({
    boardId,
    filter,
  }: {
    boardId: Nullable<number>;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    const meta = await entityApi.getEntityListMeta({
      entityTypeId: this.entityTypeId,
      filter,
      boardId,
    });

    this.meta = meta;
    this.pageCount = Math.ceil(meta.totalCount / DEFAULT_ENTITY_LIST_ITEMS_LIMIT);
  };

  reset = (): void => {
    this._unsubscribe();
  };
}

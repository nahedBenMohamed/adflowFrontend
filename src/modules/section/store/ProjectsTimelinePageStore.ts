import { entityTypeStore } from '@/app';
import { DateFieldValue, FieldCode } from '@/modules/fields';
import { type EntityEvent, FieldType, ObjectState, serverEventService, UtcDate } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { entityApi, type EntityListMeta, UpdateEntityDto } from '../api';
import type { EntityBoardCard, EntityBoardCardFilter } from '../shared';

const initialMeta: EntityListMeta = {
  totalCount: 0,
  totalPrice: 0,
  hasPrice: false,
};

export class ProjectsTimelinePageStore {
  boardId: number;
  entityTypeId: number;

  projects: EntityBoardCard[] = [];
  meta: EntityListMeta = initialMeta;

  isLoaded = false;
  isLoading = false;
  isMetaLoaded = false;
  isLoadingMore = false;

  constructor({ boardId, entityTypeId }: { boardId: number; entityTypeId: number }) {
    this.boardId = boardId;
    this.entityTypeId = entityTypeId;

    makeAutoObservable(this);
  }

  get canLoadMore(): boolean {
    return this.projects.length < this.meta.totalCount;
  }

  loadData = async (filter: EntityBoardCardFilter): Promise<void> => {
    this._unsubscribe();

    try {
      this.isLoading = true;
      this.isLoaded = false;

      const projects = await entityApi.getEntitiesBoardCards({
        boardId: this.boardId,
        entityTypeId: this.entityTypeId,
        filter,
      });

      this._subscribe({ boardId: this.boardId, filter });

      this.projects = projects;

      this._loadMeta({ boardId: this.boardId, filter });
    } catch (e) {
      throw new Error(`Error while loading projects for board ${this.boardId}: ${e}`);
    } finally {
      this.isLoaded = true;
      this.isLoading = false;
    }
  };

  loadMore = async (filter: EntityBoardCardFilter): Promise<void> => {
    try {
      if (this.isLoading || this.isLoadingMore || this.projects.length >= this.meta.totalCount)
        return;

      this.isLoadingMore = true;

      const tasks = await entityApi.loadMoreEntitiesBoardCards({
        filter,
        boardId: this.boardId,
        entityTypeId: this.entityTypeId,
        offset: this.projects.length,
      });

      this.projects = [...this.projects, ...tasks];
    } catch (e) {
      throw new Error(
        `Error while trying to load more projects on entity board ${this.boardId} with list view: ${e}`
      );
    } finally {
      this.isLoadingMore = false;
    }
  };

  updateProject = async ({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateEntityDto;
  }): Promise<EntityBoardCard> => {
    await entityApi.updateEntity({ id, dto });

    const updatedProject = await entityApi.getEntitiesBoardCard({
      entityTypeId: this.entityTypeId,
      boardId: this.boardId,
      entityId: id,
    });

    if (!updatedProject)
      throw new Error(`Failed to get updated project with id ${id} after update on Projects Gantt`);

    this.projects = this.projects.map(p => (p.id === id ? updatedProject : p));

    return updatedProject;
  };

  updateProjectTitle = async ({ id, title }: { id: number; title: string }): Promise<void> => {
    await this.updateProject({ id, dto: UpdateEntityDto.create({ name: title }) });
  };

  updateProjectResponsibleUser = async ({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }): Promise<void> => {
    await this.updateProject({ id, dto: UpdateEntityDto.create({ responsibleUserId: userId }) });
  };

  updateProjectDates = async ({
    id,
    startDate,
    endDate,
  }: {
    id: number;
    startDate: string;
    endDate: string;
  }): Promise<boolean> => {
    const entityType = entityTypeStore.getById(this.entityTypeId);
    const startDateFieldId = entityType.fields.find(f => f.code === FieldCode.START_DATE)?.id;
    const endDateFieldId = entityType.fields.find(f => f.code === FieldCode.END_DATE)?.id;

    if (!startDateFieldId) throw new Error(`Failed to get start date field id in project ${id}`);

    if (!endDateFieldId) throw new Error(`Failed to get end date field id in project ${id}`);

    const startDateFieldValueDto = new DateFieldValue(
      startDateFieldId,
      FieldType.DATE,
      UtcDate.parseISO(startDate),
      ObjectState.UPDATED
    ).toDto();

    const endDateFieldValueDto = new DateFieldValue(
      endDateFieldId,
      FieldType.DATE,
      UtcDate.parseISO(endDate),
      ObjectState.UPDATED
    ).toDto();

    const updatedProject = await this.updateProject({
      id,
      dto: UpdateEntityDto.create({ fieldValues: [startDateFieldValueDto, endDateFieldValueDto] }),
    });

    return Boolean(updatedProject);
  };

  deleteProject = async (id: number): Promise<void> => {
    await entityApi.deleteEntity(id);

    this.projects = this.projects.filter(p => p.id !== id);
  };

  syncState = async (project: EntityBoardCard): Promise<void> => {
    this.projects = this.projects.map(p => (p.id === project.id ? project : p));
  };

  private _subscribe = ({
    boardId,
    filter,
  }: {
    boardId: number;
    filter: EntityBoardCardFilter;
  }): void => {
    serverEventService.on<EntityEvent>('entity:created', async (...args: EntityEvent[]) => {
      if (args[0]) this._entityCreatedHandler({ boardId, id: args[0].entityId, filter });
    });
    serverEventService.on<EntityEvent>('entity:updated', async (...args: EntityEvent[]) => {
      if (args[0]) this._entityUpdatedHandler({ boardId, id: args[0].entityId, filter });
    });
    serverEventService.on<EntityEvent>('entity:deleted', async (...args: EntityEvent[]) => {
      if (args[0]) this._entityDeletedHandler({ boardId, id: args[0].entityId, filter });
    });
  };

  private _unsubscribe = (): void => {
    serverEventService.off('entity:created');
    serverEventService.off('entity:updated');
    serverEventService.off('entity:deleted');
  };

  private _entityCreatedHandler = async ({
    id,
    boardId,
    filter,
  }: {
    id: number;
    boardId: number;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    const project = await entityApi.getEntitiesBoardCard({
      boardId,
      entityId: id,
      entityTypeId: this.entityTypeId,
      filter,
    });
    const projectIdx = this.projects.findIndex(p => p.id === project?.id);

    if (project && projectIdx === -1) this.projects = [project, ...this.projects];

    this._updateMeta({ boardId, filter });
  };

  private _entityUpdatedHandler = async ({
    id,
    boardId,
    filter,
  }: {
    id: number;
    boardId: number;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    const projectIdx = this.projects.findIndex(p => p.id === id);

    const projectCard = await entityApi.getEntitiesBoardCard({
      boardId,
      entityId: id,
      entityTypeId: this.entityTypeId,
      filter,
    });

    if (projectIdx !== -1 && projectCard) {
      this.syncState(projectCard);
    } else if (projectCard) {
      this.projects = [projectCard, ...this.projects];
    } else if (projectIdx !== -1) {
      this.projects = this.projects.filter(p => p.id !== id);
    }

    this._updateMeta({ boardId, filter });
  };

  private _entityDeletedHandler = async ({
    id,
    boardId,
    filter,
  }: {
    id: number;
    boardId: number;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    this.projects = this.projects.filter(p => p.id !== id);

    this._updateMeta({ boardId, filter });
  };

  private _updateMeta = async ({
    boardId,
    filter,
  }: {
    boardId: number;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    this.meta = await entityApi.getEntityListMeta({
      entityTypeId: this.entityTypeId,
      boardId,
      filter,
    });
  };

  private _loadMeta = async ({
    boardId,
    filter,
  }: {
    boardId: number;
    filter: EntityBoardCardFilter;
  }): Promise<void> => {
    try {
      this.isMetaLoaded = false;

      await this._updateMeta({ boardId, filter });
    } catch (e) {
      throw new Error(`Failed to load projects meta for timeline view on board ${boardId}: ${e}`);
    } finally {
      this.isMetaLoaded = true;
    }
  };

  reset = (): void => {
    this.projects = [];
    this.meta = initialMeta;

    this.isLoaded = false;
    this.isLoading = false;
    this.isMetaLoaded = false;
    this.isLoadingMore = false;

    this._unsubscribe();
  };
}

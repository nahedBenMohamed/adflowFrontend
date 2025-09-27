import { entityTypeStore } from '@/app';
import { SelectModel, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { SiteFormEntityType } from '../SiteFormEntityType';

export class SiteFormEntityTypeLinkModel {
  entityTypeId: number;
  boardId: SelectModel;

  private constructor({
    entityTypeId,
    boardId,
  }: {
    entityTypeId: number;
    boardId: Nullable<number>;
  }) {
    this.entityTypeId = entityTypeId;
    this.boardId = SelectModel.create(boardId);

    makeAutoObservable(this);
  }

  static initializeModel({
    entityTypeId,
    boardId,
  }: {
    entityTypeId: number;
    boardId: Nullable<number>;
  }): SiteFormEntityTypeLinkModel {
    return new SiteFormEntityTypeLinkModel({ entityTypeId, boardId });
  }

  static initializeMainModels({
    mainLinkId,
    entityTypeLinks,
  }: {
    mainLinkId: number;
    entityTypeLinks: SiteFormEntityType[];
  }): SiteFormEntityTypeLinkModel[] {
    const result: SiteFormEntityTypeLinkModel[] = [];

    for (const et of entityTypeStore.entityTypes) {
      const link = entityTypeLinks.find(l => l.entityTypeId === et.id);

      result.push(
        this.initializeModel({
          entityTypeId: et.id,
          boardId: et.id === mainLinkId ? (link?.boardId ?? null) : null,
        })
      );
    }

    return result;
  }

  static initializeLinkedModelsTest({
    linkedEntityTypeIds,
    entityTypeLinks,
  }: {
    linkedEntityTypeIds: number[];
    entityTypeLinks: SiteFormEntityType[];
  }): SiteFormEntityTypeLinkModel[] {
    return linkedEntityTypeIds.map<SiteFormEntityTypeLinkModel>(id =>
      this.initializeModel({
        entityTypeId: id,
        boardId: entityTypeLinks.find(l => l.entityTypeId === id)?.boardId ?? null,
      })
    );
  }

  static initializeLinkedModels(
    entityTypeLinks: SiteFormEntityType[]
  ): SiteFormEntityTypeLinkModel[] {
    return entityTypeLinks.map<SiteFormEntityTypeLinkModel>(e =>
      this.initializeModel({
        entityTypeId: e.entityTypeId,
        boardId: e.boardId,
      })
    );
  }

  static initializeLinkedModelsByIds(entityTypeIds: number[]): SiteFormEntityTypeLinkModel[] {
    return entityTypeIds.map<SiteFormEntityTypeLinkModel>(id =>
      this.initializeModel({
        entityTypeId: id,
        boardId: null,
      })
    );
  }
}

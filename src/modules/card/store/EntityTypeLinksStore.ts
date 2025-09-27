import { JsonStateHelper, type EntityType, type EntityTypeLink, type Nullable } from '@/shared';
import { computed, makeAutoObservable, toJS } from 'mobx';

export class EntityTypeLinksStore {
  entityType: Nullable<EntityType> = null;
  entityTypeLinks: EntityTypeLink[] = [];

  jsonState: Nullable<JsonStateHelper> = null;

  constructor(entityType: EntityType) {
    this.entityType = entityType;

    this.entityTypeLinks = toJS(entityType.linkedEntityTypes);

    this.jsonState = new JsonStateHelper(() => JSON.stringify(this.entityTypeLinks));

    this.jsonState.calculateState();

    makeAutoObservable(this);
  }

  get sortedEntityTypeLinks(): EntityTypeLink[] {
    return this.entityTypeLinks.slice().sort((a, b) => a.sortOrder - b.sortOrder);
  }

  changeLinkSortOrder = ({
    newSortOrder,
    targetId,
  }: {
    newSortOrder: number;
    targetId: number;
  }): void => {
    this.entityTypeLinks = this.entityTypeLinks.map(l =>
      l.targetId === targetId ? { ...l, sortOrder: newSortOrder } : l
    );
  };

  @computed.struct
  isJsonStateChanged = (): boolean => {
    if (!this.jsonState) return false;

    return this.jsonState.stateChanged;
  };
}

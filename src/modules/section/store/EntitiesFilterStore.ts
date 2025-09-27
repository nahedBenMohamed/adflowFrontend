import { makeAutoObservable } from 'mobx';
import type { EntityBoardCardFilter } from '../shared';

export class EntitiesFilterStore {
  filter: EntityBoardCardFilter = {};

  constructor() {
    makeAutoObservable(this);
  }

  setFilter = (filter: EntityBoardCardFilter): void => {
    this.filter = filter;
  };
}

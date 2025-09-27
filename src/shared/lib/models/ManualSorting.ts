import type { Nullable, Optional } from '../types';

type ManualSortingId = Nullable<Optional<number>>;

export class ManualSorting {
  afterId: ManualSortingId;
  beforeId: ManualSortingId;

  constructor({ afterId, beforeId }: ManualSorting) {
    this.afterId = afterId;
    this.beforeId = beforeId;
  }
}

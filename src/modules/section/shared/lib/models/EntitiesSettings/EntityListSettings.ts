import type { ColumnOrderState, VisibilityState } from '@tanstack/react-table';

export class EntityListSettings {
  settings: {
    columnOrder: ColumnOrderState;
    columnVisibility: VisibilityState;
  };

  constructor({ settings }: EntityListSettings) {
    this.settings = settings;
  }
}

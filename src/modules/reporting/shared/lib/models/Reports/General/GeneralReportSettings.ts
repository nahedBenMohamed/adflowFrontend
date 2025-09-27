import type { VisibilityState } from '@tanstack/react-table';

export class GeneralReportSettings {
  settings: {
    columnVisibility: VisibilityState;
  };

  constructor({ settings }: GeneralReportSettings) {
    this.settings = settings;
  }
}

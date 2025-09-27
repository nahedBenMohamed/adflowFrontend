import type { Nullable } from '@/shared';

export class GeneralReportFilterVisibilityTaskDto {
  exclude?: Nullable<boolean>;
  excludeOpen?: Nullable<boolean>;
  excludeExpired?: Nullable<boolean>;
  excludeResolved?: Nullable<boolean>;

  constructor({
    exclude,
    excludeOpen,
    excludeExpired,
    excludeResolved,
  }: GeneralReportFilterVisibilityTaskDto) {
    this.exclude = exclude;
    this.excludeOpen = excludeOpen;
    this.excludeExpired = excludeExpired;
    this.excludeResolved = excludeResolved;
  }
}

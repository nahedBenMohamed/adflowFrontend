import type { Nullable } from '@/shared';

export class GeneralReportFilterVisibilityEntityDto {
  exclude?: Nullable<boolean>;
  excludeOpen?: Nullable<boolean>;
  excludeLost?: Nullable<boolean>;
  excludeWon?: Nullable<boolean>;

  constructor({
    exclude,
    excludeOpen,
    excludeLost,
    excludeWon,
  }: GeneralReportFilterVisibilityEntityDto) {
    this.exclude = exclude;
    this.excludeOpen = excludeOpen;
    this.excludeLost = excludeLost;
    this.excludeWon = excludeWon;
  }
}

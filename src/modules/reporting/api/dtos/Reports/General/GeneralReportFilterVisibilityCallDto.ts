import type { Nullable } from '@/shared';

export class GeneralReportFilterVisibilityCallDto {
  exclude?: Nullable<boolean>;

  constructor({ exclude }: GeneralReportFilterVisibilityCallDto) {
    this.exclude = exclude;
  }
}

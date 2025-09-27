import type { Nullable } from '@/shared';

export class GeneralReportFilterVisibilityFieldOptionDto {
  optionId: number;
  exclude?: Nullable<boolean>;

  constructor({ optionId, exclude }: GeneralReportFilterVisibilityFieldOptionDto) {
    this.optionId = optionId;
    this.exclude = exclude;
  }
}

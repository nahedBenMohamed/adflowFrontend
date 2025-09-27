import type { Nullable } from '@/shared';
import type { GeneralReportFilterVisibilityFieldOptionDto } from './GeneralReportFilterVisibilityFieldOptionDto';

export class GeneralReportFilterVisibilityFieldDto {
  fieldId: number;
  exclude?: Nullable<boolean>;
  options?: Nullable<GeneralReportFilterVisibilityFieldOptionDto[]>;

  constructor({ fieldId, exclude, options }: GeneralReportFilterVisibilityFieldDto) {
    this.fieldId = fieldId;
    this.exclude = exclude;
    this.options = options;
  }
}

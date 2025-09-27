import type { Nullable } from '@/shared';
import type { GeneralReportFilterVisibilityFieldDto } from './GeneralReportFilterVisibilityFieldDto';

export class GeneralReportFilterVisibilityFieldsDto {
  exclude?: Nullable<boolean>;
  fields?: Nullable<GeneralReportFilterVisibilityFieldDto[]>;

  constructor({ exclude, fields }: GeneralReportFilterVisibilityFieldsDto) {
    this.exclude = exclude;
    this.fields = fields;
  }
}

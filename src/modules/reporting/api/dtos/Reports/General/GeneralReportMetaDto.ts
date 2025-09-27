import type { GeneralReportFieldMetaDto } from './GeneralReportFieldMetaDto';

export class GeneralReportMetaDto {
  fields: GeneralReportFieldMetaDto[];

  constructor(fields: GeneralReportFieldMetaDto[]) {
    this.fields = fields;
  }
}

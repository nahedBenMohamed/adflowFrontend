import type { GeneralReportMetaDto } from '../../../../../api';
import { GeneralReportFieldMeta } from './GeneralReportFieldMeta';

export class GeneralReportMeta {
  fields: GeneralReportFieldMeta[];

  constructor(fields: GeneralReportFieldMeta[]) {
    this.fields = fields;
  }

  static fromDto(dto: GeneralReportMetaDto): GeneralReportMeta {
    return new GeneralReportMeta(GeneralReportFieldMeta.fromDtos(dto.fields));
  }
}

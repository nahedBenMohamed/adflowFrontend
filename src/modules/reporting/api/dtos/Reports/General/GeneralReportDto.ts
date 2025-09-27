import type { GeneralReportMetaDto } from './GeneralReportMetaDto';
import type { GeneralReportRowDto } from './GeneralReportRowDto';

export interface GeneralReportDto {
  users: GeneralReportRowDto[];
  departments: GeneralReportRowDto[];
  total: GeneralReportRowDto;
  meta: GeneralReportMetaDto;
}

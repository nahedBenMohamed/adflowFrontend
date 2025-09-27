import type { FieldFormat, Nullable } from '@/shared';

export interface GeneralReportFieldOptionMetaDto {
  optionId: number;
  optionLabel: string | boolean;
  format?: Nullable<FieldFormat>;
}

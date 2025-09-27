import type { FieldFormat, Nullable } from '@/shared';
import type { GeneralReportFieldOptionMetaDto } from '../../../../../api';

export class GeneralReportFieldOptionMeta {
  optionId: number;
  optionLabel: string | boolean;
  format?: Nullable<FieldFormat>;

  constructor({ optionId, optionLabel, format }: GeneralReportFieldOptionMeta) {
    this.optionId = optionId;
    this.optionLabel = optionLabel;
    this.format = format;
  }

  static fromDto(dto: GeneralReportFieldOptionMetaDto): GeneralReportFieldOptionMeta {
    return new GeneralReportFieldOptionMeta({
      optionId: dto.optionId,
      optionLabel: dto.optionLabel,
      format: dto.format,
    });
  }

  static fromDtos(dtos: GeneralReportFieldOptionMetaDto[]): GeneralReportFieldOptionMeta[] {
    return dtos.map(this.fromDto);
  }
}

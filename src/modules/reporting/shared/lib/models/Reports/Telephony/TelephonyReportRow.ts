import type { TelephonyReportRowDto } from '../../../../../api';
import { TelephonyReportBlock } from './TelephonyReportBlock';

export class TelephonyReportRow {
  ownerId: number;
  call: TelephonyReportBlock;

  constructor({ ownerId, call }: TelephonyReportRow) {
    this.ownerId = ownerId;
    this.call = call;
  }

  static fromDto(dto: TelephonyReportRowDto): TelephonyReportRow {
    if (!dto.call)
      throw new Error('Call property not found in TelephonyReportRow constructor method.');

    return new TelephonyReportRow({
      ownerId: dto.ownerId,
      call: TelephonyReportBlock.fromDto(dto.call),
    });
  }

  static fromDtos(dtos: TelephonyReportRowDto[]): TelephonyReportRow[] {
    return dtos.map(this.fromDto);
  }
}

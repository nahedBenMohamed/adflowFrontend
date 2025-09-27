import type { ComparativeReportCellDto } from '../../../../../api';
import { ComparativeReportValue } from './ComparativeReportValue';

export class ComparativeReportCell {
  date: string;
  all: ComparativeReportValue;
  open: ComparativeReportValue;
  lost: ComparativeReportValue;
  won: ComparativeReportValue;

  constructor({
    date,
    all,
    open,
    lost,
    won,
  }: {
    date: string;
    all: ComparativeReportValue;
    open: ComparativeReportValue;
    lost: ComparativeReportValue;
    won: ComparativeReportValue;
  }) {
    this.date = date;
    this.all = all;
    this.open = open;
    this.lost = lost;
    this.won = won;
  }

  static fromDto(dto: ComparativeReportCellDto): ComparativeReportCell {
    return new ComparativeReportCell({
      date: dto.date,
      all: ComparativeReportValue.fromDto(dto.all),
      open: ComparativeReportValue.fromDto(dto.open),
      lost: ComparativeReportValue.fromDto(dto.lost),
      won: ComparativeReportValue.fromDto(dto.won),
    });
  }

  static fromDtos(dtos: ComparativeReportCellDto[]): ComparativeReportCell[] {
    return dtos.map(this.fromDto);
  }
}

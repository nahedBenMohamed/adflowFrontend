import type { ComparativeReportRowDto } from '../../../../../api';
import { ComparativeReportCell } from './ComparativeReportCell';

export class ComparativeReportRow {
  ownerId: number;
  cells: ComparativeReportCell[];

  constructor({ ownerId, cells }: { ownerId: number; cells: ComparativeReportCell[] }) {
    this.ownerId = ownerId;
    this.cells = cells;
  }

  static fromDto(dto: ComparativeReportRowDto): ComparativeReportRow {
    return new ComparativeReportRow({
      ownerId: dto.ownerId,
      cells: ComparativeReportCell.fromDtos(dto.cells),
    });
  }

  static fromDtos(dtos: ComparativeReportRowDto[]): ComparativeReportRow[] {
    return dtos.map(this.fromDto);
  }
}

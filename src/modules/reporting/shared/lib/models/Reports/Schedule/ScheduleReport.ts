import type { Optional } from '@/shared';
import type { ScheduleReportDto } from './ScheduleReportDto';
import { ScheduleReportRow } from './ScheduleReportRow';

export class ScheduleReport {
  rows: ScheduleReportRow[];
  total: ScheduleReportRow;

  constructor({ rows, total }: { rows: ScheduleReportRow[]; total: ScheduleReportRow }) {
    this.rows = rows;
    this.total = total;
  }

  static fromDto(dto: ScheduleReportDto): ScheduleReport {
    return new ScheduleReport({
      rows: ScheduleReportRow.fromDtos(dto.rows),
      total: ScheduleReportRow.fromDto(dto.total),
    });
  }

  findDepartmentRowById = (id: number): Optional<ScheduleReportRow> => {
    return this.rows.find(r => r.ownerId === id);
  };
}

import type { Optional } from '@/shared';
import type { GeneralReportDto } from '../../../../../api';
import { GeneralReportMeta } from './GeneralReportMeta';
import { GeneralReportRow } from './GeneralReportRow';

export class GeneralReport {
  users: GeneralReportRow[];
  departments: GeneralReportRow[];
  total: GeneralReportRow;
  meta: GeneralReportMeta;

  constructor({
    users,
    departments,
    total,
    meta,
  }: {
    users: GeneralReportRow[];
    departments: GeneralReportRow[];
    total: GeneralReportRow;
    meta: GeneralReportMeta;
  }) {
    this.users = users;
    this.departments = departments;
    this.total = total;
    this.meta = meta;
  }

  static fromDto(dto: GeneralReportDto): GeneralReport {
    return new GeneralReport({
      users: GeneralReportRow.fromDtos(dto.users),
      departments: GeneralReportRow.fromDtos(dto.departments),
      total: GeneralReportRow.fromDto(dto.total),
      meta: GeneralReportMeta.fromDto(dto.meta),
    });
  }

  findDepartmentRowById = (id: number): Optional<GeneralReportRow> => {
    return this.departments.find(d => d.ownerId === id);
  };

  findUserRowById = (id: number): Optional<GeneralReportRow> => {
    return this.users.find(u => u.ownerId === id);
  };
}

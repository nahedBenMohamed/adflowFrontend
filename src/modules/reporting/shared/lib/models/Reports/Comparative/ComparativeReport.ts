import type { Optional } from '@/shared';
import type { ComparativeReportDto } from '../../../../../api';
import { ComparativeReportRow } from './ComparativeReportRow';

export class ComparativeReport {
  users: ComparativeReportRow[];
  departments: ComparativeReportRow[];
  total: ComparativeReportRow;

  constructor({
    users,
    departments,
    total,
  }: {
    users: ComparativeReportRow[];
    departments: ComparativeReportRow[];
    total: ComparativeReportRow;
  }) {
    this.users = users;
    this.departments = departments;
    this.total = total;
  }

  static fromDto(dto: ComparativeReportDto): ComparativeReport {
    return new ComparativeReport({
      users: ComparativeReportRow.fromDtos(dto.users),
      departments: ComparativeReportRow.fromDtos(dto.departments),
      total: ComparativeReportRow.fromDto(dto.total),
    });
  }

  findDepartmentRowById = (id: number): Optional<ComparativeReportRow> => {
    return this.departments.find(d => d.ownerId === id);
  };

  findUserRowById = (id: number): Optional<ComparativeReportRow> => {
    return this.users.find(u => u.ownerId === id);
  };
}

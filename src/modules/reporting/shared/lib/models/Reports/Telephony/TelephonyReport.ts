import type { Optional } from '@/shared';
import type { TelephonyReportDto } from '../../../../../api';
import { TelephonyReportRow } from './TelephonyReportRow';

export class TelephonyReport {
  users: TelephonyReportRow[];
  departments: TelephonyReportRow[];
  total: TelephonyReportRow;

  constructor({
    users,
    departments,
    total,
  }: {
    users: TelephonyReportRow[];
    departments: TelephonyReportRow[];
    total: TelephonyReportRow;
  }) {
    this.users = users;
    this.departments = departments;
    this.total = total;
  }

  static fromDto(dto: TelephonyReportDto): TelephonyReport {
    return new TelephonyReport({
      users: TelephonyReportRow.fromDtos(dto.users),
      departments: TelephonyReportRow.fromDtos(dto.departments),
      total: TelephonyReportRow.fromDto(dto.total),
    });
  }

  findDepartmentRowById = (id: number): Optional<TelephonyReportRow> => {
    return this.departments.find(d => d.ownerId === id);
  };

  findUserRowById = (id: number): Optional<TelephonyReportRow> => {
    return this.users.find(u => u.ownerId === id);
  };
}

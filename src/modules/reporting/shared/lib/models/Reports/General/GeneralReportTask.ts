import type { Nullable } from '@/shared';
import type { GeneralReportTaskDto } from '../../../../../api';

export class GeneralReportTask {
  all: number;
  open: number;
  expired: number;
  resolved: number;

  constructor({ all, open, expired, resolved }: GeneralReportTask) {
    this.all = all;
    this.open = open;
    this.expired = expired;
    this.resolved = resolved;
  }

  static fromDto(dto: Nullable<GeneralReportTaskDto>): Nullable<GeneralReportTask> {
    if (!dto) return null;

    return new GeneralReportTask({
      all: dto.all,
      open: dto.open,
      expired: dto.expired,
      resolved: dto.resolved,
    });
  }
}

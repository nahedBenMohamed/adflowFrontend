import type { DepartmentSettingsDto } from '@/modules/settings';
import type { Nullable } from '@/shared';

export class DepartmentSettings {
  workingTimeFrom?: Nullable<string>;
  workingTimeTo?: Nullable<string>;

  constructor({ workingTimeFrom, workingTimeTo }: DepartmentSettings) {
    this.workingTimeFrom = workingTimeFrom;
    this.workingTimeTo = workingTimeTo;
  }

  static fromDto(dto: DepartmentSettingsDto): DepartmentSettings {
    return new DepartmentSettings(dto);
  }
}

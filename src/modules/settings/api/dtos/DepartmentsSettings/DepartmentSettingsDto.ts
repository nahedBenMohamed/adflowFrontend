import type { Nullable } from '@/shared';

export class DepartmentSettingsDto {
  workingTimeFrom: Nullable<string>;
  workingTimeTo: Nullable<string>;

  constructor({ workingTimeFrom, workingTimeTo }: DepartmentSettingsDto) {
    this.workingTimeFrom = workingTimeFrom;
    this.workingTimeTo = workingTimeTo;
  }
}

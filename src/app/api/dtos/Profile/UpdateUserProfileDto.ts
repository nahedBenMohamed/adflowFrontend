import type { Nullable } from '@/shared';

export class UpdateUserProfileDto {
  birthDate?: Nullable<string>;
  employmentDate?: Nullable<string>;
  workingTimeFrom?: Nullable<string>;
  workingTimeTo?: Nullable<string>;

  constructor({ birthDate, employmentDate, workingTimeFrom, workingTimeTo }: UpdateUserProfileDto) {
    this.birthDate = birthDate;
    this.employmentDate = employmentDate;
    this.workingTimeFrom = workingTimeFrom;
    this.workingTimeTo = workingTimeTo;
  }
}

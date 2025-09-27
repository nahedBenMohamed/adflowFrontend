import type { Nullable } from '@/shared';

export class UserProfileDto {
  userId: number;
  birthDate: Nullable<string>;
  employmentDate: Nullable<string>;
  workingTimeFrom: Nullable<string>;
  workingTimeTo: Nullable<string>;

  constructor({
    userId,
    birthDate,
    employmentDate,
    workingTimeFrom,
    workingTimeTo,
  }: UserProfileDto) {
    this.userId = userId;
    this.birthDate = birthDate;
    this.employmentDate = employmentDate;
    this.workingTimeFrom = workingTimeFrom;
    this.workingTimeTo = workingTimeTo;
  }
}

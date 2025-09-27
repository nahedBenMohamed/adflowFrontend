import type { UpdateUserProfileDto, UserProfileDto } from '@/app';
import type { Nullable, UtcDateValue } from '@/shared';
import { UtcDate } from '../UtcDate';

export class UserProfile {
  userId: number;
  birthDate: UtcDateValue;
  employmentDate: UtcDateValue;
  workingTimeFrom: Nullable<string>;
  workingTimeTo: Nullable<string>;

  constructor(dto: UserProfileDto) {
    this.userId = dto.userId;
    this.birthDate = UtcDate.parseISONullable(dto.birthDate);
    this.employmentDate = UtcDate.parseISONullable(dto.employmentDate);
    this.workingTimeFrom = dto.workingTimeFrom;
    this.workingTimeTo = dto.workingTimeTo;
  }

  update = (dto: UpdateUserProfileDto): void => {
    if (dto.birthDate) this.birthDate = UtcDate.parseISO(dto.birthDate);

    if (dto.employmentDate) this.employmentDate = UtcDate.parseISO(dto.employmentDate);

    if (dto.workingTimeFrom !== undefined) this.workingTimeFrom = dto.workingTimeFrom;

    if (dto.workingTimeTo !== undefined) this.workingTimeTo = dto.workingTimeTo;
  };
}

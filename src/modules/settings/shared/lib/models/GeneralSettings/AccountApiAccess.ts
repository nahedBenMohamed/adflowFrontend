import { UtcDate } from '@/shared';
import type { AccountApiAccessDto } from '../../../../api';

export class AccountApiAccess {
  apiKey: string;
  createdAt: UtcDate;

  constructor({ apiKey, createdAt }: AccountApiAccess) {
    this.apiKey = apiKey;
    this.createdAt = createdAt;
  }

  static fromDto(dto: AccountApiAccessDto): AccountApiAccess {
    return new AccountApiAccess({
      apiKey: dto.apiKey,
      createdAt: UtcDate.parseISO(dto.createdAt),
    });
  }
}

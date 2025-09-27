import { UtcDate } from '@/shared';
import type { UserTokenDto } from '../../../../api';

export class UserToken {
  id: number;
  name: string;
  createdAt: UtcDate;
  expiresAt?: UtcDate;
  lastUsedAt?: UtcDate;

  constructor({ id, name, createdAt, expiresAt, lastUsedAt }: UserToken) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
    this.lastUsedAt = lastUsedAt;
  }

  static fromDto(dto: UserTokenDto): UserToken {
    return new UserToken({
      id: dto.id,
      name: dto.name,
      createdAt: UtcDate.parseISO(dto.createdAt),
      expiresAt: dto.expiresAt ? UtcDate.parseISO(dto.expiresAt) : undefined,
      lastUsedAt: dto.lastUsedAt ? UtcDate.parseISO(dto.lastUsedAt) : undefined,
    });
  }

  static fromDtos(dtos: UserTokenDto[]): UserToken[] {
    return dtos.map(dto => UserToken.fromDto(dto));
  }
}

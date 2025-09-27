import type { AccountDto } from '@/app';
import { UtcDate, type Nullable } from '@/shared';

export class Account {
  id: number;
  subdomain: string;
  createdAt: UtcDate;
  companyName: string;
  logoUrl: Nullable<string>;

  constructor({
    id,
    subdomain,
    createdAt,
    companyName,
    logoUrl,
  }: {
    id: number;
    subdomain: string;
    createdAt: UtcDate;
    companyName: string;
    logoUrl: Nullable<string>;
  }) {
    this.id = id;
    this.subdomain = subdomain;
    this.createdAt = createdAt;
    this.companyName = companyName;
    this.logoUrl = logoUrl;
  }

  static fromDto(dto: AccountDto): Account {
    return new Account({
      id: dto.id,
      subdomain: dto.subdomain,
      companyName: dto.companyName,
      createdAt: UtcDate.parseISO(dto.createdAt),
      logoUrl: dto.logoUrl,
    });
  }

  static fromDtos(dtos: AccountDto[]): Account[] {
    return dtos.map(this.fromDto);
  }
}

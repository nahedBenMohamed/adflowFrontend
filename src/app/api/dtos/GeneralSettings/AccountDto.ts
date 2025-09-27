import type { Nullable } from '@/shared';

export interface AccountDto {
  id: number;
  subdomain: string;
  createdAt: string;
  companyName: string;
  logoUrl: Nullable<string>;
}

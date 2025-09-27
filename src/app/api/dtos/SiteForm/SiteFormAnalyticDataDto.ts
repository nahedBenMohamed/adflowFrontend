import type { Nullable } from '@/shared';

export class SiteFormAnalyticDataDto {
  code: string;
  value: Nullable<unknown>;

  constructor({ code, value }: SiteFormAnalyticDataDto) {
    this.code = code;
    this.value = value;
  }
}

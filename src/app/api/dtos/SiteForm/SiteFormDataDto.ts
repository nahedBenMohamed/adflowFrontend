import type { Nullable } from '@/shared';
import type { SiteFormAnalyticDataDto } from './SiteFormAnalyticDataDto';
import type { SiteFormFieldDataDto } from './SiteFormFieldDataDto';

export class SiteFormDataDto {
  fields?: Nullable<SiteFormFieldDataDto[]>;
  analytics?: Nullable<SiteFormAnalyticDataDto[]>;

  constructor({ fields, analytics }: SiteFormDataDto) {
    this.fields = fields;
    this.analytics = analytics;
  }
}

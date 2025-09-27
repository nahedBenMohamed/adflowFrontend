import type { Nullable } from '@/shared';
import type { SiteFormFieldDto } from './SiteFormFieldDto';

export interface SiteFormPageDto {
  id: number;
  sortOrder: number;
  fields: SiteFormFieldDto[];
  title?: Nullable<string>;
}

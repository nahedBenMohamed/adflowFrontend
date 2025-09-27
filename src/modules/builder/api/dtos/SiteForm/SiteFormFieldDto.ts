import type { Nullable } from '@/shared';
import type { SiteFormFieldType } from '../../../shared';
import type { SiteFormFieldEntityFieldDto } from './SiteFormFieldEntityFieldDto';
import type { SiteFormFieldEntityNameDto } from './SiteFormFieldEntityNameDto';

export class SiteFormFieldDto {
  id: number;
  sortOrder: number;
  label: Nullable<string>;
  type: SiteFormFieldType;
  placeholder: Nullable<string>;
  settings?: Nullable<SiteFormFieldEntityFieldDto | SiteFormFieldEntityNameDto>;
  isRequired?: Nullable<boolean>;
}

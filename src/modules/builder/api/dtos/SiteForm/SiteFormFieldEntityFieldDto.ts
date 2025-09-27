import type { Nullable } from '@/shared';
import type { SiteFormFieldTextMetaDto } from './SiteFormFieldTextMetaDto';

export interface SiteFormFieldEntityFieldDto {
  fieldId: number;
  entityTypeId: number;
  isValidationRequired: Nullable<boolean>;
  meta?: Nullable<SiteFormFieldTextMetaDto>;
}

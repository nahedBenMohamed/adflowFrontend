import type { Nullable } from '@/shared';
import type { SiteFormFieldEntityFieldDto } from '../../../../../api';
import { SiteFormFieldTextMeta } from './SiteFormFieldTextMeta';

export class SiteFormFieldEntityField {
  fieldId: number;
  entityTypeId: number;
  isValidationRequired: Nullable<boolean>;
  meta?: SiteFormFieldTextMeta;

  constructor({ fieldId, entityTypeId, isValidationRequired, meta }: SiteFormFieldEntityField) {
    this.fieldId = fieldId;
    this.entityTypeId = entityTypeId;
    this.isValidationRequired = isValidationRequired;
    this.meta = meta;
  }

  static fromDto(dto: SiteFormFieldEntityFieldDto): SiteFormFieldEntityField {
    return new SiteFormFieldEntityField({
      fieldId: dto.fieldId,
      entityTypeId: dto.entityTypeId,
      isValidationRequired: dto.isValidationRequired,
      meta: dto.meta ? SiteFormFieldTextMeta.fromDto(dto.meta) : undefined,
    });
  }
}

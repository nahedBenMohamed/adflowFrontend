import { BooleanModel, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { SiteFormFieldEntityFieldDto } from '../../../../../api';
import type { SiteFormFieldEntityField } from '../SiteFormField/SiteFormFieldEntityField';
import type { SiteFormFieldTextMeta } from '../SiteFormField/SiteFormFieldTextMeta';

export class SiteFormFieldEntityFieldModel {
  fieldId: number;
  entityTypeId: number;
  isValidationRequired: Nullable<BooleanModel>;
  meta?: SiteFormFieldTextMeta;

  constructor({
    fieldId,
    entityTypeId,
    isValidationRequired,
    meta,
  }: {
    fieldId: number;
    entityTypeId: number;
    isValidationRequired: Nullable<boolean>;
    meta?: SiteFormFieldTextMeta;
  }) {
    this.fieldId = fieldId;
    this.entityTypeId = entityTypeId;
    this.isValidationRequired =
      isValidationRequired !== null ? BooleanModel.create(isValidationRequired) : null;
    this.meta = meta;

    makeAutoObservable(this);
  }

  static fromModel(siteFormEntityField: SiteFormFieldEntityField): SiteFormFieldEntityFieldModel {
    return new SiteFormFieldEntityFieldModel({
      fieldId: siteFormEntityField.fieldId,
      entityTypeId: siteFormEntityField.entityTypeId,
      isValidationRequired: siteFormEntityField.isValidationRequired,
      meta: siteFormEntityField.meta,
    });
  }

  get dto(): SiteFormFieldEntityFieldDto {
    return {
      meta: this.meta,
      fieldId: this.fieldId,
      entityTypeId: this.entityTypeId,
      isValidationRequired: this.isValidationRequired ? this.isValidationRequired.value : null,
    };
  }
}

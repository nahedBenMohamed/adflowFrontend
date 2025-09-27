import { BooleanModel, InputModel, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import {
  CreateSiteFormFieldDto,
  UpdateSiteFormFieldDto,
  type SiteFormFieldEntityFieldDto,
  type SiteFormFieldEntityNameDto,
} from '../../../../../api';
import type { SiteFormField } from '../SiteFormField/SiteFormField';
import type { SiteFormFieldEntityField } from '../SiteFormField/SiteFormFieldEntityField';
import type { SiteFormFieldEntityName } from '../SiteFormField/SiteFormFieldEntityName';
import { SiteFormFieldType } from '../SiteFormField/SiteFormFieldType';
import { SiteFormFieldEntityFieldModel } from './SiteFormFieldEntityFieldModel';

export class SiteFormElementsFieldModel {
  id: number;
  label: InputModel;
  sortOrder: number;
  type: SiteFormFieldType;
  placeholder: InputModel;
  settings: Nullable<SiteFormFieldEntityFieldModel | SiteFormFieldEntityName>;
  isRequired: Nullable<BooleanModel>;

  constructor({
    id,
    label,
    sortOrder,
    placeholder,
    type,
    settings,
    isRequired,
  }: {
    id: number;
    label: string;
    sortOrder: number;
    type: SiteFormFieldType;
    placeholder: string;
    settings: Nullable<SiteFormFieldEntityField | SiteFormFieldEntityName>;
    isRequired: Nullable<boolean>;
  }) {
    let settingsModel: Nullable<SiteFormFieldEntityFieldModel | SiteFormFieldEntityName> = null;

    if (type === SiteFormFieldType.ENTITY_FIELD && settings)
      settingsModel = SiteFormFieldEntityFieldModel.fromModel(settings as SiteFormFieldEntityField);

    if (type === SiteFormFieldType.ENTITY_NAME && settings) settingsModel = settings;

    this.id = id;
    this.type = type;
    this.sortOrder = sortOrder;
    this.settings = settingsModel;
    this.label = InputModel.create(label);
    this.placeholder = InputModel.create(placeholder);
    this.isRequired = isRequired === null ? null : BooleanModel.create(isRequired);

    makeAutoObservable(this);
  }

  static fromModel(siteFormField: SiteFormField): SiteFormElementsFieldModel {
    return new SiteFormElementsFieldModel({
      id: siteFormField.id,
      type: siteFormField.type,
      label: siteFormField.label || '',
      settings: siteFormField.settings,
      sortOrder: siteFormField.sortOrder,
      placeholder: siteFormField.placeholder || '',
      isRequired: siteFormField.isRequired ?? null,
    });
  }

  static fromModels(siteFormFields: SiteFormField[]): SiteFormElementsFieldModel[] {
    return siteFormFields.map(this.fromModel);
  }

  get title(): string {
    return this.label.value || this.placeholder.value;
  }

  get settingsDto(): Nullable<SiteFormFieldEntityFieldDto | SiteFormFieldEntityNameDto> {
    if (this.type === SiteFormFieldType.ENTITY_FIELD && this.settings)
      return (this.settings as SiteFormFieldEntityFieldModel).dto;

    if (this.type === SiteFormFieldType.ENTITY_NAME && this.settings) return this.settings;

    return null;
  }

  get createFieldDto(): CreateSiteFormFieldDto {
    return new CreateSiteFormFieldDto({
      type: this.type,
      sortOrder: this.sortOrder,
      settings: this.settingsDto,
      label: this.label.trimmedValue,
      placeholder: this.placeholder.trimmedValue,
      isRequired: this.isRequired ? this.isRequired.value : null,
    });
  }

  get updateFieldDto(): UpdateSiteFormFieldDto {
    return new UpdateSiteFormFieldDto({
      id: this.id,
      type: this.type,
      sortOrder: this.sortOrder,
      settings: this.settingsDto,
      label: this.label.trimmedValue,
      placeholder: this.placeholder.trimmedValue,
      isRequired: this.isRequired ? this.isRequired.value : null,
    });
  }
}

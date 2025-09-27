import type { Nullable } from '@/shared';
import type {
  SiteFormFieldDto,
  SiteFormFieldEntityFieldDto,
  SiteFormFieldEntityNameDto,
} from '../../../../../api';
import { SiteFormFieldEntityField } from './SiteFormFieldEntityField';
import { SiteFormFieldEntityName } from './SiteFormFieldEntityName';
import { SiteFormFieldType } from './SiteFormFieldType';

export class SiteFormField {
  id: number;
  sortOrder: number;
  label: Nullable<string>;
  type: SiteFormFieldType;
  placeholder: Nullable<string>;
  settings: Nullable<SiteFormFieldEntityField | SiteFormFieldEntityName>;
  isRequired?: Nullable<boolean>;

  constructor({ id, sortOrder, label, type, placeholder, settings, isRequired }: SiteFormField) {
    this.id = id;
    this.sortOrder = sortOrder;
    this.label = label;
    this.type = type;
    this.placeholder = placeholder;
    this.settings = settings;
    this.isRequired = isRequired;
  }

  static fromDto(dto: SiteFormFieldDto): SiteFormField {
    let settings: Nullable<SiteFormFieldEntityField | SiteFormFieldEntityName> = null;

    if (dto.type === SiteFormFieldType.ENTITY_FIELD && dto.settings)
      settings = SiteFormFieldEntityField.fromDto(dto.settings as SiteFormFieldEntityFieldDto);

    if (dto.type === SiteFormFieldType.ENTITY_NAME && dto.settings)
      settings = SiteFormFieldEntityName.fromDto(dto.settings as SiteFormFieldEntityNameDto);

    return new SiteFormField({
      id: dto.id,
      type: dto.type,
      label: dto.label,
      settings: settings,
      sortOrder: dto.sortOrder,
      isRequired: dto.isRequired,
      placeholder: dto.placeholder,
    });
  }

  static fromDtos(dtos: SiteFormFieldDto[]): SiteFormField[] {
    return dtos.map(this.fromDto);
  }
}

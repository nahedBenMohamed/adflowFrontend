import type { Nullable } from '@/shared';
import type { SiteFormFieldType } from '../../../../shared';
import type { SiteFormFieldEntityFieldDto } from '../SiteFormFieldEntityFieldDto';
import type { SiteFormFieldEntityNameDto } from '../SiteFormFieldEntityNameDto';

export class CreateSiteFormFieldDto {
  sortOrder: number;
  label: Nullable<string>;
  type: SiteFormFieldType;
  placeholder: Nullable<string>;
  settings?: Nullable<SiteFormFieldEntityFieldDto | SiteFormFieldEntityNameDto>;
  isRequired?: Nullable<boolean>;

  constructor({
    sortOrder,
    label,
    type,
    placeholder,
    settings,
    isRequired,
  }: CreateSiteFormFieldDto) {
    this.sortOrder = sortOrder;
    this.label = label;
    this.type = type;
    this.placeholder = placeholder;
    this.settings = settings;
    this.isRequired = isRequired;
  }
}

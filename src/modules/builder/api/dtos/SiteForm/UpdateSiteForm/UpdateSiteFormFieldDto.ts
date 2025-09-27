import type { Nullable } from '@/shared';
import type { SiteFormFieldType } from '../../../../shared';
import type { SiteFormFieldEntityFieldDto } from '../SiteFormFieldEntityFieldDto';
import type { SiteFormFieldEntityNameDto } from '../SiteFormFieldEntityNameDto';

export class UpdateSiteFormFieldDto {
  id: number;
  sortOrder: number;
  label: Nullable<string>;
  type: SiteFormFieldType;
  placeholder: Nullable<string>;
  settings?: Nullable<SiteFormFieldEntityFieldDto | SiteFormFieldEntityNameDto>;
  isRequired?: Nullable<boolean>;

  constructor({
    id,
    sortOrder,
    label,
    type,
    placeholder,
    settings,
    isRequired,
  }: UpdateSiteFormFieldDto) {
    this.id = id;
    this.sortOrder = sortOrder;
    this.label = label;
    this.type = type;
    this.placeholder = placeholder;
    this.settings = settings;
    this.isRequired = isRequired;
  }
}

import type { Nullable } from '@/shared';
import type { SiteFormPageDto } from '../../../../api';
import { SiteFormField } from './SiteFormField/SiteFormField';

export class SiteFormPage {
  id: number;
  title?: Nullable<string>;
  sortOrder: number;
  fields: SiteFormField[];

  constructor({ id, title, sortOrder, fields }: SiteFormPage) {
    this.id = id;
    this.title = title;
    this.sortOrder = sortOrder;
    this.fields = fields;
  }

  static fromDto(dto: SiteFormPageDto): SiteFormPage {
    return new SiteFormPage({
      id: dto.id,
      title: dto.title,
      sortOrder: dto.sortOrder,
      fields: SiteFormField.fromDtos(dto.fields),
    });
  }

  static fromDtos(dtos: SiteFormPageDto[]): SiteFormPage[] {
    return dtos.map(this.fromDto);
  }
}

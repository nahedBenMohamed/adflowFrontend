import type { Nullable } from '@/shared';
import type { CreateSiteFormFieldDto } from '../CreateSiteForm/CreateSiteFormFieldDto';
import type { UpdateSiteFormFieldDto } from './UpdateSiteFormFieldDto';

export class UpdateSiteFormPageDto {
  id: number;
  title?: Nullable<string>;
  sortOrder: number;
  fields: Array<UpdateSiteFormFieldDto | CreateSiteFormFieldDto>;

  constructor({ id, title, sortOrder, fields }: UpdateSiteFormPageDto) {
    this.id = id;
    this.title = title;
    this.sortOrder = sortOrder;
    this.fields = fields;
  }
}

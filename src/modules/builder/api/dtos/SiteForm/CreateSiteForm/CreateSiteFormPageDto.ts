import type { Nullable } from '@/shared';
import type { CreateSiteFormFieldDto } from './CreateSiteFormFieldDto';

export class CreateSiteFormPageDto {
  title?: Nullable<string>;
  sortOrder: number;
  fields: CreateSiteFormFieldDto[];

  constructor({ title, sortOrder, fields }: CreateSiteFormPageDto) {
    this.title = title;
    this.sortOrder = sortOrder;
    this.fields = fields;
  }
}

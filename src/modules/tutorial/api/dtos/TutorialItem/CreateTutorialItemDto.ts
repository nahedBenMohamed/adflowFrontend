import type { Nullable } from '@/shared';
import type { TutorialItemProduct } from '../../../shared';

export class CreateTutorialItemDto {
  name: string;
  link: string;
  sortOrder: number;
  userIds: Nullable<number[]>;
  products: Nullable<TutorialItemProduct[]>;

  constructor({ name, link, sortOrder, userIds, products }: CreateTutorialItemDto) {
    this.name = name;
    this.link = link;
    this.sortOrder = sortOrder;
    this.userIds = userIds;
    this.products = products;
  }
}

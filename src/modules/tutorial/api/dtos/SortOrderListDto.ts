import type { SortOrderDto } from './SortOrderDto';

export class SortOrderListDto {
  items: SortOrderDto[];

  constructor({ items }: SortOrderListDto) {
    this.items = items;
  }
}

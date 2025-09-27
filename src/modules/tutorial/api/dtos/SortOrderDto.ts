export class SortOrderDto {
  id: number;
  sortOrder: number;

  constructor({ id, sortOrder }: SortOrderDto) {
    this.id = id;
    this.sortOrder = sortOrder;
  }
}

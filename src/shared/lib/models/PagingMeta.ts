export class PagingMeta {
  offset: number;
  total: number;

  constructor(offset: number, total: number) {
    this.offset = offset;
    this.total = total;
  }
}

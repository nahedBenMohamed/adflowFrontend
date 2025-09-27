export class EntityFieldFilterDate {
  from?: string;
  to?: string;

  constructor({ from, to }: EntityFieldFilterDate) {
    this.from = from;
    this.to = to;
  }
}

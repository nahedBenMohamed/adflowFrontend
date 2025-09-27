export class EntityFieldFilterNumber {
  from?: number;
  to?: number;

  constructor({ from, to }: EntityFieldFilterNumber) {
    this.from = from;
    this.to = to;
  }
}

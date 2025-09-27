import { type DatePeriodFilterType } from './DatePeriodFilterType';

export class EntityCreatedAtFilter {
  type?: DatePeriodFilterType;
  from?: string;
  to?: string;

  constructor({ type, from, to }: EntityCreatedAtFilter) {
    this.type = type;
    this.from = from;
    this.to = to;
  }
}

import { getProperFromAndToDatesForFilter, UtcDate, type UtcDateValue } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { DateFilter } from './DateFilter';

export class DateFilterFormData {
  from: UtcDateValue;
  to: UtcDateValue;

  constructor({ from, to }: { from?: UtcDateValue; to?: UtcDateValue }) {
    this.from = from ?? null;
    this.to = to ?? null;

    makeAutoObservable(this);
  }

  static fromModel(model: DateFilter): DateFilterFormData {
    return new DateFilterFormData({
      from: UtcDate.parseISONullable(model.from),
      to: UtcDate.parseISONullable(model.to),
    });
  }

  static empty(): DateFilterFormData {
    return new DateFilterFormData({
      from: null,
      to: null,
    });
  }

  toModel = (): DateFilter => {
    const { from, to } = getProperFromAndToDatesForFilter({
      to: this.to,
      from: this.from,
    });

    return {
      // we consider that we do not need to apply local timezone offset to simple date fields
      to: to ? to.formatISOWithoutUnix() : undefined,
      from: from ? from.formatISOWithoutUnix() : undefined,
    };
  };

  isEmpty = (): boolean => {
    return !this.from && !this.to;
  };
}

import { type UtcDateValue } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { type Nullable } from '../types';
import { type DatePeriodFilterType } from './DatePeriodFilterType';

export class DatePeriodFilterModel {
  type?: Nullable<DatePeriodFilterType>;
  from?: UtcDateValue;
  to?: UtcDateValue;

  constructor({ type, from, to }: DatePeriodFilterModel) {
    this.type = type;
    this.from = from;
    this.to = to;

    makeAutoObservable(this);
  }
}

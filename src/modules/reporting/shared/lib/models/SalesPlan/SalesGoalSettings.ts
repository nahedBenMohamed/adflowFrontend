import type { Periods } from '../Periods';

export class SalesGoalSettings {
  periodType: Periods;
  yearWithMonth: number;
  month: number;
  yearWithQuarter: number;
  quarter: number;

  constructor({ periodType, yearWithMonth, month, yearWithQuarter, quarter }: SalesGoalSettings) {
    this.periodType = periodType;
    this.yearWithMonth = yearWithMonth;
    this.month = month;
    this.yearWithQuarter = yearWithQuarter;
    this.quarter = quarter;
  }
}

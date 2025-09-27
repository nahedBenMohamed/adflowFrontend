import type { UtcDate } from '@/shared';
import type { UtcDatesRangeValueModel } from '../../../shared';

export class DatePeriodDto {
  startDate: string;
  endDate: string;

  constructor({ startDate, endDate }: { startDate: UtcDate; endDate: UtcDate }) {
    this.startDate = startDate.formatISOWithoutUnix();
    this.endDate = endDate.formatISOWithoutUnix();
  }

  static fromUtcDatesRangeValueModel(model: UtcDatesRangeValueModel): DatePeriodDto {
    const [startDate, endDate] = model.range;

    if (startDate && !endDate) {
      const newStartDate = startDate.startOfDay();
      const newEndDate = startDate.endOfDay();

      return new DatePeriodDto({ startDate: newStartDate, endDate: newEndDate });
    }

    if (!startDate && endDate) {
      const newStartDate = endDate.startOfDay();
      const newEndDate = endDate.endOfDay();

      return new DatePeriodDto({ startDate: newStartDate, endDate: newEndDate });
    }

    if (startDate && endDate) {
      const newStartDate = startDate.startOfDay();
      const newEndDate = endDate.endOfDay();

      return new DatePeriodDto({ startDate: newStartDate, endDate: newEndDate });
    }

    throw new Error(
      `At least one date should be specified in order to create DatePeriodDto, received ${model.range}`
    );
  }

  static fromUtcDatesRangeValueModels(models: UtcDatesRangeValueModel[]): DatePeriodDto[] {
    return models.map(this.fromUtcDatesRangeValueModel);
  }
}

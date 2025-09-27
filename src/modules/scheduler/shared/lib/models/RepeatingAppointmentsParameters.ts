import { generalSettingsStore } from '@/app';
import { NumberModel, SelectModel, type UtcDate, type UtcDateValue, UuidUtil } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { type RepeatingAppointmentDateValue, RepeatingAppointmentInterval } from '../types';

export class RepeatingAppointmentsParameters {
  interval: SelectModel;
  count: NumberModel;

  selectedAppointments: RepeatingAppointmentDateValue[] = [];

  constructor() {
    this.interval = SelectModel.create(RepeatingAppointmentInterval.NONE);
    this.count = NumberModel.create(0);

    makeAutoObservable(this, {
      repeatingAppointmentsByInterval: false,
    });
  }

  static create(): RepeatingAppointmentsParameters {
    return new RepeatingAppointmentsParameters();
  }

  // consider repeating appointments by interval as enabled if the interval is chosen and count is 1 or more
  get intervalEnabled(): boolean {
    return this.interval.value !== RepeatingAppointmentInterval.NONE && this.count.valueOrZero > 0;
  }

  get listEnabled(): boolean {
    return this.selectedAppointments.length > 0;
  }

  get selectedAppointmentsDays(): UtcDate[] {
    return this.selectedAppointments.filter(a => a.value !== null).map(a => a.value as UtcDate);
  }

  // generates another repeating appointment by incrementing interval to startDate and endDate
  // note, that this is generator, so you should iterate it
  *repeatingAppointmentsByInterval({
    startDate,
    endDate,
  }: {
    startDate: UtcDate;
    endDate: UtcDate;
  }): Generator<{ startDate: UtcDate; endDate: UtcDate }> {
    let currentStart = startDate.clone();
    let currentEnd = endDate.clone();

    for (let i = 0; i <= this.count.valueOrZero; i++) {
      yield {
        startDate: currentStart,
        endDate: currentEnd,
      };

      // increment dates by interval
      switch (this.interval.value) {
        case RepeatingAppointmentInterval.DAY: {
          currentStart = currentStart.addDays(1);
          currentEnd = currentEnd.addDays(1);

          break;
        }

        case RepeatingAppointmentInterval.WEEK: {
          currentStart = currentStart.addWeeks(1);
          currentEnd = currentEnd.addWeeks(1);

          break;
        }

        case RepeatingAppointmentInterval.MONTH: {
          currentStart = currentStart.addMonths(1);
          currentEnd = currentEnd.addMonths(1);

          break;
        }

        case RepeatingAppointmentInterval.NONE: {
          return;
        }

        default:
          throw new Error('Failed to generate repeating visit: invalid interval provided');
      }

      // if we get to non-working day
      while (generalSettingsStore.nonWorkingDaysAsNumberArray?.includes(currentStart.dayOfWeek)) {
        currentStart = currentStart.addDays(1);
        currentEnd = currentEnd.addDays(1);
      }
    }
  }

  repeatingAppointmentsByIntervalStartDates = ({
    startDate,
    endDate,
  }: {
    startDate: UtcDate;
    endDate: UtcDate;
  }): UtcDate[] => {
    return Array.from(this.repeatingAppointmentsByInterval({ startDate, endDate }))
      .map(v => v.startDate)
      .slice(1);
  };

  getSelectedAppointmentsList = ({
    startTime,
    endTime,
  }: {
    startTime: UtcDate;
    endTime: UtcDate;
  }): {
    startDate: UtcDate;
    endDate: UtcDate;
  }[] => {
    return this.selectedAppointments
      .filter(a => a.value !== null)
      .map(a => ({
        startDate: (a.value as UtcDate).setHours(startTime.hours).setMinutes(startTime.minutes),
        endDate: (a.value as UtcDate).setHours(endTime.hours).setMinutes(endTime.minutes),
      }));
  };

  addNewAppointmentDate = (date: UtcDateValue): string => {
    const id = UuidUtil.generate();

    this.selectedAppointments.push({
      id,
      value: date,
    });

    return id;
  };

  removeAppointmentDate = (id: string): void => {
    const idx = this.selectedAppointments.findIndex(a => a.id === id);

    if (idx === -1)
      throw new Error(
        `Failed to remove repeating appointment date: cannot find appointment with id ${id}`
      );

    this.selectedAppointments.splice(idx, 1);
  };

  changeAppointmentDate = ({ id, newDate }: { id: string; newDate: UtcDateValue }) => {
    const idx = this.selectedAppointments.findIndex(a => a.id === id);

    if (idx === -1 || !this.selectedAppointments[idx])
      throw new Error(
        `Failed to update repeating appointment date: cannot find appointment with id ${id}`
      );

    this.selectedAppointments[idx].value = newDate;
  };
}

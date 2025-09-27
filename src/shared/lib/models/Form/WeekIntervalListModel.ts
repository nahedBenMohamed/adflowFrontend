import { UserCalendarInterval } from '@/modules/settings';
import { MathUtil, validateForm } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { WeekDays } from '../WeekDays';
import { InputModel } from './MyInput/InputModel';

interface WeekIntervalModel {
  id: number;
  dayOfWeek: WeekDays;
  timeFrom: InputModel;
  timeTo: InputModel;
}

export class WeekIntervalListModel {
  value: WeekIntervalModel[] = [];
  isValid = true;

  private constructor(initValue: WeekIntervalModel[] = []) {
    this.value = initValue;

    makeAutoObservable(this);
  }

  static create(value?: WeekIntervalModel[]): WeekIntervalListModel {
    return new WeekIntervalListModel(value);
  }

  static createFromUserCalendarIntervals(intervals: UserCalendarInterval[]) {
    return new WeekIntervalListModel(
      intervals.map((i, idx) => ({
        id: idx,
        dayOfWeek: i.dayOfWeek,
        timeFrom: InputModel.create(i.timeFrom).required(),
        timeTo: InputModel.create(i.timeTo).required(),
      }))
    );
  }

  toUserCalendarIntervals = (): UserCalendarInterval[] => {
    return this.value.map(
      i =>
        new UserCalendarInterval({
          dayOfWeek: i.dayOfWeek,
          timeFrom: i.timeFrom.value,
          timeTo: i.timeTo.value,
        })
    );
  };

  add = (dayOfWeek: WeekDays): void => {
    this.value.push({
      id: MathUtil.maxOrZero(this.value.map(i => i.id)) + 1,
      dayOfWeek,
      timeFrom: InputModel.create().required(),
      timeTo: InputModel.create().required(),
    });
  };

  hasIntervals = (dayOfWeek: WeekDays): boolean => {
    return this.getByDayOfWeek(dayOfWeek).length > 0;
  };

  getByDayOfWeek = (dayOfWeek: WeekDays): WeekIntervalModel[] => {
    return this.value.filter(i => i.dayOfWeek === dayOfWeek);
  };

  remove = (id: number): void => {
    this.value = this.value.filter(i => i.id !== id);
  };

  validate = (): boolean => {
    if (!validateForm(this.value)) return false;

    // check for time interval overlaps
    for (const dayOfWeek of Object.values(WeekDays)) {
      const sortedIntervals = this.getByDayOfWeek(dayOfWeek)
        .slice()
        .sort((a, b) => {
          if (a.timeFrom.value < b.timeFrom.value) return -1;
          else if (a.timeFrom.value === b.timeFrom.value) return 0;
          else return 1;
        });

      for (let i = 0; i < sortedIntervals.length - 1; i++) {
        if (sortedIntervals[i]!.timeFrom.value > sortedIntervals[i]!.timeTo.value) return false;

        if (sortedIntervals[i + 1]!.timeFrom.value < sortedIntervals[i]!.timeTo.value) {
          sortedIntervals[i]!.timeTo.showError('Overlap');
          sortedIntervals[i + 1]!.timeFrom.showError('Overlap');

          return false;
        }
      }
    }

    return true;
  };
}

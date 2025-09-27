import { CalendarView, type Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { TaskColorType } from '../shared';

class CalendarViewStore {
  view: CalendarView = CalendarView.DAY;
  taskColorType: Optional<TaskColorType>;

  showWeekend = false;

  timeScaleEnabled = false;
  timeScaleFrom: Optional<string>;
  timeScaleTo: Optional<string>;

  constructor() {
    makeAutoObservable(this);
  }

  getView = (): CalendarView => {
    return this.view;
  };

  setView = (view: CalendarView): void => {
    this.view = view;
  };

  toggleShowWeekend = (): void => {
    this.showWeekend = !this.showWeekend;
  };

  toggleTimeScale = (): void => {
    this.timeScaleEnabled = !this.timeScaleEnabled;
  };

  setTimeScaleFrom = (time: string) => {
    this.timeScaleFrom = time;
  };

  setTimeScaleTo = (time: string) => {
    this.timeScaleTo = time;
  };
}

export const calendarViewStore = new CalendarViewStore();

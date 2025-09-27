import { type Nullable, NumberModel, SelectModel, WeekIntervalListModel } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { userCalendarApi, type UserCalendarDto } from '../api';
import type { UserCalendar } from '../shared';

export class UserCalendarStore {
  calendar: Nullable<UserCalendar>;

  isCalendarEnabled: boolean;

  timeBufferBefore: SelectModel;
  timeBufferAfter: SelectModel;
  appointmentLimit: NumberModel;
  intervals: WeekIntervalListModel;

  constructor() {
    this.calendar = null;
    this.isCalendarEnabled = false;

    makeAutoObservable(this);
  }

  enableCalendar = (): void => {
    this.isCalendarEnabled = true;
  };

  disableCalendar = (): void => {
    this.isCalendarEnabled = false;
  };

  loadData = async (userId: number): Promise<void> => {
    this.calendar = await userCalendarApi.getUserCalendar(userId);

    this.updateForm(this.calendar);
  };

  updateForm = (calendar: Nullable<UserCalendar>): void => {
    this.isCalendarEnabled = Boolean(calendar);

    if (calendar) {
      this.timeBufferBefore = SelectModel.create(calendar.timeBufferBefore ?? 0);
      this.timeBufferAfter = SelectModel.create(calendar.timeBufferAfter ?? 0);
      this.appointmentLimit = NumberModel.create(calendar.appointmentLimit);
      this.intervals = WeekIntervalListModel.createFromUserCalendarIntervals(calendar.intervals);
    } else {
      this.timeBufferBefore = SelectModel.create(0);
      this.timeBufferAfter = SelectModel.create(0);
      this.appointmentLimit = NumberModel.create();
      this.intervals = WeekIntervalListModel.create();
    }
  };

  updateCalendar = async (userId: number): Promise<void> => {
    if (!this.isCalendarEnabled && this.calendar) {
      return await userCalendarApi.deleteUserCalendar(userId);
    } else if (!this.isCalendarEnabled) {
      return;
    }

    const dto: UserCalendarDto = {
      timeBufferBefore: this.timeBufferBefore.value,
      timeBufferAfter: this.timeBufferAfter.value,
      appointmentLimit: this.appointmentLimit.valueOrZero,
      intervals: this.intervals.toUserCalendarIntervals(),
    };

    if (this.calendar) {
      this.calendar = await userCalendarApi.updateUserCalendar({ userId, dto });
    } else {
      this.calendar = await userCalendarApi.createUserCalendar({ userId, dto });
    }

    this.updateForm(this.calendar);
  };

  validate = (): boolean => {
    if (!this.isCalendarEnabled) return true;

    return this.intervals.validate();
  };
}

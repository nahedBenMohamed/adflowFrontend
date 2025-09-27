import {
  ConvertTimeUtil,
  InputModel,
  SelectModel,
  UtcDate,
  validateForm,
  type Nullable,
} from '@/shared';
import { makeAutoObservable } from 'mobx';
import { RepeatingAppointmentsParameters } from './RepeatingAppointmentsParameters';
import type { Schedule } from './Schedule/Schedule';
import { ScheduleType } from './Schedule/ScheduleType';
import type { AddAppointmentPreset } from './ScheduleAppointment/AddAppointmentPreset';
import type { ScheduleAppointment } from './ScheduleAppointment/ScheduleAppointment';
import { ScheduleAppointmentStatus } from './ScheduleAppointment/ScheduleAppointmentStatus';

export class VisitParametersFormData {
  selectedSchedule: Nullable<Schedule> = null;

  status: SelectModel;
  dayValue: SelectModel;
  startTime: InputModel;
  endTime: InputModel;
  comment: InputModel;
  title: InputModel;
  scheduleId: SelectModel;
  performerObjectId: SelectModel;

  repeatingVisitParameters: RepeatingAppointmentsParameters;

  // for time period select when schedule is of board type
  timePeriodModel: SelectModel;

  constructor(selectedSchedule: Nullable<Schedule>) {
    this.selectedSchedule = selectedSchedule;

    makeAutoObservable(this);
  }

  get currentScheduleId(): number {
    if (!this.scheduleId.value)
      throw new Error(`Failed to get currentScheduleId, received: ${this.scheduleId.value}`);

    return this.scheduleId.value as number;
  }

  get startDate(): UtcDate {
    let startDate = this.dayValue.value as UtcDate;

    const { hours, minutes } = ConvertTimeUtil.parseHoursAndMinutesFromHHmmStrict(
      this.startTime.value
    );

    startDate = startDate.setHours(hours);
    startDate = startDate.setMinutes(minutes);

    // for correct start date when 00:00 is selected
    if (startDate.hours === 0 && startDate.minutes === 0) startDate = startDate.startOfDay();

    return startDate;
  }

  get endDate(): UtcDate {
    let endDate = this.dayValue.value as UtcDate;

    const { hours, minutes } = ConvertTimeUtil.parseHoursAndMinutesFromHHmmStrict(
      this.endTime.value
    );

    endDate = endDate.setHours(hours);
    endDate = endDate.setMinutes(minutes);

    // for correct end date when 00:00 is selected
    if (endDate.hours === 0 && endDate.minutes === 0) endDate = endDate.endOfDay();

    return endDate;
  }

  setSelectedSchedule = (schedule: Nullable<Schedule>): void => {
    this.selectedSchedule = schedule;
  };

  initializeFormData = ({
    appointment,
    preset,
  }: {
    appointment: Nullable<ScheduleAppointment>;
    preset: Nullable<AddAppointmentPreset>;
  }): void => {
    let day;
    let startTime;
    let endTime;

    // if preset is provided, use it's values
    if (preset && preset.startDate) {
      day = preset.startDate;
      startTime = `${preset.startDate.getHoursString()}:${preset.startDate.getMinutesString()}`;

      if (preset.endDate)
        endTime = `${preset.endDate.getHoursString()}:${preset.endDate.getMinutesString()}`;
    }

    // if appointment is provided, use it's values
    if (appointment) {
      day = appointment.startDate;
      startTime = `${appointment.startDate.getHoursString()}:${appointment.startDate.getMinutesString()}`;
      endTime = `${appointment.endDate.getHoursString()}:${appointment.endDate.getMinutesString()}`;
    }

    this.title = InputModel.create(appointment?.title ?? undefined);
    this.status = SelectModel.create(
      appointment?.status ?? ScheduleAppointmentStatus.NOT_CONFIRMED
    ).required();

    if (preset?.performerObjectId) {
      this.performerObjectId = SelectModel.create(preset.performerObjectId).required();
    } else if (appointment?.performerId) {
      this.performerObjectId = SelectModel.create(
        this.selectedSchedule?.getObjectIdByPerformerId(appointment.performerId)
      ).required();
    } else {
      this.performerObjectId = SelectModel.create().required();
    }

    this.scheduleId = SelectModel.create(appointment?.scheduleId ?? preset?.scheduleId).required();

    this.dayValue = SelectModel.create(
      day ? day.startOfDay() : UtcDate.startOfCurrentDay()
    ).required();

    this.startTime = InputModel.create(startTime).required();
    this.endTime = InputModel.create(endTime).required();
    this.timePeriodModel = SelectModel.create(startTime);

    this.repeatingVisitParameters = RepeatingAppointmentsParameters.create();

    this.comment = InputModel.create(appointment?.comment ?? undefined);
  };

  validate = (): boolean => {
    if (!this.selectedSchedule)
      throw new Error(
        `Failed to validate visit parameters form data, selectedSchedule must be specified, received: ${this.selectedSchedule}`
      );

    if (this.selectedSchedule.type === ScheduleType.BOARD) {
      this.timePeriodModel.required();

      return validateForm(this);
    } else {
      if (this.startTime.value >= this.endTime.value) {
        this.startTime.showError();
        this.endTime.showError();

        return false;
      }
    }

    return validateForm(this);
  };
}

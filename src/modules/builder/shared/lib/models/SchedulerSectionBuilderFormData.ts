import { generalSettingsStore, iconStore } from '@/app';
import {
  CreateScheduleDto,
  CreateSchedulePerformerDto,
  SchedulePerformerType,
  ScheduleType,
  UpdateScheduleDto,
  UpdateSchedulePerformerDto,
} from '@/modules/scheduler';
import type { UserCalendarInterval } from '@/modules/settings';
import {
  BooleanModel,
  type Icon,
  InputModel,
  MultiselectModel,
  type Nullable,
  type Option,
  SelectModel,
  validateForm,
  WeekIntervalListModel,
} from '@/shared';
import { makeAutoObservable } from 'mobx';
import { generateSchedulerBuilderTimePeriodOptions } from '../helpers';
import { SchedulerIntervalSource } from '../types';
import { NO_LINK_RADIO_VALUE } from './NoLinkRadioValue';

const WORKING_TIME_FROM_FB = '00:00';
const WORKING_TIME_TO_FB = '24:00';

export class SchedulerSectionBuilderFormData {
  name: InputModel;
  icon: Icon;
  performerIdsUsers: MultiselectModel<number>;
  performerIdsGroups: MultiselectModel<number>;
  performerType: InputModel;
  productsSectionId: InputModel;
  entityTypeId: InputModel;
  scheduleType: InputModel;
  timePeriod: SelectModel;
  appointmentLimit: InputModel;
  oneEntityPerDay: BooleanModel;
  timeBufferBefore: SelectModel;
  timeBufferAfter: SelectModel;
  intervals: WeekIntervalListModel;
  intervalsSource: InputModel;

  timePeriodOptions: Option<number>[];

  constructor({
    name,
    icon,
    performerIdsUsers,
    performerIdsGroups,
    productsSectionId,
    entityTypeId,
    performerType,
    scheduleType,
    timePeriod,
    oneEntityPerDay,
    appointmentLimit,
    timeBufferBefore,
    timeBufferAfter,
    intervals,
  }: {
    name: string;
    icon: Icon;
    performerIdsUsers: number[];
    performerIdsGroups: number[];
    productsSectionId: Nullable<number>;
    entityTypeId: Nullable<number>;
    performerType: SchedulePerformerType;
    scheduleType: ScheduleType;
    timePeriod?: Nullable<number>;
    oneEntityPerDay?: boolean;
    appointmentLimit?: Nullable<number>;
    timeBufferBefore?: number;
    timeBufferAfter?: number;
    intervals?: UserCalendarInterval[];
  }) {
    const { accountSettings } = generalSettingsStore;

    this.timePeriodOptions = generateSchedulerBuilderTimePeriodOptions({
      from: accountSettings?.workingTimeFrom ?? WORKING_TIME_FROM_FB,
      to: accountSettings?.workingTimeTo ?? WORKING_TIME_TO_FB,
    });

    this.name = InputModel.create(name).required();
    this.icon = icon;
    this.performerIdsUsers = MultiselectModel.create<number>(performerIdsUsers).required();
    this.performerIdsGroups = MultiselectModel.create<number>(performerIdsGroups).required();
    this.performerType = InputModel.create(performerType).required();
    this.productsSectionId = productsSectionId
      ? InputModel.createFromNumber(productsSectionId)
      : InputModel.create(NO_LINK_RADIO_VALUE);
    this.entityTypeId = entityTypeId
      ? InputModel.createFromNumber(entityTypeId)
      : InputModel.create(NO_LINK_RADIO_VALUE);
    this.scheduleType = InputModel.create(scheduleType).required();
    this.timePeriod = SelectModel.create(
      timePeriod ?? this.timePeriodOptions[0]?.value ?? null
    ).required();
    this.appointmentLimit = InputModel.createFromNumber(appointmentLimit ?? 10)
      .number()
      .min(0)
      .max(1000)
      .required();
    this.oneEntityPerDay = BooleanModel.create(oneEntityPerDay);
    this.timeBufferBefore = SelectModel.create(timeBufferBefore ?? 0);
    this.timeBufferAfter = SelectModel.create(timeBufferAfter ?? 0);
    this.intervals = WeekIntervalListModel.createFromUserCalendarIntervals(intervals ?? []);
    this.intervalsSource = InputModel.create(
      intervals === undefined || intervals.length === 0
        ? SchedulerIntervalSource.PERFORMERS
        : SchedulerIntervalSource.SCHEDULER
    );

    makeAutoObservable(this);
  }

  static empty(defaultTitle = ''): SchedulerSectionBuilderFormData {
    const { accountSettings } = generalSettingsStore;

    const timePeriodOptions = generateSchedulerBuilderTimePeriodOptions({
      from: accountSettings?.workingTimeFrom ?? WORKING_TIME_FROM_FB,
      to: accountSettings?.workingTimeTo ?? WORKING_TIME_TO_FB,
    });

    return new SchedulerSectionBuilderFormData({
      name: defaultTitle,
      performerIdsUsers: [],
      performerIdsGroups: [],
      entityTypeId: null,
      productsSectionId: null,
      icon: iconStore.defaultSchedulerIcon,
      scheduleType: ScheduleType.SCHEDULE,
      performerType: SchedulePerformerType.USER,
      timePeriod: timePeriodOptions[0]?.value ?? null,
      intervals: [],
    });
  }

  get createScheduleDto(): CreateScheduleDto {
    const createPerfomersDtos: CreateSchedulePerformerDto[] =
      this.performerType.value === SchedulePerformerType.DEPARTMENT
        ? this.performerIdsGroups.values.map<CreateSchedulePerformerDto>(
            id =>
              new CreateSchedulePerformerDto({
                userId: null,
                departmentId: id,
                type: SchedulePerformerType.DEPARTMENT,
              })
          )
        : this.performerIdsUsers.values.map<CreateSchedulePerformerDto>(
            id =>
              new CreateSchedulePerformerDto({
                userId: id,
                departmentId: null,
                type: SchedulePerformerType.USER,
              })
          );

    return new CreateScheduleDto({
      icon: this.icon.name,
      name: this.name.value,
      performers: createPerfomersDtos,
      type: this.scheduleType.value as ScheduleType,
      entityTypeId: this.entityTypeId.asNumberOrNull(),
      productsSectionId: this.productsSectionId.asNumberOrNull(),
      timePeriod: this.timePeriod.value,
      appointmentLimit: this.appointmentLimit.asNumberOrUndefined(),
      oneEntityPerDay: this.oneEntityPerDay.value,
      timeBufferBefore: this.timeBufferBefore.value ?? undefined,
      timeBufferAfter: this.timeBufferAfter.value ?? undefined,
      intervals:
        this.intervalsSource.value === SchedulerIntervalSource.SCHEDULER
          ? this.intervals.toUserCalendarIntervals()
          : [],
    });
  }

  get updateScheduleDto(): UpdateScheduleDto {
    const updatePerfomersDtos: UpdateSchedulePerformerDto[] =
      this.performerType.value === SchedulePerformerType.DEPARTMENT
        ? this.performerIdsGroups.values.map<UpdateSchedulePerformerDto>(
            id =>
              new UpdateSchedulePerformerDto({
                userId: null,
                departmentId: id,
                type: SchedulePerformerType.DEPARTMENT,
              })
          )
        : this.performerIdsUsers.values.map<UpdateSchedulePerformerDto>(
            id =>
              new UpdateSchedulePerformerDto({
                userId: id,
                departmentId: null,
                type: SchedulePerformerType.USER,
              })
          );

    return new UpdateScheduleDto({
      icon: this.icon.name,
      name: this.name.value,
      performers: updatePerfomersDtos,
      type: this.scheduleType.value as ScheduleType,
      entityTypeId: this.entityTypeId.asNumberOrNull(),
      productsSectionId: this.productsSectionId.asNumberOrNull(),
      timePeriod: this.timePeriod.value,
      appointmentLimit: this.appointmentLimit.asNumberOrUndefined(),
      oneEntityPerDay: this.oneEntityPerDay.value,
      timeBufferBefore: this.timeBufferBefore.value ?? undefined,
      timeBufferAfter: this.timeBufferAfter.value ?? undefined,
      intervals:
        this.intervalsSource.value === SchedulerIntervalSource.SCHEDULER
          ? this.intervals.toUserCalendarIntervals()
          : [],
    });
  }

  validate = (): boolean => {
    const commonForm: Record<number, object> = {
      0: this.name,
      1: this.icon,
      2: this.scheduleType,
      3: this.performerType,
      4: this.entityTypeId,
      5: this.productsSectionId,
    };

    switch (this.performerType.value) {
      case SchedulePerformerType.USER:
        commonForm[6] = this.performerIdsUsers;

        break;
      case SchedulePerformerType.DEPARTMENT:
        commonForm[6] = this.performerIdsGroups;

        break;
    }

    if (this.scheduleType.value === ScheduleType.SCHEDULE) {
      return validateForm(commonForm);
    }

    return validateForm({
      ...commonForm,
      7: this.timePeriod,
    });
  };

  setIcon = (icon: Icon): void => {
    this.icon = icon;
  };
}

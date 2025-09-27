import type { UserCalendarIntervalDto } from '@/modules/settings';
import type { IconName, Nullable } from '@/shared';
import type { ScheduleType } from '../../../shared';
import type { CreateSchedulePerformerDto } from '../SchedulePerformer/CreateSchedulePerformerDto';

export class CreateScheduleDto {
  name: string;
  icon: IconName;
  type: ScheduleType;
  entityTypeId: Nullable<number>;
  productsSectionId: Nullable<number>;
  performers: CreateSchedulePerformerDto[];
  timePeriod?: number;
  appointmentLimit?: number;
  oneEntityPerDay?: boolean;
  timeBufferBefore?: number;
  timeBufferAfter?: number;
  intervals?: UserCalendarIntervalDto[];

  constructor({
    name,
    icon,
    type,
    entityTypeId,
    productsSectionId,
    performers,
    timePeriod,
    appointmentLimit,
    oneEntityPerDay,
    timeBufferBefore,
    timeBufferAfter,
    intervals,
  }: {
    name: string;
    icon: IconName;
    type: ScheduleType;
    entityTypeId: Nullable<number>;
    productsSectionId: Nullable<number>;
    performers: CreateSchedulePerformerDto[];
    timePeriod?: number;
    appointmentLimit?: number;
    oneEntityPerDay?: boolean;
    timeBufferBefore?: number;
    timeBufferAfter?: number;
    intervals?: UserCalendarIntervalDto[];
  }) {
    this.name = name;
    this.icon = icon;
    this.type = type;
    this.entityTypeId = entityTypeId;
    this.productsSectionId = productsSectionId;
    this.performers = performers;
    this.timePeriod = timePeriod;
    this.appointmentLimit = appointmentLimit;
    this.oneEntityPerDay = oneEntityPerDay;
    this.timeBufferBefore = timeBufferBefore;
    this.timeBufferAfter = timeBufferAfter;
    this.intervals = intervals;
  }
}

import type { UserCalendarIntervalDto } from '@/modules/settings';
import type { IconName, Nullable } from '@/shared';
import type { ScheduleType } from '../../../shared';
import type { UpdateSchedulePerformerDto } from '../SchedulePerformer/UpdateSchedulePerformerDto';

export class UpdateScheduleDto {
  name: string;
  icon: IconName;
  type: ScheduleType;
  performers: UpdateSchedulePerformerDto[];
  timePeriod?: number;
  appointmentLimit?: number;
  entityTypeId?: Nullable<number>;
  productsSectionId?: Nullable<number>;
  oneEntityPerDay?: boolean;
  timeBufferBefore?: number;
  timeBufferAfter?: number;
  intervals?: UserCalendarIntervalDto[];

  constructor({
    name,
    icon,
    type,
    performers,
    timePeriod,
    appointmentLimit,
    entityTypeId,
    productsSectionId,
    oneEntityPerDay,
    timeBufferBefore,
    timeBufferAfter,
    intervals,
  }: {
    name: string;
    icon: IconName;
    type: ScheduleType;
    performers: UpdateSchedulePerformerDto[];
    timePeriod?: number;
    appointmentLimit?: number;
    entityTypeId?: Nullable<number>;
    productsSectionId?: Nullable<number>;
    oneEntityPerDay?: boolean;
    timeBufferBefore?: number;
    timeBufferAfter?: number;
    intervals?: UserCalendarIntervalDto[];
  }) {
    this.name = name;
    this.icon = icon;
    this.type = type;
    this.performers = performers;
    this.timePeriod = timePeriod;
    this.appointmentLimit = appointmentLimit;
    this.entityTypeId = entityTypeId;
    this.productsSectionId = productsSectionId;
    this.oneEntityPerDay = oneEntityPerDay;
    this.timeBufferBefore = timeBufferBefore;
    this.timeBufferAfter = timeBufferAfter;
    this.intervals = intervals;
  }
}

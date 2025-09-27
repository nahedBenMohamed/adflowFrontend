import { UserCalendarInterval } from '@/modules/settings';
import { UtcDate, type IconName, type Nullable } from '@/shared';
import type { ScheduleDto } from '../../../../api';
import { SchedulePerformer } from './SchedulePerformer';
import { SchedulePerformerType } from './SchedulePerformerType';
import type { ScheduleType } from './ScheduleType';

export class Schedule {
  id: number;
  name: string;
  icon: IconName;
  type: ScheduleType;
  entityTypeId: Nullable<number>;
  productsSectionId: Nullable<number>;
  createdAt: UtcDate;
  performers: SchedulePerformer[];
  timePeriod?: Nullable<number>;
  appointmentLimit?: Nullable<number>;
  oneEntityPerDay?: boolean;
  timeBufferBefore?: number;
  timeBufferAfter?: number;
  intervals?: UserCalendarInterval[];

  constructor({
    id,
    name,
    icon,
    type,
    entityTypeId,
    productsSectionId,
    createdAt,
    performers,
    timePeriod,
    appointmentLimit,
    oneEntityPerDay,
    timeBufferBefore,
    timeBufferAfter,
    intervals,
  }: {
    id: number;
    name: string;
    icon: IconName;
    type: ScheduleType;
    entityTypeId: Nullable<number>;
    productsSectionId: Nullable<number>;
    createdAt: UtcDate;
    performers: SchedulePerformer[];
    timePeriod?: Nullable<number>;
    appointmentLimit?: Nullable<number>;
    oneEntityPerDay?: boolean;
    timeBufferBefore?: number;
    timeBufferAfter?: number;
    intervals?: UserCalendarInterval[];
  }) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.type = type;
    this.timePeriod = timePeriod;
    this.appointmentLimit = appointmentLimit;
    this.entityTypeId = entityTypeId;
    this.productsSectionId = productsSectionId;
    this.createdAt = createdAt;
    this.performers = performers;
    this.oneEntityPerDay = oneEntityPerDay;
    this.timeBufferBefore = timeBufferBefore;
    this.timeBufferAfter = timeBufferAfter;
    this.intervals = intervals;
  }

  static fromDto(dto: ScheduleDto): Schedule {
    return new Schedule({
      id: dto.id,
      name: dto.name,
      icon: dto.icon,
      type: dto.type,
      timePeriod: dto.timePeriod,
      appointmentLimit: dto.appointmentLimit,
      entityTypeId: dto.entityTypeId,
      productsSectionId: dto.productsSectionId,
      createdAt: UtcDate.parseISO(dto.createdAt),
      performers: SchedulePerformer.fromDtos(dto.performers),
      oneEntityPerDay: dto.oneEntityPerDay,
      timeBufferBefore: dto.timeBufferBefore,
      timeBufferAfter: dto.timeBufferAfter,
      intervals: dto.intervals ? UserCalendarInterval.fromDtos(dto.intervals) : [],
    });
  }

  static fromDtos(dtos: ScheduleDto[]): Schedule[] {
    return dtos.map(this.fromDto);
  }

  get performersType(): SchedulePerformerType {
    if (this.performers.every(p => p.type === SchedulePerformerType.USER))
      return SchedulePerformerType.USER;

    if (this.performers.every(p => p.type === SchedulePerformerType.DEPARTMENT))
      return SchedulePerformerType.DEPARTMENT;

    throw new Error(
      `Mixed performers types or no performers in schedule ${this.id}, this behavior is not supported`
    );
  }

  get perfomersObjectsIds(): number[] {
    // as number[] is unnecessary here, but it's needed to make TS happy, .filter(Boolean) will
    // make sure that there are no falsy values in array
    if (this.performersType === SchedulePerformerType.USER) {
      return this.performers.map<Nullable<number>>(p => p.userId).filter(Boolean);
    } else {
      return this.performers.map<Nullable<number>>(p => p.departmentId).filter(Boolean);
    }
  }

  getPerformerByObjectId = (objectId: number): Nullable<SchedulePerformer> => {
    let performer: Nullable<SchedulePerformer> = null;

    if (this.performersType === SchedulePerformerType.USER) {
      const userPerformer = this.performers.find(p => p.userId === objectId);

      if (!userPerformer) return null;

      performer = userPerformer;
    }

    if (this.performersType === SchedulePerformerType.DEPARTMENT) {
      const departmentPerformer = this.performers.find(p => p.departmentId === objectId);

      if (!departmentPerformer) return null;

      performer = departmentPerformer;
    }

    if (!performer) return null;

    return performer;
  };

  getObjectIdByPerformerId = (performerId: number): Nullable<number> => {
    const performer = this.performers.find(p => p.id === performerId);

    if (!performer) return null;

    if (this.performersType === SchedulePerformerType.USER && performer.userId)
      return performer.userId;

    if (this.performersType === SchedulePerformerType.DEPARTMENT && performer.departmentId)
      return performer.departmentId;

    return null;
  };
}

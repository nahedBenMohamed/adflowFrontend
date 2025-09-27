import { userStore } from '@/app';
import { TaskStatus } from '@/modules/card';
import type { GanttRecord } from '@/modules/gantt';
import {
  type EntityInfo,
  FileLink,
  type Nullable,
  type Optional,
  TaskTimeStatus,
  type UserRights,
  UtcDate,
  type UtcDateValue,
} from '@/shared';
import { makeObservable } from 'mobx';
import type {
  ActivityCardDto,
  ActivityDto,
  BaseTaskDto,
  TaskCardDto,
  TaskDto,
} from '../../../../api';
import { DeadlineType } from '../DeadlineType';
import type { DateStringObject } from '../Task/DateStringObject';
import type { Subtask } from '../Task/Subtask';
import { TaskView } from './TaskView';

export abstract class BaseTask {
  id: number;
  responsibleUserId: number;
  view: TaskView;
  startDate: UtcDateValue;
  endDate: UtcDateValue;
  text: string;
  createdAt: UtcDate;
  createdBy: number;
  isResolved: boolean;
  resolvedDate: UtcDateValue;
  fileLinks: FileLink[];
  subtaskCount: number;
  userRights: UserRights;
  entityInfo: Nullable<EntityInfo>;
  weight: number;

  constructor(
    id: number,
    responsibleUserId: number,
    view: TaskView,
    startDate: UtcDateValue,
    endDate: UtcDateValue,
    text: string,
    createdAt: UtcDate,
    createdBy: number,
    isResolved: boolean,
    resolvedDate: UtcDateValue,
    fileLinks: FileLink[],
    subtaskCount: number,
    userRights: UserRights,
    entityInfo: Nullable<EntityInfo>,
    weight: number
  ) {
    this.id = id;
    this.responsibleUserId = responsibleUserId;
    this.view = view;
    this.startDate = startDate;
    this.endDate = endDate;
    this.text = text;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.isResolved = isResolved;
    this.resolvedDate = resolvedDate;
    this.fileLinks = fileLinks;
    this.subtaskCount = subtaskCount;
    this.userRights = userRights;
    this.entityInfo = entityInfo;
    this.weight = weight;

    makeObservable(this, {
      id: true,
      responsibleUserId: true,
      view: true,
      startDate: true,
      endDate: true,
      text: true,
      createdAt: true,
      createdBy: true,
      isResolved: true,
      resolvedDate: true,
      fileLinks: true,
      duration: true,
      status: true,
      timeStatus: true,
      isTaskToday: true,
      isTaskTomorrow: true,
      isTaskUpcoming: true,
      isTaskExpired: true,
      isActivityView: true,
      isTaskView: true,
      titleDateString: true,
      compareResolvedDate: true,
      entityInfo: true,
    });
  }

  static fromBaseDto(dto: BaseTaskDto): BaseTask {
    if (dto.view === TaskView.TASK) return Task.fromDto(dto as TaskDto);

    if (dto.view === TaskView.ACTIVITY) return Activity.fromDto(dto as ActivityDto);

    throw new Error(`Unknown task view: ${dto.view}`);
  }

  static fromBaseCardDto(card: BaseTaskDto): BaseTask {
    if (card.view === TaskView.TASK) return Task.fromCardDto(card as TaskCardDto);

    if (card.view === TaskView.ACTIVITY) return Activity.fromCardDto(card as ActivityCardDto);

    throw new Error(`Unknown task view: ${card.view}`);
  }

  static fromCardDtos(cards: BaseTaskDto[]): BaseTask[] {
    return cards.map(c => this.fromBaseCardDto(c));
  }

  duration = (): Nullable<number> => {
    if (this.startDate && this.endDate) return this.endDate.diff(this.startDate);

    return null;
  };

  status = (): TaskStatus => {
    if (this.isResolved) return TaskStatus.RESOLVED;

    if (this.isTaskExpired()) return TaskStatus.EXPIRED;

    return TaskStatus.ACTIVE;
  };

  timeStatus = (): TaskTimeStatus => {
    switch (this.status()) {
      case TaskStatus.RESOLVED:
        return TaskTimeStatus.RESOLVED;

      case TaskStatus.EXPIRED:
        return TaskTimeStatus.EXPIRED;

      case TaskStatus.ACTIVE:
        if (this.isTaskToday()) return TaskTimeStatus.ACTIVE_TODAY;

        return TaskTimeStatus.ACTIVE_FUTURE;
    }
  };

  deadlineType = (): DeadlineType => {
    if (this.isResolved) return DeadlineType.RESOLVED;

    if (this.isTaskExpired()) return DeadlineType.OVERDUE;

    if (this.isTaskToday()) return DeadlineType.TODAY;

    if (this.isTaskTomorrow()) return DeadlineType.TOMORROW;

    if (this.isTaskUpcoming()) return DeadlineType.UPCOMING;

    if (this.isUnallocated()) return DeadlineType.UNALLOCATED;

    throw new Error('Can not determine deadline type');
  };

  isTaskToday = (): boolean => {
    const now = UtcDate.now();
    const endOfTheDay = now.endOfDay();

    if (this.startDate && this.endDate)
      return this.startDate.lessOrEqualThan(endOfTheDay) && this.endDate.greaterThan(now);

    if (this.startDate)
      return this.startDate.greaterOrEqualThan(now) && this.startDate.lessOrEqualThan(endOfTheDay);

    if (this.endDate)
      return this.endDate.greaterOrEqualThan(now) && this.endDate.lessOrEqualThan(endOfTheDay);

    return false;
  };

  isTaskTomorrow = (): boolean => {
    if (this.startDate) return this.startDate.isTomorrow();

    if (this.endDate) return this.endDate.isTomorrow();

    return false;
  };

  // upcoming -> more than 2 days from now
  isTaskUpcoming = (): boolean => {
    if (this.startDate) return this.startDate.isUpcoming();

    if (this.endDate) return this.endDate.isUpcoming();

    return false;
  };

  isUnallocated = (): boolean => {
    return this.startDate === null || this.endDate === null;
  };

  isTaskExpired = (): boolean => {
    return this.endDate ? this.endDate.isExpired() : false;
  };

  isActivityView = (): boolean => {
    return this.view === TaskView.ACTIVITY;
  };

  isTaskView = (): boolean => {
    return this.view === TaskView.TASK;
  };

  titleDateString = (): string => {
    // e.g. 24 Oct, 2022 at 12:00 PM from John Doe
    return `${this.createdAt.displayLong()} at ${this.createdAt.displayTime()} from ${
      userStore.getById(this.createdBy).fullName
    }`;
  };

  compareResolvedDate = (card: BaseTask): number => {
    if (!this.resolvedDate && !card.resolvedDate) {
      return 0;
    } else if (!this.resolvedDate) {
      return -1;
    } else if (!card.resolvedDate) {
      return 1;
    } else {
      return this.resolvedDate.diff(card.resolvedDate, false);
    }
  };
}

export class Task extends BaseTask {
  title: string;
  boardId: Nullable<number>;
  stageId: Nullable<number>;
  plannedTime: Nullable<number>;
  subtasks: Subtask[];
  settingsId: Nullable<number>;
  dependency: Optional<number>;

  constructor(
    id: number,
    responsibleUserId: number,
    view: TaskView,
    startDate: UtcDateValue,
    endDate: UtcDateValue,
    text: string,
    createdAt: UtcDate,
    createdBy: number,
    isResolved: boolean,
    resolvedDate: UtcDateValue,
    title: string,
    boardId: Nullable<number>,
    stageId: Nullable<number> = null,
    fileLinks: FileLink[],
    subtaskCount: number,
    plannedTime: Nullable<number> = null,
    subtasks: Subtask[],
    settingsId: Nullable<number>,
    dependency: Optional<number>,
    userRights: UserRights,
    entityInfo: Nullable<EntityInfo>,
    weight: number
  ) {
    super(
      id,
      responsibleUserId,
      view,
      startDate,
      endDate,
      text,
      createdAt,
      createdBy,
      isResolved,
      resolvedDate,
      fileLinks,
      subtaskCount,
      userRights,
      entityInfo,
      weight
    );

    this.title = title;
    this.boardId = boardId;
    this.stageId = stageId;
    this.plannedTime = plannedTime;
    this.subtasks = subtasks;
    this.settingsId = settingsId;
    this.dependency = dependency;

    makeObservable(this, {
      title: true,
      boardId: true,
      stageId: true,
      plannedTime: true,
      subtasks: true,
      settingsId: true,
      dependency: true,
      headerDateString: true,
    });
  }

  headerDateString = (): Nullable<DateStringObject> => {
    if (!this.startDate && !this.endDate) return null;

    const result: DateStringObject = {
      start: null,
      end: null,
    };

    if (this.startDate)
      result.start = `${this.startDate.format('D MMM')} at ${this.startDate.displayTime()}`;

    if (this.endDate)
      result.end = `${this.endDate.format('D MMM')} at ${this.endDate.displayTime()}`;

    return result;
  };

  static fromDto(dto: TaskDto): Task {
    return new Task(
      dto.id,
      dto.responsibleUserId,
      dto.view,
      UtcDate.parseISONullable(dto.startDate),
      UtcDate.parseISONullable(dto.endDate),
      dto.text,
      UtcDate.parseISO(dto.createdAt),
      dto.createdBy,
      dto.isResolved,
      UtcDate.parseISONullable(dto.resolvedDate),
      dto.title,
      dto.boardId,
      dto.stageId,
      dto.fileLinks.map(fl => FileLink.fromDto(fl)),
      dto.subtaskCount,
      dto.plannedTime,
      dto.subtasks,
      dto.settingsId,
      dto.dependency,
      dto.userRights,
      dto.entityInfo,
      dto.weight
    );
  }

  static fromCardDto(dto: TaskCardDto): Task {
    return new Task(
      dto.id,
      dto.responsibleUserId,
      dto.view,
      UtcDate.parseISONullable(dto.startDate),
      UtcDate.parseISONullable(dto.endDate),
      dto.text,
      UtcDate.parseISO(dto.createdAt),
      dto.createdBy,
      dto.isResolved,
      UtcDate.parseISONullable(dto.resolvedDate),
      dto.title,
      dto.boardId,
      dto.stageId,
      dto.fileLinks.map(fl => FileLink.fromDto(fl)),
      dto.subtaskCount,
      dto.plannedTime,
      [],
      dto.settingsId,
      dto.dependency,
      dto.userRights,
      dto.entityInfo,
      dto.weight
    );
  }

  static fromGanttRecord(record: GanttRecord): Optional<Task> {
    if (record.entityTypeId) return;

    return new Task(
      record.id,
      record.responsibleUserId,
      record.view ?? TaskView.TASK,
      record.startDate,
      record.endDate,
      record.text as string,
      record.createdAt,
      record.createdBy as number,
      record.isResolved as boolean,
      record.resolvedDate as UtcDate,
      record.title,
      record.boardId,
      record.stageId,
      record.fileLinks as FileLink[],
      record.subtaskCount as number,
      record.plannedTime,
      record.subtasks as Subtask[],
      record.settingsId as number,
      record.dependency,
      record.userRights,
      record.entityInfo ?? null,
      record.weight as number
    );
  }
}

export class Activity extends BaseTask {
  activityTypeId: number;
  result: Nullable<string>;

  constructor(
    id: number,
    responsibleUserId: number,
    view: TaskView,
    startDate: UtcDate,
    endDate: UtcDate,
    text: string,
    createdAt: UtcDate,
    createdBy: number,
    isResolved: boolean,
    resolvedDate: UtcDateValue,
    result: Nullable<string>,
    activityTypeId: number,
    fileLinks: FileLink[],
    subtaskCount: number,
    userRights: UserRights,
    entityInfo: Nullable<EntityInfo>,
    weight: number
  ) {
    super(
      id,
      responsibleUserId,
      view,
      startDate,
      endDate,
      text,
      createdAt,
      createdBy,
      isResolved,
      resolvedDate,
      fileLinks,
      subtaskCount,
      userRights,
      entityInfo,
      weight
    );

    this.result = result;
    this.activityTypeId = activityTypeId;

    makeObservable(this, {
      result: true,
      activityTypeId: true,
      headerDateString: true,
    });
  }

  headerDateString = (): Optional<string> => {
    // e.g. 24 Oct at 11:00 PM-11:30 PM
    if (this.startDate && this.endDate)
      return `${this.startDate.displayTime()} — ${this.endDate.displayTime()}`;
  };

  static fromDto(dto: ActivityDto): Activity {
    return new Activity(
      dto.id,
      dto.responsibleUserId,
      dto.view,
      UtcDate.parseISO(dto.startDate!),
      UtcDate.parseISO(dto.endDate!),
      dto.text,
      UtcDate.parseISO(dto.createdAt),
      dto.createdBy,
      dto.isResolved,
      UtcDate.parseISONullable(dto.resolvedDate),
      dto.result,
      dto.activityTypeId,
      dto.fileLinks.map(fl => FileLink.fromDto(fl)),
      dto.subtaskCount,
      dto.userRights,
      dto.entityInfo,
      dto.weight
    );
  }

  static fromCardDto(dto: ActivityCardDto): Activity {
    return new Activity(
      dto.id,
      dto.responsibleUserId,
      dto.view,
      UtcDate.parseISO(dto.startDate!),
      UtcDate.parseISO(dto.endDate!),
      dto.text,
      UtcDate.parseISO(dto.createdAt),
      dto.createdBy,
      dto.isResolved,
      UtcDate.parseISONullable(dto.resolvedDate),
      null,
      dto.activityTypeId,
      dto.fileLinks.map(fl => FileLink.fromDto(fl)),
      dto.subtaskCount,
      dto.userRights,
      dto.entityInfo,
      dto.weight
    );
  }
}

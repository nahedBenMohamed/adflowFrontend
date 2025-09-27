import { TaskStatus } from '@/modules/card';
import type { EntityBoardCard, ProjectEntityCard } from '@/modules/section';
import type { Subtask, Task, TaskView } from '@/modules/tasks';
import {
  type EntityInfo,
  type FileLink,
  type Nullable,
  type Optional,
  TaskTimeStatus,
  type UserRights,
  UtcDate,
  type UtcDateValue,
} from '@/shared';

export type GanttRecordType = 'task' | 'project';

export class GanttRecord {
  type: GanttRecordType;

  id: number;
  title: string;
  boardId: Nullable<number>;
  stageId: Nullable<number>;
  plannedTime?: Nullable<number>;
  subtasks?: Subtask[];
  settingsId?: Nullable<number>;
  dependency?: Optional<number>;
  entityTypeId?: Nullable<number>;

  responsibleUserId: number;
  view?: TaskView;
  startDate: UtcDateValue;
  endDate: UtcDateValue;
  text?: string;
  createdAt: UtcDate;
  createdBy?: number;
  isResolved?: boolean;
  resolvedDate?: UtcDateValue;
  fileLinks?: FileLink[];
  subtaskCount?: number;
  userRights: UserRights;
  entityInfo?: Nullable<EntityInfo>;
  weight?: number;

  group?: boolean;
  collapsed?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  children?: GanttRecord[];

  dateFormat: string;
  timeFormat: string;

  constructor(record: Omit<GanttRecord, 'timeStatus' | 'isToday' | 'isExpired' | 'status'>) {
    this.type = record.type;
    this.id = record.id;
    this.title = record.title;
    this.collapsed = record.collapsed;
    this.endDate = record.endDate;
    this.startDate = record.startDate;
    this.boardId = record.boardId;
    this.stageId = record.stageId;
    this.plannedTime = record.plannedTime;
    this.subtasks = record.subtasks;
    this.settingsId = record.settingsId;
    this.dependency = record.dependency;
    this.entityTypeId = record.entityTypeId;
    this.responsibleUserId = record.responsibleUserId;
    this.view = record.view;
    this.text = record.text;
    this.createdBy = record.createdBy;
    this.isResolved = record.isResolved;
    this.resolvedDate = record.resolvedDate;
    this.fileLinks = record.fileLinks;
    this.subtaskCount = record.subtaskCount;
    this.userRights = record.userRights;
    this.entityInfo = record.entityInfo;
    this.weight = record.weight;
    this.group = record.group;
    this.collapsed = record.collapsed;
    this.borderColor = record.borderColor;
    this.backgroundColor = record.backgroundColor;
    this.children = record.children;
    this.dateFormat = record.dateFormat;
    this.timeFormat = record.timeFormat;
  }

  static fromTask(task: Task): GanttRecord {
    return new GanttRecord({
      type: 'task',
      id: task.id,
      title: task.title,
      boardId: task.boardId,
      stageId: task.stageId,
      plannedTime: task.plannedTime,
      subtaskCount: task.subtaskCount,
      userRights: task.userRights,
      entityInfo: task.entityInfo,
      subtasks: task.subtasks,
      settingsId: task.settingsId,
      dependency: task.dependency,
      responsibleUserId: task.responsibleUserId,
      view: task.view,
      startDate: task.startDate,
      endDate: task.endDate,
      text: task.text,
      createdAt: task.createdAt,
      createdBy: task.createdBy,
      isResolved: task.isResolved,
      resolvedDate: task.resolvedDate,
      fileLinks: task.fileLinks,
      weight: task.weight,
      dateFormat: 'MMM DD, HH:mm',
      timeFormat: 'HH:mm',
    });
  }

  static fromTasks(tasks: Task[]): GanttRecord[] {
    return tasks.map(this.fromTask);
  }

  static fromProject({
    project,
    boardId,
  }: {
    project: EntityBoardCard;
    boardId: number;
  }): GanttRecord {
    return new GanttRecord({
      type: 'project',
      id: project.id,
      title: project.data.name,
      boardId,
      stageId: project.stageId,
      entityTypeId: project.data.entityTypeId,
      subtaskCount: (project.data as ProjectEntityCard).tasksCount.today,
      responsibleUserId: (project.data as ProjectEntityCard).ownerId,
      startDate: (project.data as ProjectEntityCard).startDate,
      endDate: (project.data as ProjectEntityCard).endDate,
      createdAt: (project.data as ProjectEntityCard).createdAt,
      userRights: (project.data as ProjectEntityCard).userRights,
      dateFormat: 'MMM DD',
      timeFormat: 'MMM DD',
    });
  }

  static fromProjects({
    projects,
    boardId,
  }: {
    projects: EntityBoardCard[];
    boardId: number;
  }): GanttRecord[] {
    return projects.map(project => this.fromProject({ project, boardId }));
  }

  isExpired = (): boolean => {
    return this.endDate ? this.endDate.isExpired() : false;
  };

  isToday = (): boolean => {
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

  status = (): TaskStatus => {
    if (this.isResolved) return TaskStatus.RESOLVED;

    if (this.isExpired()) return TaskStatus.EXPIRED;

    return TaskStatus.ACTIVE;
  };

  get timeStatus(): TaskTimeStatus {
    switch (this.status()) {
      case TaskStatus.RESOLVED:
        return TaskTimeStatus.RESOLVED;

      case TaskStatus.EXPIRED:
        return TaskTimeStatus.EXPIRED;

      case TaskStatus.ACTIVE:
        if (this.isToday()) return TaskTimeStatus.ACTIVE_TODAY;

        return TaskTimeStatus.ACTIVE_FUTURE;

      default:
        return TaskTimeStatus.ACTIVE_FUTURE;
    }
  }
}

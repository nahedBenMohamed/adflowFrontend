import type { Nullable, UserRights, UtcDate, UtcDateValue } from '@/shared';
import type { TasksCount } from './TasksCount';

export class ProjectEntityCard {
  id: number;
  entityTypeId: number;
  name: string;
  ownerId: number;
  participantIds: number[];
  startDate: UtcDateValue;
  endDate: UtcDateValue;
  tasksCount: TasksCount;
  userRights: UserRights;
  createdAt: UtcDate;
  copiedFrom: Nullable<number>;
  copiedCount: Nullable<number>;

  constructor({
    id,
    entityTypeId,
    name,
    ownerId,
    participantIds,
    startDate,
    endDate,
    tasksCount,
    userRights,
    createdAt,
    copiedCount,
    copiedFrom,
  }: ProjectEntityCard) {
    this.id = id;
    this.entityTypeId = entityTypeId;
    this.name = name;
    this.ownerId = ownerId;
    this.participantIds = participantIds;
    this.startDate = startDate;
    this.endDate = endDate;
    this.tasksCount = tasksCount;
    this.userRights = userRights;
    this.createdAt = createdAt;
    this.copiedCount = copiedCount;
    this.copiedFrom = copiedFrom;
  }
}

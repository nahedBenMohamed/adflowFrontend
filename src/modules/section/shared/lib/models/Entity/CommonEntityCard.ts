import type { Nullable, UserRights, UtcDate } from '@/shared';
import type { TFunction } from 'i18next';
import { TaskIndicator } from '../TaskIndicator';

export class CommonEntityCard {
  id: number;
  entityTypeId: number;
  name: string;
  userId: number;
  createdAt: UtcDate;
  linkedEntityNames: string[];
  taskIndicatorColor: TaskIndicator;
  userRights: UserRights;
  copiedFrom: Nullable<number>;
  copiedCount: Nullable<number>;

  constructor({
    id,
    entityTypeId,
    name,
    userId,
    createdAt,
    linkedEntityNames,
    taskIndicatorColor,
    userRights,
    copiedCount,
    copiedFrom,
  }: {
    id: number;
    entityTypeId: number;
    name: string;
    userId: number;
    createdAt: UtcDate;
    linkedEntityNames: string[];
    taskIndicatorColor: TaskIndicator;
    userRights: UserRights;
    copiedFrom: Nullable<number>;
    copiedCount: Nullable<number>;
  }) {
    this.id = id;
    this.entityTypeId = entityTypeId;
    this.name = name;
    this.userId = userId;
    this.createdAt = createdAt;
    this.linkedEntityNames = linkedEntityNames;
    this.taskIndicatorColor = taskIndicatorColor;
    this.userRights = userRights;
    this.copiedFrom = copiedFrom;
    this.copiedCount = copiedCount;
  }

  getCardStatusTitle = ({
    indicatorColor,
    t,
  }: {
    indicatorColor: TaskIndicator;
    t: TFunction;
  }): string => {
    switch (indicatorColor) {
      case TaskIndicator.TODAY:
        return t('task_today');

      case TaskIndicator.OVERDUE:
        return t('overdue_task');

      case TaskIndicator.UPCOMING:
        return t('upcoming_task');

      case TaskIndicator.EMPTY:
        return t('no_tasks');
    }
  };
}

import type { ManualSorting, Nullable, Optional, StageCode } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { UserTimeAllocation } from '../api';
import type { BaseTask, DeadlineType, TaskGroup } from '../shared';

interface Card {
  id: number;
  taskCard: BaseTask;
  groupId: number;
  idx: number;
}

type DropCardHandler = ({
  task,
  newGroupId,
  sorting,
}: {
  task: BaseTask;
  newGroupId: number;
  sorting: ManualSorting;
}) => void;
type ToggleResolvedHandler = (task: BaseTask) => void;

export class TasksGroupStore {
  taskGroups: TaskGroup[] = [];

  dropCard: DropCardHandler;
  toggleResolved: ToggleResolvedHandler;

  constructor({
    dropCard,
    toggleResolved,
  }: {
    dropCard: DropCardHandler;
    toggleResolved: ToggleResolvedHandler;
  }) {
    this.dropCard = dropCard;
    this.toggleResolved = toggleResolved;

    makeAutoObservable(this);
  }

  setTaskGroups = (taskGroups: TaskGroup[]): void => {
    this.taskGroups = taskGroups;
  };

  moveCard = ({ id, atGroupId, atIdx }: { id: number; atGroupId: number; atIdx: number }): void => {
    const card = this._findCard(id);

    if (card) {
      const { taskCard: task, idx, groupId: oldGroupId } = card;

      const oldGroup = this.findGroup(oldGroupId);
      const newGroup = this.findGroup(atGroupId);

      if (oldGroup && newGroup) {
        oldGroup.tasks.splice(idx, 1);
        newGroup.tasks.splice(atIdx, 0, task);
      }
    }
  };

  findGroup = (id: number): Nullable<TaskGroup> => {
    return this.taskGroups.find(i => i.id === id) ?? null;
  };

  findGroupByTaskId = (taskId: number): Nullable<TaskGroup> => {
    for (const group of this.taskGroups) {
      const idx = group.tasks.findIndex(i => i.id === taskId);

      if (idx !== -1) return group;
    }

    return null;
  };

  findGroupByCode = (code: DeadlineType | StageCode): Optional<TaskGroup> => {
    return this.taskGroups.find(tg => tg.code === code);
  };

  updateMetaById = ({
    count,
    groupId,
    timeAllocation,
  }: {
    count: number;
    groupId: number;
    timeAllocation?: UserTimeAllocation[];
  }): void => {
    const group = this.findGroup(groupId);

    if (!group) return;

    group.count = count;

    if (timeAllocation) group.timeAllocation = timeAllocation;
  };

  updateMetaByCode = ({
    code,
    count,
    timeAllocation,
  }: {
    code: DeadlineType | StageCode;
    count: number;
    timeAllocation?: UserTimeAllocation[];
  }): void => {
    const group = this.findGroupByCode(code);

    if (!group) return;

    group.count = count;

    if (timeAllocation) group.timeAllocation = timeAllocation;
  };

  private _findCard = (taskId: number): Nullable<Card> => {
    for (const group of this.taskGroups) {
      const idx = group.tasks.findIndex(t => t.id === taskId);

      const taskCard = idx === -1 ? null : group.tasks[idx];

      if (taskCard)
        return {
          id: taskCard.id,
          taskCard: taskCard,
          groupId: group.id,
          idx: idx,
        };
    }

    return null;
  };
}

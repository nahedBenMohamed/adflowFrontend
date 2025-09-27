import { shallowEqual, type Nullable } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { TaskBoardFilterDto } from '../api';
import type { TaskBoardFilter } from '../shared';

export class TasksFilterStore {
  entityId: Nullable<number>;
  filter: TaskBoardFilter = {};

  isCalendarInitialFilterSet = false;

  constructor(entityId: Nullable<number> = null) {
    this.entityId = entityId;

    makeAutoObservable(this);
  }

  get filterDto(): TaskBoardFilterDto {
    const dto = TaskBoardFilterDto.fromModel(this.filter);

    if (this.entityId) return { ...dto, entityIds: [this.entityId] };

    return dto;
  }

  get isFilterSet(): boolean {
    return !shallowEqual({ obj1: { ...this.filter }, obj2: {} });
  }

  setFilter = (filter: TaskBoardFilter): void => {
    this.filter = filter;
  };

  markCalendarFilterAsInitiallySet = (): void => {
    this.isCalendarInitialFilterSet = true;
  };

  unmarkCalendarFilterAsInitiallySet = (): void => {
    this.isCalendarInitialFilterSet = false;
  };
}

export const tasksFilterStore = new TasksFilterStore();

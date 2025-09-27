import type { Nullable, StageCode } from '@/shared';
import { makeAutoObservable } from 'mobx';
import type { UserTimeAllocation } from '../../../../api';
import type { DeadlineType } from '../DeadlineType';
import type { BaseTask } from './BaseTask';

export class TaskGroup {
  id: number;
  name: string;
  tasks: BaseTask[];
  code: Nullable<DeadlineType | StageCode>;
  count: number;
  timeAllocation?: UserTimeAllocation[];
  titleColor?: string;
  dropForbidden?: boolean;
  private loadMoreFn: (offset?: number) => void;

  constructor({
    id,
    name,
    tasks,
    code,
    count,
    titleColor,
    timeAllocation,
    dropForbidden,
    loadMoreFn,
  }: {
    id: number;
    name: string;
    tasks: BaseTask[];
    code: Nullable<DeadlineType | StageCode>;
    count: number;
    timeAllocation?: UserTimeAllocation[];
    titleColor?: string;
    dropForbidden?: boolean;
    loadMoreFn: (offset?: number) => void;
  }) {
    this.id = id;
    this.name = name;
    this.tasks = tasks;
    this.code = code;
    this.count = count;
    this.timeAllocation = timeAllocation;
    this.titleColor = titleColor;
    this.dropForbidden = dropForbidden;
    this.loadMoreFn = loadMoreFn;

    makeAutoObservable(this);
  }

  loadMore = (): void => {
    if (this.tasks.length < this.count) this.loadMoreFn(this.tasks.length);
  };
}

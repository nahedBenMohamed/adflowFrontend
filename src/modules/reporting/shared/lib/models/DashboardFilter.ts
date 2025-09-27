import type { EntityCreatedAtFilter, Nullable } from '@/shared';
import type { AutoUpdateMode } from './AutoUpdateMode';

export class DashboardFilter {
  users?: Nullable<number[]>;
  boards?: Nullable<number[]>;
  datePeriodModel?: EntityCreatedAtFilter;
  autoUpdateMode?: AutoUpdateMode;

  constructor({ users, boards, datePeriodModel, autoUpdateMode }: DashboardFilter) {
    this.users = users;
    this.boards = boards;
    this.datePeriodModel = datePeriodModel;
    this.autoUpdateMode = autoUpdateMode;
  }
}

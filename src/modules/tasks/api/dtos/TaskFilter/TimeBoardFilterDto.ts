import type { EntityCreatedAtFilter, Nullable } from '@/shared';
import type { TaskSorting, TimeBoardFilter } from '../../../shared';
import type { DeadlineType } from '../../../shared/lib/models/DeadlineType';
import { BaseTaskBoardFilterDto } from './BaseTaskBoardFilterDto';

export class TimeBoardFilterDto extends BaseTaskBoardFilterDto {
  groups?: Nullable<DeadlineType[]>;

  constructor({
    sorting,
    search,
    showResolved,
    ownerIds,
    createdBy,
    entityIds,
    createdAt,
    startDate,
    endDate,
    resolvedDate,
    groups,
  }: {
    sorting?: Nullable<TaskSorting>;
    search?: Nullable<string>;
    showResolved?: Nullable<boolean>;
    ownerIds?: Nullable<number[]>;
    createdBy?: Nullable<number[]>;
    entityIds?: Nullable<number[]>;
    createdAt?: EntityCreatedAtFilter;
    startDate?: EntityCreatedAtFilter;
    endDate?: EntityCreatedAtFilter;
    resolvedDate?: EntityCreatedAtFilter;
    groups?: Nullable<DeadlineType[]>;
  }) {
    super({
      sorting,
      search,
      showResolved,
      ownerIds,
      createdBy,
      entityIds,
      createdAt,
      startDate,
      endDate,
      resolvedDate,
    });

    this.groups = groups;
  }

  static fromModel(model: TimeBoardFilter): TimeBoardFilterDto {
    return new TimeBoardFilterDto({
      sorting: model.sorting,
      search: model.search,
      showResolved: model.showResolved,
      ownerIds: model.ownerIds,
      createdBy: model.createdBy,
      entityIds:
        model.entityInfos && model.entityInfos.length
          ? model.entityInfos.map(ei => ei.id)
          : undefined,
      createdAt: model.createdAt,
      startDate: model.startDate,
      endDate: model.endDate,
      resolvedDate: model.resolvedDate,
      groups: model.groups,
    });
  }
}

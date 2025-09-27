import type { EntityCreatedAtFilter, Nullable } from '@/shared';
import type { ActivityCardsFilter, TaskSorting } from '../../../shared';
import { BaseTaskBoardFilterDto } from './BaseTaskBoardFilterDto';

export class ActivityCardsFilterDto extends BaseTaskBoardFilterDto {
  typeIds?: Nullable<number[]>;

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
    typeIds,
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
    typeIds?: Nullable<number[]>;
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

    this.typeIds = typeIds;
  }

  static fromModel(model: ActivityCardsFilter): ActivityCardsFilterDto {
    return new ActivityCardsFilterDto({
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
      typeIds: model.typeIds,
    });
  }
}

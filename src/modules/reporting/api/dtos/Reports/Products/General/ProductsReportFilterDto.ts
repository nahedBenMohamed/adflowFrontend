import type { Nullable } from '@/shared';
import type { ProductsReportType, ReportStageType } from '../../../../../shared';
import type { DatePeriodFilter } from '../../../DatePeriodFilter';

export class ProductsReportFilterDto {
  type: ProductsReportType;
  entityTypeId?: number;
  productsSectionId?: number;
  boardIds?: Nullable<number[]>;
  userIds?: Nullable<number[]>;
  warehouseIds?: Nullable<number[]>;
  categoryIds?: Nullable<number[]>;
  stageType?: Nullable<ReportStageType>;
  period?: Nullable<DatePeriodFilter>;

  constructor({
    type,
    entityTypeId,
    productsSectionId,
    boardIds,
    userIds,
    warehouseIds,
    categoryIds,
    stageType,
    period,
  }: ProductsReportFilterDto) {
    this.type = type;
    this.entityTypeId = entityTypeId;
    this.productsSectionId = productsSectionId;
    this.boardIds = boardIds;
    this.userIds = userIds;
    this.warehouseIds = warehouseIds;
    this.categoryIds = categoryIds;
    this.stageType = stageType;
    this.period = period;
  }
}

import type { EntitySummaryReport, EntitySummaryValue } from '../../../api';

export class EntitiesReport {
  total: EntitySummaryValue;
  win: EntitySummaryValue;
  lost: EntitySummaryValue;
  new: EntitySummaryValue;

  constructor(
    total: EntitySummaryValue,
    win: EntitySummaryValue,
    lost: EntitySummaryValue,
    newEntity: EntitySummaryValue
  ) {
    this.total = total;
    this.win = win;
    this.lost = lost;
    this.new = newEntity;
  }

  static fromDto(dto: EntitySummaryReport): EntitiesReport {
    return new EntitiesReport(dto.total, dto.win, dto.lost, dto.new);
  }
}

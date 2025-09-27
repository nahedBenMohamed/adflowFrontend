import type { EntitySummaryValue } from '../../dtos';

export interface EntitySummaryReport {
  total: EntitySummaryValue;
  win: EntitySummaryValue;
  lost: EntitySummaryValue;
  new: EntitySummaryValue;
}

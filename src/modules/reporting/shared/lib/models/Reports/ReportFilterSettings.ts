import type { Nullable } from '@/shared';
import type { PossibleReportFilterDto } from '../../../../api';
import type { PossibleReportType } from './PossibleReportType';

export interface ReportFilterSettings<
  T extends PossibleReportType,
  F extends PossibleReportFilterDto,
> {
  id: number;
  reportType: T;
  columnVisibility: Record<string, boolean>;
  filter?: F;
  extraId?: number | string;
  updatedAt?: Nullable<string>;
}

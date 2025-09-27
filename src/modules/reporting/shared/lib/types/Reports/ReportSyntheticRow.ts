import type { ProductCategory } from '@/modules/products';
import type { Department } from '@/modules/settings';
import type { User } from '@/shared';
import type { ReportRowType } from '../ReportRowType';

export type ReportSyntheticRow<R> = {
  originalRow: R;
  type: ReportRowType;
  subRows?: ReportSyntheticRow<R>[];
  originalObject?: User | Department | ProductCategory | string;
};

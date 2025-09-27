import type { Nullable } from '@/shared';
import type { StringFilterType } from './StringFilterType';

export interface StringFilter {
  type: StringFilterType;
  text?: Nullable<string>;
}

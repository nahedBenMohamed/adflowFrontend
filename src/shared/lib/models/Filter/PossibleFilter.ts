import type { BooleanFilter } from './BooleanFilter';
import type { DateFilter } from './DateFilter';
import type { ExistsFilter } from './ExistsFilter';
import type { NumberFilter } from './NumberFilter';
import type { SelectFilter } from './SelectFilter';
import type { StringFilter } from './StringFilter';

export type PossibleFilter =
  | BooleanFilter
  | DateFilter
  | NumberFilter
  | SelectFilter
  | StringFilter
  | ExistsFilter;

import type { BooleanFilterFormData } from './BooleanFilterFormData';
import type { DateFilterFormData } from './DateFilterFormData';
import type { ExistsFilterFormData } from './ExistsFilterFormData';
import type { NumberFilterFormData } from './NumberFilterFormData';
import type { SelectFilterFormData } from './SelectFilterFormData';
import type { StringFilterFormData } from './StringFilterFormData';

export type PossibleFilterFormData =
  | BooleanFilterFormData
  | DateFilterFormData
  | NumberFilterFormData
  | SelectFilterFormData
  | StringFilterFormData
  | ExistsFilterFormData;

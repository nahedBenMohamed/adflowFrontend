import type { MySelectOptionValueType, Optional } from '@/shared';
import { EntitySorting } from '../../models';

export const getEntitiesFinalSortingValue = (
  value: MySelectOptionValueType
): Optional<EntitySorting> => {
  if (value === EntitySorting.MANUAL) return;

  return value as EntitySorting;
};

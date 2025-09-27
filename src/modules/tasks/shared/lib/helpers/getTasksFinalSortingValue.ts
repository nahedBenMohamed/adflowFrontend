import type { MySelectOptionValueType, Optional } from '@/shared';
import { TaskSorting } from '../models';

export const getTasksFinalSortingValue = (
  value: MySelectOptionValueType
): Optional<TaskSorting> => {
  if (value === TaskSorting.MANUAL) return;

  return value as TaskSorting;
};

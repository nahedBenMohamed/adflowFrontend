import type { Option } from '@/shared';
import type { TFunction } from 'i18next';
import { TaskSorting } from '../models';

export const getTasksSortingOptions = (t: TFunction): Option<TaskSorting>[] => [
  {
    value: TaskSorting.MANUAL,
    label: t('sorting_options.manual'),
  },
  {
    value: TaskSorting.CREATED_ASC,
    label: t('sorting_options.created_asc'),
  },
  {
    value: TaskSorting.CREATED_DESC,
    label: t('sorting_options.created_desc'),
  },
];

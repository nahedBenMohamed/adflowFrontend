import type { Option } from '@/shared';
import type { TFunction } from 'i18next';
import { EntitySorting } from '../../models';

export const getEntitiesSortingOptions = (t: TFunction): Option<EntitySorting>[] => [
  {
    value: EntitySorting.MANUAL,
    label: t('sorting_options.manual'),
  },
  {
    value: EntitySorting.CREATED_ASC,
    label: t('sorting_options.created_asc'),
  },
  {
    value: EntitySorting.CREATED_DESC,
    label: t('sorting_options.created_desc'),
  },
  {
    value: EntitySorting.NAME_ASC,
    label: t('sorting_options.name_asc'),
  },
  {
    value: EntitySorting.NAME_DESC,
    label: t('sorting_options.name_desc'),
  },
];

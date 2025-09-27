import { RentalIntervalType } from '@/modules/products';
import type { Option } from '@/shared';
import type { TFunction } from 'i18next';

export const generateRentalIntervalTypeOptions = (t: TFunction): Option<RentalIntervalType>[] => [
  {
    label: t('twenty_four_hours'),
    value: RentalIntervalType.DAY,
  },
];

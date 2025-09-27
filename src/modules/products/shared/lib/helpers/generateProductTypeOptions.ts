import type { Option } from '@/shared';
import type { TFunction } from 'i18next';
import { ProductType } from '../models';

export const generateProductTypeOptions = (t: TFunction): Option<ProductType>[] => [
  {
    value: ProductType.PRODUCT,
    label: t('types.product'),
  },
  {
    value: ProductType.SERVICE,
    label: t('types.service'),
  },
];

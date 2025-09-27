import { Currency, type Option } from '@/shared';
import type { TFunction } from 'i18next';

export const getCurrenciesOptions = (t: TFunction): Option<Currency>[] =>
  Object.values(Currency).map(c => ({
    value: c,
    label: t(`currencies.${c}`),
  }));

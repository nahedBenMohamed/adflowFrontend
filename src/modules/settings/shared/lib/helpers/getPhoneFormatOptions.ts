import type { Option } from '@/shared';
import { PhoneFormat } from '@/shared';
import type { TFunction } from 'i18next';

export const getPhoneFormatOptions = (t: TFunction): Option<PhoneFormat>[] =>
  Object.values(PhoneFormat).map(phoneFormat => ({
    value: phoneFormat,
    label: t(phoneFormat),
  }));

import { FieldType, type Option } from '@/shared';
import type { TFunction } from 'i18next';

export const getFieldTypes = ({
  t,
  omittedFieldTypes,
}: {
  t: TFunction;
  omittedFieldTypes: FieldType[];
}): Option<FieldType>[] =>
  Object.values(FieldType)
    .filter(ft => !omittedFieldTypes.includes(ft))
    .map<Option<FieldType>>(ft => ({
      label: t(ft),
      value: ft,
    }));

import { FieldCode, type Field } from '@/modules/fields';
import type { TFunction } from 'i18next';

export const getFieldName = ({ field, t }: { field: Field; t: TFunction }): string => {
  switch (field.code) {
    case FieldCode.DESCRIPTION:
      return t('description');

    case FieldCode.END_DATE:
      return t('end_date');

    case FieldCode.START_DATE:
      return t('start_date');

    case FieldCode.PARTICIPANTS:
      return t('participants');

    case FieldCode.VALUE:
      return t('value');

    default:
      return field.name;
  }
};

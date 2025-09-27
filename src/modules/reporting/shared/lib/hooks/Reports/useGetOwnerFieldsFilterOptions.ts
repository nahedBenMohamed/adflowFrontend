import { FieldType, type EntityType, type Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const OWNER_FIELDS_RESPONSIBLE_VALUE = 'responsible';

export const useGetOwnerFieldsFilterOptions = (entityType: EntityType) => {
  const { t } = useTranslation('common');

  return useMemo<Option<typeof OWNER_FIELDS_RESPONSIBLE_VALUE | number>[]>(() => {
    if (entityType.fields.some(f => f.type === FieldType.PARTICIPANT))
      return [
        {
          label: t('responsible'),
          // this value is used for UI purposes only, we need to send null to backend if it's responsible option
          value: OWNER_FIELDS_RESPONSIBLE_VALUE,
        },
        ...entityType.fields
          .filter(f => f.type === FieldType.PARTICIPANT)
          .map<Option<number>>(f => ({
            label: f.name,
            value: f.id,
          })),
      ];

    return [];
  }, [entityType, t]);
};

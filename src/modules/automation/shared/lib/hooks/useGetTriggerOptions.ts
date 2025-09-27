import { EntityTypeTrigger, type Option } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useGetTriggerOptions = (isListAutomation?: boolean): Option<EntityTypeTrigger>[] => {
  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.trigger_select',
  });

  return useMemo<Option<EntityTypeTrigger>[]>(
    () =>
      isListAutomation
        ? [
            {
              value: EntityTypeTrigger.CREATE,
              label: t('when_creating_list'),
            },
            {
              value: EntityTypeTrigger.CHANGE_OWNER,
              label: t('when_responsible_changes'),
            },
          ]
        : [
            {
              value: EntityTypeTrigger.CHANGE_STAGE,
              label: t('at_the_transition'),
            },
            {
              value: EntityTypeTrigger.CREATE,
              label: t('when_creating'),
            },
            {
              value: EntityTypeTrigger.CHANGE_OWNER,
              label: t('when_responsible_changes'),
            },
          ],
    [isListAutomation, t]
  );
};

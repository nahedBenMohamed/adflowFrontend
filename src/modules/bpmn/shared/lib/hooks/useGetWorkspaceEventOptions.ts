import { EntityTypeTrigger, type Option } from '@/shared';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type WorkspaceEventOption = Option<EntityTypeTrigger, { color: string }>;

export const useGetWorkspaceEventOptions = (
  isListEntityType: boolean
): {
  options: WorkspaceEventOption[];
  getEventNameByEntityTypeTrigger: (entityTypeTrigger: EntityTypeTrigger) => string;
} => {
  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.hooks.use_get_workspace_event_options',
  });

  const getEventNameByEntityTypeTrigger = useCallback(
    (entityTypeTrigger: EntityTypeTrigger) => t(`events.${entityTypeTrigger}`),
    [t]
  );

  const options = useMemo<WorkspaceEventOption[]>(() => {
    const result = [
      {
        value: EntityTypeTrigger.CREATE,
        label: getEventNameByEntityTypeTrigger(EntityTypeTrigger.CREATE),
        extra: {
          color: 'var(--primary-statuses-red-360)',
        },
      },
    ];

    if (!isListEntityType)
      result.push({
        value: EntityTypeTrigger.CHANGE_STAGE,
        label: getEventNameByEntityTypeTrigger(EntityTypeTrigger.CHANGE_STAGE),
        extra: {
          color: 'var(--primary-statuses-yellow-400)',
        },
      });

    result.push({
      value: EntityTypeTrigger.CHANGE_OWNER,
      label: getEventNameByEntityTypeTrigger(EntityTypeTrigger.CHANGE_OWNER),
      extra: {
        color: 'var(--primary-statuses-orange-440)',
      },
    });

    return result;
  }, [getEventNameByEntityTypeTrigger, isListEntityType]);

  return { options, getEventNameByEntityTypeTrigger };
};

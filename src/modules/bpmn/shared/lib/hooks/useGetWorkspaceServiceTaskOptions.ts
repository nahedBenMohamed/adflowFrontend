import { EntityTypeActionType, type Option } from '@/shared';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type WorkspaceServiceTaskOption = Option<EntityTypeActionType, { color: string }>;

export const useGetWorkspaceServiceTaskOptions = (
  isListEntityType: boolean
): {
  options: WorkspaceServiceTaskOption[];
  getServiceTaskNameByEntityTypeActionType: (actionType: EntityTypeActionType) => string;
} => {
  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.hooks.use_get_service_task_options',
  });

  const getServiceTaskNameByEntityTypeActionType = useCallback(
    (actionType: EntityTypeActionType) => t(`actions.${actionType}`),
    [t]
  );

  const options = useMemo<WorkspaceServiceTaskOption[]>(() => {
    const result = [
      {
        value: EntityTypeActionType.TASK_CREATE,
        label: getServiceTaskNameByEntityTypeActionType(EntityTypeActionType.TASK_CREATE),
        extra: {
          color: 'var(--primary-statuses-malachite-480)',
        },
      },
      {
        value: EntityTypeActionType.ACTIVITY_CREATE,
        label: getServiceTaskNameByEntityTypeActionType(EntityTypeActionType.ACTIVITY_CREATE),
        extra: {
          color: 'var(--primary-statuses-aquamarine-480)',
        },
      },
    ];

    if (!isListEntityType)
      result.push({
        value: EntityTypeActionType.ENTITY_STAGE_CHANGE,
        label: getServiceTaskNameByEntityTypeActionType(EntityTypeActionType.ENTITY_STAGE_CHANGE),
        extra: {
          color: 'var(--primary-statuses-turquoise-520)',
        },
      });

    result.push(
      ...[
        {
          value: EntityTypeActionType.ENTITY_LINKED_STAGE_CHANGE,
          label: getServiceTaskNameByEntityTypeActionType(
            EntityTypeActionType.ENTITY_LINKED_STAGE_CHANGE
          ),
          extra: {
            color: 'var(--primary-statuses-turquoise-520)',
          },
        },
        {
          value: EntityTypeActionType.ENTITY_RESPONSIBLE_CHANGE,
          label: getServiceTaskNameByEntityTypeActionType(
            EntityTypeActionType.ENTITY_RESPONSIBLE_CHANGE
          ),
          extra: {
            color: 'var(--primary-statuses-fuchsia-400)',
          },
        },
        {
          value: EntityTypeActionType.EMAIL_SEND,
          label: getServiceTaskNameByEntityTypeActionType(EntityTypeActionType.EMAIL_SEND),
          extra: {
            color: 'var(--primary-statuses-noun-440)',
          },
        },
        {
          value: EntityTypeActionType.ENTITY_CREATE,
          label: getServiceTaskNameByEntityTypeActionType(EntityTypeActionType.ENTITY_CREATE),
          extra: {
            color: 'var(--primary-statuses-blue-360)',
          },
        },
        {
          value: EntityTypeActionType.CHAT_SEND_AMWORK,
          label: getServiceTaskNameByEntityTypeActionType(EntityTypeActionType.CHAT_SEND_AMWORK),
          extra: {
            color: 'var(--primary-statuses-purple-360)',
          },
        },
        {
          value: EntityTypeActionType.CHAT_SEND_EXTERNAL,
          label: getServiceTaskNameByEntityTypeActionType(EntityTypeActionType.CHAT_SEND_EXTERNAL),
          extra: {
            color: 'var(--secondary-orange-240)',
          },
        },
        {
          value: EntityTypeActionType.HTTP_CALL,
          label: getServiceTaskNameByEntityTypeActionType(EntityTypeActionType.HTTP_CALL),
          extra: {
            color: 'var(--secondary-red-240)',
          },
        },
      ]
    );

    return result;
  }, [getServiceTaskNameByEntityTypeActionType, isListEntityType]);

  return {
    options,
    getServiceTaskNameByEntityTypeActionType,
  };
};

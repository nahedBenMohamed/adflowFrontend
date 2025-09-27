import { LinkIcon } from '@/modules/fields';
import { EntityTypeActionType, MultichatTabIcon } from '@/shared';
import { ActivityIcon, ChangeStageIcon, CreateEntityIcon, MailIcon, TaskIcon } from '../../assets';
import { ActionTypeEntityTypeInfo } from '../models';

export const getActionTypeEntityTypeInfos = (
  isListAutomation?: boolean
): ActionTypeEntityTypeInfo[] => {
  const automationTypes = [
    new ActionTypeEntityTypeInfo({ type: EntityTypeActionType.TASK_CREATE, icon: <TaskIcon /> }),
    new ActionTypeEntityTypeInfo({
      type: EntityTypeActionType.ACTIVITY_CREATE,
      icon: <ActivityIcon />,
    }),
  ];

  if (!isListAutomation)
    automationTypes.push(
      new ActionTypeEntityTypeInfo({
        type: EntityTypeActionType.ENTITY_STAGE_CHANGE,
        icon: <ChangeStageIcon />,
      })
    );

  automationTypes.push(
    ...[
      new ActionTypeEntityTypeInfo({
        type: EntityTypeActionType.ENTITY_LINKED_STAGE_CHANGE,
        icon: <ChangeStageIcon />,
      }),
      new ActionTypeEntityTypeInfo({
        type: EntityTypeActionType.ENTITY_RESPONSIBLE_CHANGE,
        icon: <ChangeStageIcon />,
      }),
      new ActionTypeEntityTypeInfo({
        type: EntityTypeActionType.ENTITY_CREATE,
        icon: <CreateEntityIcon />,
      }),
      new ActionTypeEntityTypeInfo({ type: EntityTypeActionType.EMAIL_SEND, icon: <MailIcon /> }),
      new ActionTypeEntityTypeInfo({
        type: EntityTypeActionType.CHAT_SEND_AMWORK,
        icon: <MultichatTabIcon />,
      }),
      new ActionTypeEntityTypeInfo({
        type: EntityTypeActionType.CHAT_SEND_EXTERNAL,
        icon: <MultichatTabIcon />,
      }),
      new ActionTypeEntityTypeInfo({
        type: EntityTypeActionType.HTTP_CALL,
        icon: <LinkIcon />,
      }),
    ]
  );

  return automationTypes;
};

import { EntityTypeActionType } from '@/shared';
import { AutomationProcessInputTargetType } from '../models';

export const getServiceTaskZeebeInputTargetByEntityTypeActionType = (
  type: EntityTypeActionType
): AutomationProcessInputTargetType => {
  switch (type) {
    case EntityTypeActionType.TASK_CREATE:
      return AutomationProcessInputTargetType.TASK;

    case EntityTypeActionType.ACTIVITY_CREATE:
      return AutomationProcessInputTargetType.ACTIVITY;

    case EntityTypeActionType.EMAIL_SEND:
      return AutomationProcessInputTargetType.EMAIL;

    case EntityTypeActionType.ENTITY_CREATE:
      return AutomationProcessInputTargetType.ENTITY;

    case EntityTypeActionType.ENTITY_STAGE_CHANGE:
      return AutomationProcessInputTargetType.ENTITY;

    case EntityTypeActionType.ENTITY_LINKED_STAGE_CHANGE:
      return AutomationProcessInputTargetType.ENTITY;

    case EntityTypeActionType.ENTITY_RESPONSIBLE_CHANGE:
      return AutomationProcessInputTargetType.ENTITY;

    case EntityTypeActionType.CHAT_SEND_AMWORK:
      return AutomationProcessInputTargetType.CHAT;

    case EntityTypeActionType.CHAT_SEND_EXTERNAL:
      return AutomationProcessInputTargetType.CHAT;

    case EntityTypeActionType.HTTP_CALL:
      return AutomationProcessInputTargetType.ENTITY;
  }
};

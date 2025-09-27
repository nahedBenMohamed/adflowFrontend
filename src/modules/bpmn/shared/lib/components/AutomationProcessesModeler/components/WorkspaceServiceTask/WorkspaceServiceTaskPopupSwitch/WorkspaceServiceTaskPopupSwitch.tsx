import { EntityTypeActionType } from '@/shared';
import type BpmnModeler from 'bpmn-js/lib/Modeler';
import { getBusinessObject, type Element } from 'bpmn-js/lib/util/ModelUtil';
import { memo, useMemo } from 'react';
import type { CommonServiceTaskPopupProps } from '../../../../../models';
import { ServiceTaskAddActivityPopup } from '../ServiceTaskAddActivityPopup/ServiceTaskAddActivityPopup';
import { ServiceTaskAddTaskPopup } from '../ServiceTaskAddTaskPopup/ServiceTaskAddTaskPopup';
import { ServiceTaskChangeLinkedStagePopup } from '../ServiceTaskChangeLinkedStagePopup/ServiceTaskChangeLinkedStagePopup';
import { ServiceTaskChangeResponsiblePopup } from '../ServiceTaskChangeResponsiblePopup/ServiceTaskChangeResponsiblePopup';
import { ServiceTaskChangeStagePopup } from '../ServiceTaskChangeStagePopup/ServiceTaskChangeStagePopup';
import { ServiceTaskCreateEntityPopup } from '../ServiceTaskCreateEntityPopup/ServiceTaskCreateEntityPopup';
import { ServiceTaskRequestHttpPopup } from '../ServiceTaskRequestHttpPopup/ServiceTaskRequestHttpPopup';
import { ServiceTaskSendEmailPopup } from '../ServiceTaskSendEmailPopup/ServiceTaskSendEmailPopup';
import { ServiceTaskSendExternalChatPopup } from '../ServiceTaskSendExternalChatPopup/ServiceTaskSendExternalChatPopup';
import { ServiceTaskSendInternalChatPopup } from '../ServiceTaskSendInternalChatPopup/ServiceTaskSendInternalChatPopup';

interface Props {
  isOpened: boolean;
  modeler: BpmnModeler;
  entityTypeId: number;
  isListEntityType: boolean;
  selectedWorkspaceServiceTaskId: string;
  onClose: () => void;
  handleGetElementFromRegistry: (id: string) => Element;
}

const WorkspaceServiceTaskPopupSwitch = memo((props: Props) => {
  const {
    isOpened,
    modeler,
    entityTypeId,
    isListEntityType,
    selectedWorkspaceServiceTaskId,
    onClose,
    handleGetElementFromRegistry,
  } = props;

  const serviceTaskElement = useMemo<Element>(
    () => handleGetElementFromRegistry(selectedWorkspaceServiceTaskId),
    [selectedWorkspaceServiceTaskId, handleGetElementFromRegistry]
  );
  const businessObject = getBusinessObject(serviceTaskElement);

  const commonProps = useMemo<CommonServiceTaskPopupProps>(
    () => ({
      modeler,
      isOpened,
      entityTypeId,
      isListEntityType,
      businessObject,
      serviceTaskElement,
      onClose,
    }),
    [modeler, isOpened, entityTypeId, businessObject, isListEntityType, serviceTaskElement, onClose]
  );

  switch (businessObject.entityTypeActionType) {
    case EntityTypeActionType.TASK_CREATE:
      return <ServiceTaskAddTaskPopup {...commonProps} />;

    case EntityTypeActionType.ACTIVITY_CREATE:
      return <ServiceTaskAddActivityPopup {...commonProps} />;

    case EntityTypeActionType.ENTITY_STAGE_CHANGE:
      return <ServiceTaskChangeStagePopup {...commonProps} />;

    case EntityTypeActionType.ENTITY_LINKED_STAGE_CHANGE:
      return <ServiceTaskChangeLinkedStagePopup {...commonProps} />;

    case EntityTypeActionType.ENTITY_RESPONSIBLE_CHANGE:
      return <ServiceTaskChangeResponsiblePopup {...commonProps} />;

    case EntityTypeActionType.EMAIL_SEND:
      return <ServiceTaskSendEmailPopup {...commonProps} />;

    case EntityTypeActionType.ENTITY_CREATE:
      return <ServiceTaskCreateEntityPopup {...commonProps} />;

    case EntityTypeActionType.CHAT_SEND_EXTERNAL:
      return <ServiceTaskSendExternalChatPopup {...commonProps} />;

    case EntityTypeActionType.CHAT_SEND_AMWORK:
      return <ServiceTaskSendInternalChatPopup {...commonProps} />;

    case EntityTypeActionType.HTTP_CALL:
      return <ServiceTaskRequestHttpPopup {...commonProps} />;

    default:
      return null;
  }
});

WorkspaceServiceTaskPopupSwitch.displayName = 'WorkspaceServiceTaskPopupSwitch';
export { WorkspaceServiceTaskPopupSwitch };

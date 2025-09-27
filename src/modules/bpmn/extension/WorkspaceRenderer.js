import { EntityTypeActionType, EntityTypeTrigger } from '@/shared';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { checkIfCanAddConditionToFlow } from '../shared';

const HIGHEST_RENDER_PRIORITY = 1500;

export class WorkspaceRenderer extends BaseRenderer {
  constructor(eventBus, bpmnRenderer) {
    super(eventBus, HIGHEST_RENDER_PRIORITY);
    this.bpmnRenderer = bpmnRenderer;
  }

  canRender(element) {
    // Skip labels
    return !element.labelTarget;
  }

  drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);
    const {
      isWorkspaceEvent,
      isWorkspaceServiceTask,
      isWorkspaceDelay,
      entityTypeTrigger,
      entityTypeActionType,
    } = getBusinessObject(element);

    this.customToggleClasses(parentNode, {
      'workspace__WorkspaceRenderer--Delay': isWorkspaceDelay,

      'workspace__WorkspaceRenderer--Event': isWorkspaceEvent,
      workspace__Create: isWorkspaceEvent && entityTypeTrigger === EntityTypeTrigger.CREATE,
      workspace__ChangeOwner:
        isWorkspaceEvent && entityTypeTrigger === EntityTypeTrigger.CHANGE_OWNER,
      workspace__ChangeStage:
        isWorkspaceEvent && entityTypeTrigger === EntityTypeTrigger.CHANGE_STAGE,

      'workspace__WorkspaceRenderer--ServiceTask': isWorkspaceServiceTask,
      workspace__CreateTask:
        isWorkspaceServiceTask && entityTypeActionType === EntityTypeActionType.TASK_CREATE,
      workspace__CreateActivity:
        isWorkspaceServiceTask && entityTypeActionType === EntityTypeActionType.ACTIVITY_CREATE,
      workspace__ChatSendAmwork:
        isWorkspaceServiceTask && entityTypeActionType === EntityTypeActionType.CHAT_SEND_AMWORK,
      workspace__ChatSendExternal:
        isWorkspaceServiceTask && entityTypeActionType === EntityTypeActionType.CHAT_SEND_EXTERNAL,
      workspace__SendEmail:
        isWorkspaceServiceTask && entityTypeActionType === EntityTypeActionType.EMAIL_SEND,
      workspace__EntityStageChange:
        isWorkspaceServiceTask && entityTypeActionType === EntityTypeActionType.ENTITY_STAGE_CHANGE,
      workspace__EntityLinkedStageChange:
        isWorkspaceServiceTask &&
        entityTypeActionType === EntityTypeActionType.ENTITY_LINKED_STAGE_CHANGE,
      workspace__EntityResponsibleChange:
        isWorkspaceServiceTask &&
        entityTypeActionType === EntityTypeActionType.ENTITY_RESPONSIBLE_CHANGE,
      workspace__EntityCreate:
        isWorkspaceServiceTask && entityTypeActionType === EntityTypeActionType.ENTITY_CREATE,
      workspace__HttpCall:
        isWorkspaceServiceTask && entityTypeActionType === EntityTypeActionType.HTTP_CALL,
    });

    return shape;
  }

  drawConnection(parentNode, element) {
    const businessObject = getBusinessObject(element);

    const canAddConditionToFlow = checkIfCanAddConditionToFlow(element);

    this.customToggleClasses(parentNode, {
      'workspace__WorkspaceRenderer--SequenceFlow__PossibleCondition':
        canAddConditionToFlow && !businessObject.isWorkspaceSequenceFlow,
      'workspace__WorkspaceRenderer--SequenceFlow__WithCondition':
        businessObject.isWorkspaceSequenceFlow,
    });

    return this.bpmnRenderer.drawConnection(parentNode, element);
  }

  customToggleClasses(node, classConditions) {
    for (const [className, condition] of Object.entries(classConditions)) {
      condition ? node.classList.add(className) : node.classList.remove(className);
    }
  }
}

WorkspaceRenderer.$inject = ['eventBus', 'bpmnRenderer'];

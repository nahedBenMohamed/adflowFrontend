import { EntityTypeActionType } from '@/shared';
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { BpmnJsType, checkIfElementHasServiceTasksInContextPad } from '../shared';

export class WorkspaceContextPadProvider {
  constructor(
    contextPad,
    modeling,
    elementFactory,
    create,
    elementRegistry,
    bpmnFactory,
    injector
  ) {
    this.modeling = modeling;
    this.elementFactory = elementFactory;
    this.create = create;
    this.elementRegistry = elementRegistry;
    this.bpmnFactory = bpmnFactory;

    if (injector && injector.get) {
      this.autoPlace = injector.get('autoPlace', false);
    }

    contextPad.registerProvider(this);
  }

  getContextPadEntries(element) {
    const businessObject = getBusinessObject(element);
    const { modeling, elementFactory, create, elementRegistry, bpmnFactory, autoPlace } = this;

    return function (entries) {
      if (
        is(businessObject, BpmnJsType.SEQUENCE_FLOW) ||
        businessObject.isWorkspaceServiceTask ||
        businessObject.isWorkspaceDelay ||
        businessObject.isWorkspaceSequenceFlow ||
        businessObject.isWorkspaceEvent
      ) {
        delete entries['set-color'];
      }

      if (
        businessObject.isWorkspaceEvent ||
        businessObject.isWorkspaceDelay ||
        businessObject.isWorkspaceServiceTask ||
        businessObject.isWorkspaceSequenceFlow ||
        is(businessObject, BpmnJsType.GATEWAY) ||
        is(businessObject, BpmnJsType.END_EVENT) ||
        is(businessObject, BpmnJsType.START_EVENT) ||
        is(businessObject, BpmnJsType.PARTICIPANT) ||
        is(businessObject, BpmnJsType.SEQUENCE_FLOW) ||
        is(businessObject, BpmnJsType.DATA_STORE_REFERENCE) ||
        is(businessObject, BpmnJsType.DATA_OBJECT_REFERENCE)
      ) {
        delete entries['replace'];
      }

      // Sequence flow toggle default functionality
      if (
        is(businessObject, BpmnJsType.SEQUENCE_FLOW) &&
        is(businessObject.sourceRef, BpmnJsType.GATEWAY)
      ) {
        const sourceElement = elementRegistry.get(businessObject.sourceRef.id);
        const isDefault = sourceElement.businessObject.default === businessObject;

        entries['toggle-default'] = {
          group: 'model',
          className: `${isDefault ? 'bpmn-icon-connection-multi' : 'bpmn-icon-default-flow'} workspace toggle-default`,
          action: {
            click: function () {
              const newDefault = isDefault ? null : businessObject;

              modeling.updateProperties(sourceElement, { default: newDefault });
            },
          },
        };
      }

      // Make append gateway entry have another more specific class name for exclusive gateway (if it exists)
      if (entries['append.gateway'])
        entries['append.gateway'] = {
          ...entries['append.gateway'],
          className: 'entry bpmn-icon-gateway-xor workspace',
        };

      if (checkIfElementHasServiceTasksInContextPad(businessObject)) {
        function appendCustomServiceTask(actionType) {
          return function (event, element) {
            if (autoPlace) {
              const businessObject = bpmnFactory.create(BpmnJsType.SERVICE_TASK, {
                isWorkspaceServiceTask: true,
                entityTypeActionType: actionType,
              });

              const shape = elementFactory.createShape({
                type: BpmnJsType.SERVICE_TASK,
                businessObject: businessObject,
              });

              autoPlace.append(element, shape);
            } else {
              appendCustomServiceTaskStart(actionType)(event, element);
            }
          };
        }

        function appendCustomServiceTaskStart(actionType) {
          return function (event) {
            const businessObject = bpmnFactory.create(BpmnJsType.SERVICE_TASK, {
              isWorkspaceServiceTask: true,
              entityTypeActionType: actionType,
            });

            const shape = elementFactory.createShape({
              type: BpmnJsType.SERVICE_TASK,
              businessObject: businessObject,
            });

            create.start(event, shape, {
              source: element,
              connectionType: BpmnJsType.SEQUENCE_FLOW,
            });
          };
        }

        Object.values(EntityTypeActionType).forEach(actionType => {
          entries[`workspace.add-${actionType}`] = {
            group: 'model',
            className: `bpmn-icon-service-task workspace__WorkspaceRenderer--ServiceTask ${this.getClassForActionType(actionType)} context-pad-entry`,
            action: {
              click: appendCustomServiceTask(actionType),
              dragstart: appendCustomServiceTaskStart(actionType),
            },
          };
        });

        // Show delay logic in the context is the same...
        function createDelayShape() {
          const businessObject = bpmnFactory.create(BpmnJsType.INTERMEDIATE_CATCH_EVENT);

          businessObject.name = '';
          businessObject.delay = 0;
          businessObject.isWorkspaceDelay = true;

          const timerEventDefinition = bpmnFactory.create(BpmnJsType.TIMER_EVENT_DEFINITION);

          const timeDuration = bpmnFactory.create(BpmnJsType.FORMAL_EXPRESSION, {
            body: '=PT0S',
          });

          timerEventDefinition.timeDuration = timeDuration;
          businessObject.eventDefinitions = [timerEventDefinition];

          return elementFactory.createShape({
            type: BpmnJsType.INTERMEDIATE_CATCH_EVENT,
            businessObject: businessObject,
          });
        }

        function appendCustomDelay() {
          return function (event, element) {
            if (autoPlace) {
              const shape = createDelayShape();

              autoPlace.append(element, shape);
            } else {
              appendCustomServiceTaskStart()(event, element);
            }
          };
        }

        function appendCustomDelayStart() {
          return function (event) {
            const shape = createDelayShape();

            create.start(event, shape, {
              source: element,
              connectionType: BpmnJsType.SEQUENCE_FLOW,
            });
          };
        }

        entries['workspace.add-delay'] = {
          group: 'model',
          className:
            'bpmn-icon-intermediate-event-catch-timer workspace__WorkspaceRenderer--Delay workspace__CreateDelay  context-pad-entry',
          action: {
            click: appendCustomDelay(),
            dragstart: appendCustomDelayStart(),
          },
        };
      }

      return entries;
    }.bind(this);
  }

  getClassForActionType(actionType) {
    const classes = {
      [EntityTypeActionType.TASK_CREATE]: 'workspace__CreateTask',
      [EntityTypeActionType.ACTIVITY_CREATE]: 'workspace__CreateActivity',
      [EntityTypeActionType.ENTITY_STAGE_CHANGE]: 'workspace__EntityStageChange',
      [EntityTypeActionType.ENTITY_LINKED_STAGE_CHANGE]: 'workspace__EntityLinkedStageChange',
      [EntityTypeActionType.ENTITY_RESPONSIBLE_CHANGE]: 'workspace__EntityResponsibleChange',
      [EntityTypeActionType.EMAIL_SEND]: 'workspace__SendEmail',
      [EntityTypeActionType.ENTITY_CREATE]: 'workspace__EntityCreate',
      [EntityTypeActionType.CHAT_SEND_AMWORK]: 'workspace__ChatSendAmwork',
      [EntityTypeActionType.CHAT_SEND_EXTERNAL]: 'workspace__ChatSendExternal',
      [EntityTypeActionType.HTTP_CALL]: 'workspace__HttpCall',
    };

    return classes[actionType] || '';
  }
}

WorkspaceContextPadProvider.$inject = [
  'contextPad',
  'modeling',
  'elementFactory',
  'create',
  'elementRegistry',
  'bpmnFactory',
  'injector',
];

import {
  BpmnJsType,
  TOGGLE_CREATE_WORKSPACE_SERVICE_TASK_MENU_EVENT,
  TOGGLE_CREATE_WORKSPACE_START_EVENT_MENU_EVENT,
} from '../shared';

export class WorkspacePalette {
  constructor(bpmnFactory, create, elementFactory, palette, eventBus) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.eventBus = eventBus;

    palette.registerProvider(this);
  }

  getPaletteEntries() {
    const { bpmnFactory, create, elementFactory } = this;

    function createWorkspaceDelayEvent(event) {
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

      const shape = elementFactory.createShape({
        type: BpmnJsType.INTERMEDIATE_CATCH_EVENT,
        businessObject: businessObject,
      });

      create.start(event, shape);
    }

    function createExclusiveGateway(event) {
      const businessObject = bpmnFactory.create(BpmnJsType.EXCLUSIVE_GATEWAY);

      const shape = elementFactory.createShape({
        type: BpmnJsType.EXCLUSIVE_GATEWAY,
        businessObject: businessObject,
      });

      create.start(event, shape);
    }

    function createParallelGateway(event) {
      const businessObject = bpmnFactory.create(BpmnJsType.PARALLEL_GATEWAY);

      const shape = elementFactory.createShape({
        type: BpmnJsType.PARALLEL_GATEWAY,
        businessObject: businessObject,
      });

      create.start(event, shape);
    }

    return {
      delimiter: {
        group: 'workspace',
        separator: true,
      },
      'create.workspace_event': {
        group: 'workspace',
        className: 'bpmn-icon-start-event-message workspace',
        action: {
          click: () => this.eventBus.fire(TOGGLE_CREATE_WORKSPACE_START_EVENT_MENU_EVENT),
        },
      },
      'create.workspace_service_task': {
        group: 'workspace',
        className: 'bpmn-icon-service-task workspace',
        action: {
          click: () => this.eventBus.fire(TOGGLE_CREATE_WORKSPACE_SERVICE_TASK_MENU_EVENT),
        },
      },
      'create.workspace_delay': {
        group: 'workspace',
        className: 'bpmn-icon-intermediate-event-catch-timer workspace',
        action: {
          click: createWorkspaceDelayEvent,
          dragstart: createWorkspaceDelayEvent,
        },
      },
      'create.exclusive_gateway': {
        group: 'gateway',
        className: 'bpmn-icon-gateway-xor workspace',
        action: {
          click: createExclusiveGateway,
          dragstart: createExclusiveGateway,
        },
      },
      'create.parallel_gateway': {
        group: 'gateway',
        className: 'bpmn-icon-gateway-parallel workspace',
        action: {
          click: createParallelGateway,
          dragstart: createParallelGateway,
        },
      },
    };
  }
}

WorkspacePalette.$inject = ['bpmnFactory', 'create', 'elementFactory', 'palette', 'eventBus'];

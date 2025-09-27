export enum BpmnJsType {
  PROCESS = 'bpmn:Process',
  PARTICIPANT = 'bpmn:Participant',

  // Flow Elements
  SEQUENCE_FLOW = 'bpmn:SequenceFlow',

  // Activities
  SERVICE_TASK = 'bpmn:ServiceTask',

  // Gateways
  GATEWAY = 'bpmn:Gateway',
  EXCLUSIVE_GATEWAY = 'bpmn:ExclusiveGateway',
  PARALLEL_GATEWAY = 'bpmn:ParallelGateway',
  INCLUSIVE_GATEWAY = 'bpmn:InclusiveGateway',
  COMPLEX_GATEWAY = 'bpmn:ComplexGateway',
  EVENT_BASED_GATEWAY = 'bpmn:EventBasedGateway',

  // Events
  END_EVENT = 'bpmn:EndEvent',
  START_EVENT = 'bpmn:StartEvent',
  INTERMEDIATE_CATCH_EVENT = 'bpmn:IntermediateCatchEvent',
  TIMER_EVENT_DEFINITION = 'bpmn:TimerEventDefinition',

  // Data
  DATA_STORE_REFERENCE = 'bpmn:DataStoreReference',
  DATA_OBJECT_REFERENCE = 'bpmn:DataObjectReference',

  // Message
  MESSAGE = 'bpmn:Message',
  MESSAGE_EVENT_DEFINITION = 'bpmn:MessageEventDefinition',

  // Other Elements
  FORMAL_EXPRESSION = 'bpmn:FormalExpression',
  EXTENSION_ELEMENTS = 'bpmn:ExtensionElements',
}

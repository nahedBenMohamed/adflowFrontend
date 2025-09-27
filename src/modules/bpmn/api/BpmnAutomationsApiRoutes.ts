export enum BpmnAutomationsApiRoutes {
  // automation processes
  GET_AUTOMATION_PROCESSES = '/api/automation/processes',
  GET_AUTOMATION_PROCESS = '/api/automation/processes/:processId',
  CREATE_AUTOMATION_PROCESS = '/api/automation/processes',
  UPDATE_AUTOMATION_PROCESS = '/api/automation/processes/:processId',
  DELETE_AUTOMATION_PROCESS = '/api/automation/processes/:processId',
  // utils
  GET_DELAY = '/api/automation/util/delay',
  GENERATE_FEEL_FOR_AUTOMATION_ENTITY_CONDITION = '/api/automation/util/conditions/entity',
}

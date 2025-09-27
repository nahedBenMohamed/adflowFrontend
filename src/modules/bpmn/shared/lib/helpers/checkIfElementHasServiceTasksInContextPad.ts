import type { Element } from 'bpmn-js/lib/features/modeling/ElementFactory';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { BpmnJsType } from '../models';

export const checkIfElementHasServiceTasksInContextPad = (
  businessObject: Element['businessObject']
): boolean =>
  is(businessObject, BpmnJsType.GATEWAY) ||
  is(businessObject, BpmnJsType.INTERMEDIATE_CATCH_EVENT) ||
  is(businessObject, BpmnJsType.START_EVENT) ||
  businessObject.isWorkspaceServiceTask;

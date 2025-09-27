import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import type { ElementLike } from 'diagram-js/lib/core/ElementRegistry';
import type { ConnectionLike } from 'diagram-js/lib/model/Types';
import { BpmnAutomationsUtil } from '../utils';

export const checkIfCanAddConditionToFlow = (element: ElementLike): boolean => {
  const sourceElement = element.source;

  const businessObject = getBusinessObject(element);
  const sourceBusinessObject = getBusinessObject(sourceElement);

  if (!sourceBusinessObject || !sourceBusinessObject.outgoing) return false;

  const isDefaultFlow =
    (sourceBusinessObject.default && sourceBusinessObject.default.id === businessObject.id) ||
    false;

  // Check if source is a Gateway (any type) and if the element is part of the outgoing array
  const isSourceGateway = BpmnAutomationsUtil.gatewaysTypes.has(sourceBusinessObject.$type);
  // Check if flow is outgoing from a Gateway, we can only add custom conditions to outgoing from Gateway flows
  const isOutgoingFromGatewayFlow =
    (isSourceGateway &&
      sourceBusinessObject.outgoing.find((o: ConnectionLike) => o.id === businessObject.id)) ||
    false;

  return isOutgoingFromGatewayFlow && !isDefaultFlow;
};

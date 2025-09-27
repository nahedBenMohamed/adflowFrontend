import type BpmnModeler from 'bpmn-js/lib/Modeler';
import { type Element } from 'bpmn-js/lib/util/ModelUtil';

export interface CommonServiceTaskPopupProps {
  isOpened: boolean;
  modeler: BpmnModeler;
  entityTypeId: number;
  isListEntityType: boolean;
  serviceTaskElement: Element;
  businessObject: Element['businessObject'];
  onClose: () => void;
}

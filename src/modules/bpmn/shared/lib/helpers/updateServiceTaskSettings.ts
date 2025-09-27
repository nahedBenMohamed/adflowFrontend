import type { EntityTypeActionType } from '@/shared';
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling';
import type BpmnModeler from 'bpmn-js/lib/Modeler';
import type { Element } from 'bpmn-js/lib/util/ModelUtil';
import { BpmnJsType, ZeebeType, type AutomationProcessInputTargetType } from '../models';

export const updateServiceTaskSettingsZeebe = <T extends object>({
  name,
  element,
  modeler,
  settings,
  inputTargetType,
  entityTypeActionType,
}: {
  settings: T;
  name: string;
  element: Element;
  modeler: BpmnModeler;
  entityTypeActionType: EntityTypeActionType;
  inputTargetType: AutomationProcessInputTargetType;
}): void => {
  const modeling = modeler.get<Modeling>('modeling');
  const bpmnFactory = modeler.get<BpmnFactory>('bpmnFactory');

  const input = `=${JSON.stringify(settings)}`;

  const taskDefinition = bpmnFactory.create(ZeebeType.TASK_DEFINITION, {
    type: entityTypeActionType,
  });

  const zeebeInput = bpmnFactory.create(ZeebeType.INPUT, {
    source: input,
    target: inputTargetType,
  });

  const ioMapping = bpmnFactory.create(ZeebeType.IO_MAPPING, {
    inputParameters: [zeebeInput],
  });
  const extensionElements = bpmnFactory.create(BpmnJsType.EXTENSION_ELEMENTS, {
    values: [taskDefinition, ioMapping],
  });

  modeling.updateProperties(element, {
    name,
    entityTypeActionType,
    extensionElements: extensionElements,
  });
};

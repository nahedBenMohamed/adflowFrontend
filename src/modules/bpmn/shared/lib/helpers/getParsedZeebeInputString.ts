import type { Nullable } from '@/shared';
import type { Element } from 'bpmn-js/lib/features/modeling/ElementFactory';
import { ZeebeType } from '../models';

export const getParsedZeebeInput = <T>(businessObject: Element['businessObject']): Nullable<T> => {
  if (businessObject?.extensionElements?.values)
    for (const elem of businessObject.extensionElements.values) {
      if (elem.$type === ZeebeType.IO_MAPPING)
        if (elem.inputParameters && elem.inputParameters.length > 0)
          return (JSON.parse(elem.inputParameters[0].source.slice(1)) as T) || null;
    }

  return null;
};

import { BpmnJsType } from '../models';

export class BpmnAutomationsUtil {
  static gatewaysTypes: Set<string> = new Set([
    BpmnJsType.EXCLUSIVE_GATEWAY,
    BpmnJsType.INCLUSIVE_GATEWAY,
    BpmnJsType.PARALLEL_GATEWAY,
    BpmnJsType.COMPLEX_GATEWAY,
    BpmnJsType.EVENT_BASED_GATEWAY,
  ]);
}

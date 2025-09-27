import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { BpmnJsType } from '../shared';

// Fix bpmn:Process#isExecutable to always be set to true
// Fork of https://github.com/bpmn-io/bpmn-js-executable-fix/blob/main/src/ExecutableFix.js
export function executableFix(eventBus) {
  function fixIfProcess(element) {
    // exclude labels
    if (element.labelTarget) {
      return;
    }

    var bo = getBusinessObject(element);

    if (is(bo, BpmnJsType.PARTICIPANT)) {
      bo = bo.processRef;
    }

    if (is(bo, BpmnJsType.PROCESS)) {
      bo.isExecutable = true;
    }
  }

  eventBus.on(['shape.added', 'root.added'], function (event) {
    fixIfProcess(event.element);
  });

  eventBus.on('elements.changed', function (event) {
    var elements = event.elements;

    elements.forEach(function (element) {
      fixIfProcess(element);
    });
  });
}

executableFix.$inject = ['eventBus'];

import { useGetAutomationDelayOptions } from '@/modules/automation';
import { DelaySelect, InputModel, MyInput, type Nullable } from '@/shared';
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling';
import type BpmnModeler from 'bpmn-js/lib/Modeler';
import { getBusinessObject, type Element } from 'bpmn-js/lib/util/ModelUtil';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { automationUtilsApi } from '../../../../../../api';
import { BpmnJsType } from '../../../../models';
import { PopupFormItem } from '../PopupFormItem/PopupFormItem';
import { PopupHeaderIcon } from '../PopupHeaderIcon/PopupHeaderIcon';
import { ProcessElementPopup } from '../ProcessElementPopup/ProcessElementPopup';

interface Props {
  isOpened: boolean;
  modeler: BpmnModeler;
  selectedWorkspaceDelayEventId: string;
  onClose: () => void;
  handleGetElementFromRegistry: (id: string) => Element;
}

interface InitialForm {
  name: InputModel;
  delay: Nullable<number>;
}

const WorkspaceDelayEventPopup = observer((props: Props) => {
  const {
    isOpened,
    modeler,
    selectedWorkspaceDelayEventId,
    onClose,
    handleGetElementFromRegistry,
  } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.workspace_delay_event_popup',
  });

  const modeling = useMemo(() => modeler.get<Modeling>('modeling'), [modeler]);
  const bpmnFactory = useMemo(() => modeler.get<BpmnFactory>('bpmnFactory'), [modeler]);

  const [isDelayUpdating, setIsDelayUpdating] = useState(false);

  const delayElement = useMemo(
    () => handleGetElementFromRegistry(selectedWorkspaceDelayEventId),
    [handleGetElementFromRegistry, selectedWorkspaceDelayEventId]
  );
  const businessObject = getBusinessObject(delayElement);

  const form = useLocalObservable<InitialForm>(() => ({
    name: InputModel.create(businessObject.name),
    delay: businessObject.delay ? Number(businessObject.delay) : null,
  }));

  const handleChangeDelay = useCallback((delay: Nullable<number>) => (form.delay = delay), [form]);

  const handleSave = useCallback(async (): Promise<void> => {
    if (!delayElement) return;

    try {
      setIsDelayUpdating(true);

      const timerEventDefinition = bpmnFactory.create(BpmnJsType.TIMER_EVENT_DEFINITION);

      const timeDuration = bpmnFactory.create(BpmnJsType.FORMAL_EXPRESSION, {
        // there will be a backend methods which will make this expression for seconds – ISO 8601 (duration)=
        // https://docs.camunda.io/docs/components/modeler/bpmn/timer-events/
        body: await automationUtilsApi.getDelay(form.delay ?? 0),
      });

      timerEventDefinition.timeDuration = timeDuration;

      modeling.updateProperties(delayElement, {
        delay: form.delay,
        name: form.name.trimmedValue,
        eventDefinitions: [timerEventDefinition],
      });

      onClose();
    } catch (e) {
      throw new Error(`Failed to update delay for event ${delayElement.id}: ${e}`);
    } finally {
      setIsDelayUpdating(false);
    }
  }, [delayElement, modeling, bpmnFactory, form, onClose]);

  const delayOptions = useGetAutomationDelayOptions();

  return (
    <ProcessElementPopup
      title={t('delay')}
      isOpened={isOpened}
      isSaving={isDelayUpdating}
      Icon={<PopupHeaderIcon className="bpmn-icon-intermediate-event-catch-timer" />}
      handleCancel={onClose}
      handleSave={handleSave}
    >
      <PopupFormItem text={t('delay_name')}>
        <MyInput variant="outlined" model={form.name} placeholder={t('placeholders.delay_name')} />
      </PopupFormItem>

      <PopupFormItem text={t('delay_label')}>
        <DelaySelect
          delay={form.delay}
          options={delayOptions}
          variant="outlined-without-active-shadow"
          onChange={handleChangeDelay}
        />
      </PopupFormItem>
    </ProcessElementPopup>
  );
});

WorkspaceDelayEventPopup.displayName = 'WorkspaceDelayEventPopup';
export { WorkspaceDelayEventPopup };

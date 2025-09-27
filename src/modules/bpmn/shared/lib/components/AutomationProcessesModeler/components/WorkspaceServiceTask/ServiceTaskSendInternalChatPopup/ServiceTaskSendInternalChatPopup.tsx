import type {
  ActionChatSendAmworkSettings,
  SendInternalChatAutomationModalContentForm,
} from '@/modules/automation';
import { SendInternalChatAutomationModalContent } from '@/modules/automation';
import { InputModel, MultiselectModel, SelectModel, validateForm, type Nullable } from '@/shared';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import {
  getParsedZeebeInput,
  getServiceTaskZeebeInputTargetByEntityTypeActionType,
  updateServiceTaskSettingsZeebe,
} from '../../../../../helpers';
import type { CommonServiceTaskPopupProps } from '../../../../../models';
import { ServiceTaskPopupTemplate } from '../ServiceTaskPopupTemplate/ServiceTaskPopupTemplate';

const ServiceTaskSendInternalChatPopup = observer((props: CommonServiceTaskPopupProps) => {
  const {
    isOpened,
    modeler,
    entityTypeId,
    serviceTaskElement,
    businessObject,
    isListEntityType,
    onClose,
  } = props;

  const settingsFromZeebeInput = useMemo<Nullable<ActionChatSendAmworkSettings>>(
    () => getParsedZeebeInput<ActionChatSendAmworkSettings>(businessObject),
    [businessObject]
  );

  const name = useLocalObservable<InputModel>(() => InputModel.create(businessObject.name));
  const form = useLocalObservable<SendInternalChatAutomationModalContentForm>(() => ({
    message: InputModel.create(settingsFromZeebeInput?.message).required(),
    userId: SelectModel.create(settingsFromZeebeInput?.userId ?? null),
    sendTo: MultiselectModel.create(settingsFromZeebeInput?.sendTo ?? [-1]).required(),
  }));

  const handleUpdateServiceTask = useCallback(() => {
    if (!serviceTaskElement || !validateForm(form)) return;

    const businessObject = getBusinessObject(serviceTaskElement);

    const actionType = businessObject.entityTypeActionType;
    const sendInternalChatActionSettings: ActionChatSendAmworkSettings = {
      userId: form.userId.value,
      sendTo:
        !form.sendTo.values.length || form.sendTo.values[0] === -1 ? null : form.sendTo.values,
      message: form.message.trimmedValue,
    };

    updateServiceTaskSettingsZeebe({
      modeler,
      name: name.trimmedValue,
      element: serviceTaskElement,
      entityTypeActionType: actionType,
      settings: sendInternalChatActionSettings,
      inputTargetType: getServiceTaskZeebeInputTargetByEntityTypeActionType(actionType),
    });

    onClose();
  }, [form, name, modeler, serviceTaskElement, onClose]);

  return (
    <ServiceTaskPopupTemplate
      name={name}
      isOpened={isOpened}
      isListEntityType={isListEntityType}
      entityTypeActionType={businessObject.entityTypeActionType}
      onClose={onClose}
      onSave={handleUpdateServiceTask}
    >
      <SendInternalChatAutomationModalContent entityTypeId={entityTypeId} form={form} />
    </ServiceTaskPopupTemplate>
  );
});

ServiceTaskSendInternalChatPopup.displayName = 'ServiceTaskSendInternalChatPopup';
export { ServiceTaskSendInternalChatPopup };

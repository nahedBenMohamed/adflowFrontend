import {
  getSendExternalChatActionSettings,
  SendExternalChatAutomationModalContent,
  useInitializeSendExternalChatForm,
  type ActionChatSendSettings,
} from '@/modules/automation';
import { InputModel, validateForm, type Nullable } from '@/shared';
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

const ServiceTaskSendExternalChatPopup = observer((props: CommonServiceTaskPopupProps) => {
  const {
    isOpened,
    modeler,
    entityTypeId,
    serviceTaskElement,
    businessObject,
    isListEntityType,
    onClose,
  } = props;

  const settingsFromZeebeInput = useMemo<Nullable<ActionChatSendSettings>>(
    () => getParsedZeebeInput<ActionChatSendSettings>(businessObject),
    [businessObject]
  );

  const name = useLocalObservable<InputModel>(() => InputModel.create(businessObject.name));
  const form = useInitializeSendExternalChatForm(settingsFromZeebeInput);

  const handleUpdateServiceTask = useCallback(() => {
    if (!validateForm(form) || !serviceTaskElement) return;

    const businessObject = getBusinessObject(serviceTaskElement);

    const actionType = businessObject.entityTypeActionType;

    const sendExternalChatActionSettings = getSendExternalChatActionSettings(form);

    if (!sendExternalChatActionSettings) return;

    updateServiceTaskSettingsZeebe({
      modeler,
      name: name.trimmedValue,
      element: serviceTaskElement,
      entityTypeActionType: actionType,
      settings: sendExternalChatActionSettings,
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
      <SendExternalChatAutomationModalContent entityTypeId={entityTypeId} form={form} />
    </ServiceTaskPopupTemplate>
  );
});

ServiceTaskSendExternalChatPopup.displayName = 'ServiceTaskSendExternalChatPopup';
export { ServiceTaskSendExternalChatPopup };

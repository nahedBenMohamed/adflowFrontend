import {
  getSendEmailActionSettings,
  SendEmailAutomationModalContent,
  useInitializeSendEmailActionSettingsForm,
  type ActionEmailSendSettings,
} from '@/modules/automation';
import { MailboxStore, type MailboxSignature } from '@/modules/mailing';
import { InputModel, validateForm, type Nullable } from '@/shared';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getParsedZeebeInput,
  getServiceTaskZeebeInputTargetByEntityTypeActionType,
  updateServiceTaskSettingsZeebe,
} from '../../../../../helpers';
import type { CommonServiceTaskPopupProps } from '../../../../../models';
import { ServiceTaskPopupTemplate } from '../ServiceTaskPopupTemplate/ServiceTaskPopupTemplate';

const ServiceTaskSendEmailPopup = observer((props: CommonServiceTaskPopupProps) => {
  const {
    isOpened,
    modeler,
    entityTypeId,
    serviceTaskElement,
    businessObject,
    isListEntityType,
    onClose,
  } = props;

  const settingsFromZeebeInput = useMemo<Nullable<ActionEmailSendSettings>>(
    () => getParsedZeebeInput<ActionEmailSendSettings>(businessObject),
    [businessObject]
  );

  const [signatures, setSignatures] = useState<MailboxSignature[]>([]);

  const { areSignaturesLoading, loadMailboxSignatures } = useMemo(() => new MailboxStore(), []);

  const name = useLocalObservable<InputModel>(() => InputModel.create(businessObject.name));
  const form = useInitializeSendEmailActionSettingsForm(settingsFromZeebeInput);

  useEffect(() => {
    const loadSignatures = async (): Promise<void> => {
      if (!form.mailboxId.value) return;

      const signatures = await loadMailboxSignatures(form.mailboxId.value);

      setSignatures(signatures);
    };

    loadSignatures();
  }, [form.mailboxId.value, loadMailboxSignatures]);

  const handleUpdateServiceTask = useCallback(() => {
    if (!validateForm(form) || !serviceTaskElement) return;

    const businessObject = getBusinessObject(serviceTaskElement);

    const actionType = businessObject.entityTypeActionType;

    const sendEmailActionSettings = getSendEmailActionSettings(form);

    if (!sendEmailActionSettings) return;

    updateServiceTaskSettingsZeebe({
      modeler,
      name: name.trimmedValue,
      element: serviceTaskElement,
      entityTypeActionType: actionType,
      settings: sendEmailActionSettings,
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
      <SendEmailAutomationModalContent
        form={form}
        signatures={signatures}
        entityTypeId={entityTypeId}
        areSignaturesLoading={areSignaturesLoading}
      />
    </ServiceTaskPopupTemplate>
  );
});

ServiceTaskSendEmailPopup.displayName = 'ServiceTaskSendEmailPopup';
export { ServiceTaskSendEmailPopup };

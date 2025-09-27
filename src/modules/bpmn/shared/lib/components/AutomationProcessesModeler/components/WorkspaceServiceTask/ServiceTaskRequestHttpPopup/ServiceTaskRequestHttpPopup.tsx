import type { RequestHttpAutomationModalContentForm } from '@/modules/automation';
import {
  type ActionHttpCallSettings,
  RequestHttpAutomationModalContent,
} from '@/modules/automation';
import {
  HttpMethod,
  InputModel,
  KeyValueListModel,
  type Nullable,
  SelectModel,
  validateForm,
} from '@/shared';
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

const ServiceTaskRequestHttpPopup = observer((props: CommonServiceTaskPopupProps) => {
  const {
    isOpened,
    modeler,
    serviceTaskElement,
    entityTypeId,
    businessObject,
    isListEntityType,
    onClose,
  } = props;

  const settingsFromZeebeInput = useMemo<Nullable<ActionHttpCallSettings>>(
    () => getParsedZeebeInput<ActionHttpCallSettings>(businessObject),
    [businessObject]
  );

  const name = useLocalObservable<InputModel>(() => InputModel.create(businessObject.name));

  const form = useLocalObservable<RequestHttpAutomationModalContentForm>(() => ({
    url: InputModel.create(settingsFromZeebeInput?.url).httpUrl().required(),
    method: SelectModel.create(settingsFromZeebeInput?.method ?? HttpMethod.POST).required(),
    headers: KeyValueListModel.createFromObject(settingsFromZeebeInput?.headers).httpHeaderFormat(),
    params: KeyValueListModel.createFromObject(
      settingsFromZeebeInput?.params
    ).printableAsciiFormat(),
  }));

  const handleUpdateServiceTask = useCallback(() => {
    if (!validateForm(form) || !serviceTaskElement) return;

    const businessObject = getBusinessObject(serviceTaskElement);

    const actionType = businessObject.entityTypeActionType;

    const requestHttpActionSettings: ActionHttpCallSettings = {
      url: form.url.value,
      method: form.method.value,
      headers: form.headers.toObject(),
      params: form.params.toObject(),
    };

    updateServiceTaskSettingsZeebe({
      modeler,
      name: name.trimmedValue,
      element: serviceTaskElement,
      entityTypeActionType: actionType,
      settings: requestHttpActionSettings,
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
      <RequestHttpAutomationModalContent form={form} entityTypeId={entityTypeId} />
    </ServiceTaskPopupTemplate>
  );
});

ServiceTaskRequestHttpPopup.displayName = 'ServiceTaskRequestHttpPopup';
export { ServiceTaskRequestHttpPopup };

import type {
  ActionEntityCreateSettings,
  CreateEntityAutomationModalContentForm,
} from '@/modules/automation';
import { CreateEntityAutomationModalContent } from '@/modules/automation';
import { InputModel, SelectModel, validateForm, type Nullable } from '@/shared';
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

interface Props extends CommonServiceTaskPopupProps {
  entityTypeId: number;
}

const ServiceTaskCreateEntityPopup = observer((props: Props) => {
  const {
    entityTypeId,
    isOpened,
    modeler,
    serviceTaskElement,
    businessObject,
    isListEntityType,
    onClose,
  } = props;

  const settingsFromZeebeInput = useMemo<Nullable<ActionEntityCreateSettings>>(
    () => getParsedZeebeInput<ActionEntityCreateSettings>(businessObject),
    [businessObject]
  );

  const name = useLocalObservable<InputModel>(() => InputModel.create(businessObject.name));
  const form = useLocalObservable<CreateEntityAutomationModalContentForm>(() => ({
    entityTypeId: SelectModel.create(settingsFromZeebeInput?.entityTypeId).required(),
    boardId: SelectModel.create(settingsFromZeebeInput?.boardId),
    stageId: SelectModel.create(settingsFromZeebeInput?.stageId),
    ownerId: SelectModel.create(settingsFromZeebeInput?.ownerId ?? null),
    name: InputModel.create(settingsFromZeebeInput?.name),
  }));

  const handleUpdateServiceTask = useCallback(() => {
    if (!serviceTaskElement || !validateForm(form)) return;

    const businessObject = getBusinessObject(serviceTaskElement);

    const actionType = businessObject.entityTypeActionType;
    const createLinkedEntityActionSettings: ActionEntityCreateSettings = {
      entityTypeId: form.entityTypeId.value,
      boardId: form.boardId.value,
      stageId: form.stageId.value,
      ownerId: form.ownerId.value,
      name: form.name.trimmedValue,
    };

    updateServiceTaskSettingsZeebe({
      modeler,
      name: name.trimmedValue,
      element: serviceTaskElement,
      entityTypeActionType: actionType,
      settings: createLinkedEntityActionSettings,
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
      <CreateEntityAutomationModalContent form={form} entityTypeId={entityTypeId} />
    </ServiceTaskPopupTemplate>
  );
});

ServiceTaskCreateEntityPopup.displayName = 'ServiceTaskCreateEntityPopup';
export { ServiceTaskCreateEntityPopup };

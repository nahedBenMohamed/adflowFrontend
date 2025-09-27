import {
  ChangeLinkedStageAutomationModalContent,
  type ActionEntityLinkedStageChangeSettings,
  type ChangeLinkedStageAutomationModalContentForm,
} from '@/modules/automation';
import { ChangeStageType, InputModel, SelectModel, validateForm, type Nullable } from '@/shared';
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

const ServiceTaskChangeLinkedStagePopup = observer((props: CommonServiceTaskPopupProps) => {
  const {
    isOpened,
    modeler,
    entityTypeId,
    serviceTaskElement,
    businessObject,
    isListEntityType,
    onClose,
  } = props;

  const settingsFromZeebeInput = useMemo<Nullable<ActionEntityLinkedStageChangeSettings>>(
    () => getParsedZeebeInput<ActionEntityLinkedStageChangeSettings>(businessObject),
    [businessObject]
  );

  const name = useLocalObservable<InputModel>(() => InputModel.create(businessObject.name));
  const form = useLocalObservable<ChangeLinkedStageAutomationModalContentForm>(() => ({
    stageId: SelectModel.create(settingsFromZeebeInput?.stageId).required(),
    entityTypeId: SelectModel.create(settingsFromZeebeInput?.entityTypeId).required(),
    operationType: InputModel.create(
      settingsFromZeebeInput?.operationType ?? ChangeStageType.MOVE
    ).required(),
  }));

  const handleUpdateServiceTask = useCallback(() => {
    if (!serviceTaskElement || !validateForm(form)) return;

    const businessObject = getBusinessObject(serviceTaskElement);

    const actionType = businessObject.entityTypeActionType;
    const changeStageActionSettings: ActionEntityLinkedStageChangeSettings = {
      stageId: form.stageId.value,
      entityTypeId: form.entityTypeId.value,
      operationType: form.operationType.value as ChangeStageType,
    };

    updateServiceTaskSettingsZeebe({
      modeler,
      name: name.trimmedValue,
      element: serviceTaskElement,
      entityTypeActionType: actionType,
      settings: changeStageActionSettings,
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
      <ChangeLinkedStageAutomationModalContent entityTypeId={entityTypeId} form={form} />
    </ServiceTaskPopupTemplate>
  );
});

ServiceTaskChangeLinkedStagePopup.displayName = 'ServiceTaskChangeLinkedStagePopup';
export { ServiceTaskChangeLinkedStagePopup };

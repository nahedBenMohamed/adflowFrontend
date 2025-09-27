import {
  ChangeStageAutomationModalContent,
  type ActionEntityStageChangeSettings,
  type ChangeStageAutomationModalContentForm,
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

interface Props extends CommonServiceTaskPopupProps {
  entityTypeId: number;
}

const ServiceTaskChangeStagePopup = observer((props: Props) => {
  const {
    isOpened,
    modeler,
    entityTypeId,
    serviceTaskElement,
    businessObject,
    isListEntityType,
    onClose,
  } = props;

  const settingsFromZeebeInput = useMemo<Nullable<ActionEntityStageChangeSettings>>(
    () => getParsedZeebeInput<ActionEntityStageChangeSettings>(businessObject),
    [businessObject]
  );

  const name = useLocalObservable<InputModel>(() => InputModel.create(businessObject.name));
  const form = useLocalObservable<ChangeStageAutomationModalContentForm>(() => ({
    stageId: SelectModel.create(settingsFromZeebeInput?.stageId).required(),
    operationType: InputModel.create(
      settingsFromZeebeInput?.operationType ?? ChangeStageType.MOVE
    ).required(),
  }));

  const handleUpdateServiceTask = useCallback(() => {
    if (!serviceTaskElement || !validateForm(form)) return;

    const businessObject = getBusinessObject(serviceTaskElement);

    const actionType = businessObject.entityTypeActionType;
    const changeStageActionSettings: ActionEntityStageChangeSettings = {
      stageId: form.stageId.value,
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
      <ChangeStageAutomationModalContent entityTypeId={entityTypeId} form={form} />
    </ServiceTaskPopupTemplate>
  );
});

ServiceTaskChangeStagePopup.displayName = 'ServiceTaskChangeStagePopup';
export { ServiceTaskChangeStagePopup };

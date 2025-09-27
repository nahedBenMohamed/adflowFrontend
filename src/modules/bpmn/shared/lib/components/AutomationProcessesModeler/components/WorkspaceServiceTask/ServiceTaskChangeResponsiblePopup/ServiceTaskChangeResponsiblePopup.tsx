import type { ChangeResponsibleAutomationModalContentForm } from '@/modules/automation';
import {
  ChangeResponsibleAutomationModalContent,
  type ActionEntityResponsibleChangeSettings,
} from '@/modules/automation';
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

const ServiceTaskChangeResponsiblePopup = observer((props: CommonServiceTaskPopupProps) => {
  const { isOpened, modeler, serviceTaskElement, businessObject, isListEntityType, onClose } =
    props;

  const settingsFromZeebeInput = useMemo<Nullable<ActionEntityResponsibleChangeSettings>>(
    () => getParsedZeebeInput<ActionEntityResponsibleChangeSettings>(businessObject),
    [businessObject]
  );

  const name = useLocalObservable<InputModel>(() => InputModel.create(businessObject.name));
  const form = useLocalObservable<ChangeResponsibleAutomationModalContentForm>(() => ({
    responsibleUserId: SelectModel.create(settingsFromZeebeInput?.responsibleUserId).required(),
  }));

  const handleUpdateServiceTask = useCallback(() => {
    if (!serviceTaskElement || !validateForm(form)) return;

    const businessObject = getBusinessObject(serviceTaskElement);

    const actionType = businessObject.entityTypeActionType;
    const changeStageActionSettings: ActionEntityResponsibleChangeSettings = {
      responsibleUserId: form.responsibleUserId.value,
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
      <ChangeResponsibleAutomationModalContent form={form} />
    </ServiceTaskPopupTemplate>
  );
});

ServiceTaskChangeResponsiblePopup.displayName = 'ServiceTaskChangeResponsiblePopup';
export { ServiceTaskChangeResponsiblePopup };

import {
  AddActivityAutomationModalContent,
  AutomationEntityTypeDeadline,
  DeadlineType,
  type ActionActivityCreateSettings,
  type AddActivityAutomationModalContentForm,
} from '@/modules/automation';
import { InputModel, NumberModel, SelectModel, validateForm, type Nullable } from '@/shared';
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

const ServiceTaskAddActivityPopup = observer((props: CommonServiceTaskPopupProps) => {
  const { isOpened, modeler, serviceTaskElement, businessObject, isListEntityType, onClose } =
    props;

  const settingsFromZeebeInput = useMemo<Nullable<ActionActivityCreateSettings>>(
    () => getParsedZeebeInput<ActionActivityCreateSettings>(businessObject),
    [businessObject]
  );

  const name = useLocalObservable<InputModel>(() => InputModel.create(businessObject.name));
  const form = useLocalObservable<AddActivityAutomationModalContentForm>(() => ({
    text: InputModel.create(settingsFromZeebeInput?.text),
    deferStart: NumberModel.create(settingsFromZeebeInput?.deferStart ?? null),
    activityTypeId: SelectModel.create(settingsFromZeebeInput?.activityTypeId).required(),
    responsibleUserId: SelectModel.create(settingsFromZeebeInput?.responsibleUserId ?? null),
    deadline: new AutomationEntityTypeDeadline({
      time: settingsFromZeebeInput?.deadlineTime ?? null,
      type: settingsFromZeebeInput?.deadlineType ?? DeadlineType.IN_ONE_DAY,
    }),
  }));

  const handleUpdateServiceTask = useCallback(() => {
    if (!serviceTaskElement || !validateForm(form)) return;

    const businessObject = getBusinessObject(serviceTaskElement);

    const actionType = businessObject.entityTypeActionType;
    const createActivityActionSettings: ActionActivityCreateSettings = {
      text: form.text.trimmedValue,
      deadlineTime: form.deadline.time,
      deadlineType: form.deadline.type,
      deferStart: form.deferStart.value,
      activityTypeId: form.activityTypeId.value,
      responsibleUserId: form.responsibleUserId.value,
    };

    updateServiceTaskSettingsZeebe({
      modeler,
      name: name.trimmedValue,
      element: serviceTaskElement,
      entityTypeActionType: actionType,
      settings: createActivityActionSettings,
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
      <AddActivityAutomationModalContent form={form} />
    </ServiceTaskPopupTemplate>
  );
});

ServiceTaskAddActivityPopup.displayName = 'ServiceTaskAddActivityPopup';
export { ServiceTaskAddActivityPopup };

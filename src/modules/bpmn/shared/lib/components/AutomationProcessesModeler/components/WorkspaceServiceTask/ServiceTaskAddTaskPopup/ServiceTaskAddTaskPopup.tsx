import {
  AddTaskAutomationModalContent,
  AutomationEntityTypeDeadline,
  DeadlineType,
  type ActionTaskCreateSettings,
  type AddTaskAutomationModalContentForm,
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

const ServiceTaskAddTaskPopup = observer((props: CommonServiceTaskPopupProps) => {
  const { isOpened, modeler, serviceTaskElement, businessObject, isListEntityType, onClose } =
    props;

  const settingsFromZeebeInput = useMemo<Nullable<ActionTaskCreateSettings>>(
    () => getParsedZeebeInput<ActionTaskCreateSettings>(businessObject),
    [businessObject]
  );

  const name = useLocalObservable<InputModel>(() => InputModel.create(businessObject.name));
  const form = useLocalObservable<AddTaskAutomationModalContentForm>(() => ({
    text: InputModel.create(settingsFromZeebeInput?.text),
    title: InputModel.create(settingsFromZeebeInput?.title).required(),
    responsibleUserId: SelectModel.create(settingsFromZeebeInput?.responsibleUserId ?? null),
    deferStart: NumberModel.create(settingsFromZeebeInput?.deferStart ?? null),
    deadline: new AutomationEntityTypeDeadline({
      time: settingsFromZeebeInput?.deadlineTime ?? null,
      type: settingsFromZeebeInput?.deadlineType ?? DeadlineType.IN_ONE_DAY,
    }),
  }));

  const handleUpdateServiceTask = useCallback(() => {
    if (!serviceTaskElement || !validateForm(form)) return;

    const businessObject = getBusinessObject(serviceTaskElement);

    const actionType = businessObject.entityTypeActionType;
    const createTaskActionSettings: ActionTaskCreateSettings = {
      text: form.text.trimmedValue,
      title: form.title.trimmedValue,
      deadlineType: form.deadline.type,
      deadlineTime: form.deadline.time,
      deferStart: form.deferStart.value,
      responsibleUserId: form.responsibleUserId.value,
    };

    updateServiceTaskSettingsZeebe({
      modeler,
      name: name.trimmedValue,
      element: serviceTaskElement,
      entityTypeActionType: actionType,
      settings: createTaskActionSettings,
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
      <AddTaskAutomationModalContent form={form} />
    </ServiceTaskPopupTemplate>
  );
});

ServiceTaskAddTaskPopup.displayName = 'ServiceTaskAddTaskPopup';
export { ServiceTaskAddTaskPopup };

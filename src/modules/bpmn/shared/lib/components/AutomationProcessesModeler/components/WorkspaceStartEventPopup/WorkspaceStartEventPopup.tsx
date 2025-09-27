import { entityTypeStore } from '@/app';
import { InputModel, MyInput, MySelect, SelectModel, validateForm } from '@/shared';
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling';
import type BpmnModeler from 'bpmn-js/lib/Modeler';
import { getBusinessObject, type Element } from 'bpmn-js/lib/util/ModelUtil';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetWorkspaceEventOptions } from '../../../../hooks';
import { EventMessageNameUtil } from '../../../../utils';
import { PopupFormItem } from '../PopupFormItem/PopupFormItem';
import { PopupHeaderIcon } from '../PopupHeaderIcon/PopupHeaderIcon';
import { ProcessElementPopup } from '../ProcessElementPopup/ProcessElementPopup';

interface Props {
  isOpened: boolean;
  modeler: BpmnModeler;
  isListEntityType: boolean;
  selectedWorkspaceStartEventId: string;
  onClose: () => void;
  handleGetElementFromRegistry: (id: string) => Element;
}

interface InitialForm {
  name: InputModel;
  entityTypeId: SelectModel;
  entityTypeTrigger: SelectModel;
}

const WorkspaceStartEventPopup = observer((props: Props) => {
  const {
    isOpened,
    modeler,
    isListEntityType,
    selectedWorkspaceStartEventId,
    onClose,
    handleGetElementFromRegistry,
  } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.workspace_start_event_popup',
  });

  const modeling = useMemo(() => modeler.get<Modeling>('modeling'), [modeler]);

  const [startEventElement, setStartEventElement] = useState(() =>
    handleGetElementFromRegistry(selectedWorkspaceStartEventId)
  );

  const businessObject = getBusinessObject(startEventElement);

  const form = useLocalObservable<InitialForm>(() => ({
    name: InputModel.create(businessObject.name),
    entityTypeTrigger: SelectModel.create(businessObject.entityTypeTrigger).required(),
    entityTypeId: SelectModel.create(
      businessObject.entityTypeId ? Number(businessObject.entityTypeId) : undefined
    ).required(),
  }));

  const handleSave = useCallback(() => {
    if (!validateForm(form)) return;

    // Event element business object
    const elementBusinessObject = getBusinessObject(startEventElement);
    const accountId = elementBusinessObject.accountId;

    if (!accountId)
      throw new Error(
        'Account id is not defined in event element, it is required to update event element'
      );

    const firstEventDefinition = elementBusinessObject.eventDefinitions?.[0];

    // Message element, identification data is stored in it's name
    const firstMessageRef = firstEventDefinition?.messageRef;

    if (firstEventDefinition && firstMessageRef) {
      firstMessageRef.name = EventMessageNameUtil.getMessageName({
        entityTypeId: form.entityTypeId.value,
        accountId: elementBusinessObject.accountId,
        entityTypeTrigger: form.entityTypeTrigger.value,
      });

      // Update event definition so that new name will be stored in XML and could be further accessed
      modeling.updateProperties(startEventElement, {
        eventDefinitions: [firstEventDefinition],
      });
    }

    // Update element business object
    modeling.updateProperties(startEventElement, {
      name: form.name.trimmedValue,
      entityTypeId: form.entityTypeId.value,
      entityTypeTrigger: form.entityTypeTrigger.value,
    });

    setStartEventElement(handleGetElementFromRegistry(selectedWorkspaceStartEventId));

    onClose();
  }, [
    form,
    modeling,
    startEventElement,
    selectedWorkspaceStartEventId,
    onClose,
    handleGetElementFromRegistry,
  ]);

  const { entityTypesOptions } = entityTypeStore;

  const { options, getEventNameByEntityTypeTrigger } =
    useGetWorkspaceEventOptions(isListEntityType);

  if (!startEventElement) return null;

  return (
    <ProcessElementPopup
      isOpened={isOpened}
      title={getEventNameByEntityTypeTrigger(form.entityTypeTrigger.value)}
      Icon={
        <PopupHeaderIcon
          className="bpmn-icon-start-event-message"
          $color={options.find(o => o.value === form.entityTypeTrigger.value)?.extra?.color}
        />
      }
      handleCancel={onClose}
      handleSave={handleSave}
    >
      <PopupFormItem text={t('event_name')}>
        <MyInput variant="outlined" model={form.name} placeholder={t('placeholders.event_name')} />
      </PopupFormItem>

      <PopupFormItem text={t('event_type')}>
        <MySelect
          withinPortal
          options={options}
          model={form.entityTypeTrigger}
          variant="outlined-without-active-shadow"
        />
      </PopupFormItem>

      <PopupFormItem text={t('module')} hint={t('module_hint')}>
        <MySelect
          withinPortal
          model={form.entityTypeId}
          options={entityTypesOptions}
          variant="outlined-without-active-shadow"
        />
      </PopupFormItem>
    </ProcessElementPopup>
  );
});

WorkspaceStartEventPopup.displayName = 'WorkspaceStartEventPopup';
export { WorkspaceStartEventPopup };

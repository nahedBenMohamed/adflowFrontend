import { entityTypeStore } from '@/app';
import {
  ConditionsBlock,
  EntityTypeConditionFormData,
  WrapperWithLeftOffset,
  type EntityTypeCondition,
} from '@/modules/automation';
import { InputModel, MyInput, MySelect, SelectModel, StagesSelect, type Nullable } from '@/shared';
import type BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';
import type Modeling from 'bpmn-js/lib/features/modeling/Modeling';
import type BpmnModeler from 'bpmn-js/lib/Modeler';
import { getBusinessObject, type Element } from 'bpmn-js/lib/util/ModelUtil';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { automationUtilsApi } from '../../../../../../api';
import { BpmnJsType, type AutomationEntityCondition } from '../../../../models';
import { PopupFormItem } from '../PopupFormItem/PopupFormItem';
import { PopupHeaderIcon } from '../PopupHeaderIcon/PopupHeaderIcon';
import { ProcessElementPopup } from '../ProcessElementPopup/ProcessElementPopup';

interface Props {
  isOpened: boolean;
  modeler: BpmnModeler;
  entityTypeId: number;
  selectedWorkspaceSequenceFlowId: string;
  onClose: () => void;
  handleGetElementFromRegistry: (id: string) => Element;
}

interface InitialForm {
  name: InputModel;
  stageId: SelectModel;
  entityTypeId: SelectModel;
  conditions: EntityTypeConditionFormData;
}

const WorkspaceSequenceFlowPopup = observer((props: Props) => {
  const {
    isOpened,
    modeler,
    entityTypeId,
    selectedWorkspaceSequenceFlowId,
    onClose,
    handleGetElementFromRegistry,
  } = props;

  const { t } = useTranslation('module.bpmn', {
    keyPrefix: 'bpmn.pages.bpmn_automations_page.workspace_sequence_flow_popup',
  });

  const { entityTypesOptions } = entityTypeStore;

  const modeling = useMemo(() => modeler.get<Modeling>('modeling'), [modeler]);
  const bpmnFactory = useMemo(() => modeler.get<BpmnFactory>('bpmnFactory'), [modeler]);

  const [isConditionUpdating, setIsConditionUpdating] = useState(false);

  const sequenceFlowElement = useMemo(
    () => handleGetElementFromRegistry(selectedWorkspaceSequenceFlowId),
    [selectedWorkspaceSequenceFlowId, handleGetElementFromRegistry]
  );

  const businessObject = useMemo(
    () => getBusinessObject(sequenceFlowElement),
    [sequenceFlowElement]
  );

  const conditions = useMemo<Nullable<EntityTypeCondition>>(() => {
    const { stringifiedConditions } = businessObject;

    if (stringifiedConditions) {
      const conditions = JSON.parse(stringifiedConditions);

      return conditions as EntityTypeCondition;
    }

    return null;
  }, [businessObject]);

  const form = useLocalObservable<InitialForm>(() => ({
    name: InputModel.create(businessObject.name),
    entityTypeId: SelectModel.create(
      businessObject.entityTypeId ? Number(businessObject.entityTypeId) : entityTypeId
    ),
    stageId: SelectModel.create(
      businessObject.stageId ? Number(businessObject.stageId) : undefined
    ),
    conditions: conditions
      ? EntityTypeConditionFormData.fromModel(conditions)
      : EntityTypeConditionFormData.empty(),
  }));

  const entityType = entityTypeStore.getById(form.entityTypeId.value);

  const handleUpdateCondition = useCallback(async (): Promise<void> => {
    if (!sequenceFlowElement) return;

    try {
      setIsConditionUpdating(true);

      const entityTypeConditions = form.conditions.toModel();

      const automationEntityCondition: AutomationEntityCondition = {
        stageId: form.stageId.value,
        fields: entityTypeConditions.fields,
        ownerIds: entityTypeConditions.ownerIds,
      };

      const conditionFeelExpression =
        await automationUtilsApi.generateFeelForAutomationEntityCondition(
          automationEntityCondition
        );
      const conditionExpression = bpmnFactory.create(BpmnJsType.FORMAL_EXPRESSION, {
        body: `=${conditionFeelExpression}`,
      });

      // Update sequence flow condition expression
      modeling.updateProperties(sequenceFlowElement, {
        conditionExpression,
        stageId: form.stageId.value,
        name: form.name.trimmedValue,
        isWorkspaceSequenceFlow: true,
        entityTypeId: form.entityTypeId.value,
        stringifiedConditions: JSON.stringify(entityTypeConditions),
      });

      onClose();
    } catch (e) {
      throw new Error(`Failed to generate FEEL expression for automation entity condition: ${e}`);
    } finally {
      setIsConditionUpdating(false);
    }
  }, [form, bpmnFactory, modeling, sequenceFlowElement, onClose]);

  const handleChangeEntityType = useCallback(() => {
    // Clear values because stage and other conditions are applicable to the specific module
    form.stageId = SelectModel.create();
    form.conditions = EntityTypeConditionFormData.empty();
  }, [form]);

  return (
    <ProcessElementPopup
      isOpened={isOpened}
      title={t('sequence_flow')}
      isSaving={isConditionUpdating}
      Icon={<PopupHeaderIcon className="bpmn-icon-connection-multi" />}
      handleCancel={onClose}
      handleSave={handleUpdateCondition}
    >
      <PopupFormItem text={t('flow_name')}>
        <MyInput model={form.name} variant="outlined" placeholder={t('placeholders.flow_name')} />
      </PopupFormItem>

      <PopupFormItem text={t('module')} hint={t('module_hint')}>
        <MySelect
          withinPortal
          model={form.entityTypeId}
          options={entityTypesOptions}
          variant="outlined-without-active-shadow"
          handleChange={handleChangeEntityType}
        />
      </PopupFormItem>

      <PopupFormItem text={t('conditions')}>
        <WrapperWithLeftOffset>
          <PopupFormItem text={t('stage')}>
            <StagesSelect
              monochrome
              withinPortal
              model={form.stageId}
              entityTypeId={form.entityTypeId.value}
              variant="outlined-without-active-shadow"
            />
          </PopupFormItem>

          <ConditionsBlock entityType={entityType} conditions={form.conditions} />
        </WrapperWithLeftOffset>
      </PopupFormItem>
    </ProcessElementPopup>
  );
});

WorkspaceSequenceFlowPopup.displayName = 'WorkspaceSequenceFlowPopup';
export { WorkspaceSequenceFlowPopup };

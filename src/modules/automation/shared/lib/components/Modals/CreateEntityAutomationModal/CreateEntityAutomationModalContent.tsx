import { boardApiUtil, entityTypeStore, userStore } from '@/app';
import {
  type InputModel,
  MyInput,
  MySelect,
  MyUsersSelect,
  type SelectModel,
  StagesSelect,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AutomationFormItem, WrapperWithLeftOffset } from '../components';

export interface CreateEntityAutomationModalContentForm {
  entityTypeId: SelectModel;
  boardId: SelectModel;
  stageId: SelectModel;
  ownerId: SelectModel;
  name: InputModel;
}

interface Props {
  entityTypeId: number;
  form: CreateEntityAutomationModalContentForm;
}

const CreateEntityAutomationModalContent = observer((props: Props) => {
  const { entityTypeId, form } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.create_entity_automation_modal',
  });

  const { data: boards } = boardApiUtil.useGetBoardsByEntityTypeId({
    entityTypeId: form.entityTypeId.value,
  });

  const entityTypesOptions = useMemo(
    () => entityTypeStore.entityTypesOptions.filter(et => et.value !== entityTypeId),
    [entityTypeId]
  );

  return (
    <AutomationFormItem text={t('create_card')}>
      <WrapperWithLeftOffset>
        <AutomationFormItem text={t('select_entity_type')} hint={t('select_entity_type_hint')}>
          <MySelect
            withinPortal
            variant="outlined"
            model={form.entityTypeId}
            options={entityTypesOptions}
            placeholder={t('placeholders.select_entity_type')}
          />
        </AutomationFormItem>

        {Boolean(boards && boards.length > 0) && (
          <AutomationFormItem text={t('select_stage')}>
            <StagesSelect
              monochrome
              withinPortal
              variant="outlined"
              model={form.stageId}
              entityTypeId={form.entityTypeId.value}
            />
          </AutomationFormItem>
        )}

        <AutomationFormItem text={t('responsible_user')} hint={t('responsible_user_hint')}>
          <MyUsersSelect
            withinPortal
            variant="outlined"
            users={userStore.activeUsers}
            model={form.ownerId}
            emptyUserOptionTitle={t('current_responsible_user')}
          />
        </AutomationFormItem>

        <AutomationFormItem text={t('entity_name')}>
          <MyInput
            model={form.name}
            variant="outlined"
            placeholder={t('placeholders.entity_name')}
          />
        </AutomationFormItem>
      </WrapperWithLeftOffset>
    </AutomationFormItem>
  );
});

CreateEntityAutomationModalContent.displayName = 'CreateEntityAutomationModalContent';
export { CreateEntityAutomationModalContent };

import { userStore } from '@/app';
import {
  MyInput,
  MyUsersSelect,
  type InputModel,
  type NumberModel,
  type SelectModel,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { AutomationEntityTypeDeadline } from '../../../models';
import {
  AutomationFormItem,
  DeferStartSelect,
  DescriptionBlock,
  DueDateSelect,
  WrapperWithLeftOffset,
} from '../components';

export interface AddTaskAutomationModalContentForm {
  text: InputModel;
  title: InputModel;
  deferStart: NumberModel;
  responsibleUserId: SelectModel;
  deadline: AutomationEntityTypeDeadline;
}

interface Props {
  form: AddTaskAutomationModalContentForm;
}

const AddTaskAutomationModalContent = observer((props: Props) => {
  const { form } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.add_task_automation_modal',
  });

  const handleChangeDeadline = useCallback(
    (deadline: AutomationEntityTypeDeadline) => (form.deadline = deadline),
    [form]
  );

  return (
    <AutomationFormItem text={t('create_task')}>
      <WrapperWithLeftOffset>
        <AutomationFormItem text={t('defer_start')}>
          <DeferStartSelect model={form.deferStart} />
        </AutomationFormItem>

        <AutomationFormItem text={t('due_date')}>
          <DueDateSelect deadline={form.deadline} onChange={handleChangeDeadline} />
        </AutomationFormItem>

        <AutomationFormItem text={t('responsible_user')} hint={t('current_responsible_user_hint')}>
          <MyUsersSelect
            withinPortal
            variant="outlined"
            users={userStore.activeUsers}
            model={form.responsibleUserId}
            emptyUserOptionTitle={t('current_responsible_user')}
          />
        </AutomationFormItem>

        <AutomationFormItem text={t('name_and_description')}>
          <MyInput
            variant="outlined"
            placeholder={t('placeholders.task_name')}
            model={form.title}
          />

          <DescriptionBlock model={form.text} />
        </AutomationFormItem>
      </WrapperWithLeftOffset>
    </AutomationFormItem>
  );
});

AddTaskAutomationModalContent.displayName = 'AddTaskAutomationModalContent';
export { AddTaskAutomationModalContent };

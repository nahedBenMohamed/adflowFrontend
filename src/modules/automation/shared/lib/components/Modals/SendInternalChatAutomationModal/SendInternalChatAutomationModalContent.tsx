import { userStore } from '@/app';
import {
  type InputModel,
  type MultiselectModel,
  MyTextArea,
  MyUsersSelect,
  type SelectModel,
  UsersMultiselect,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { AutomationFormItem, TemplateList } from '../components';

export interface SendInternalChatAutomationModalContentForm {
  message: InputModel;
  userId: SelectModel;
  sendTo: MultiselectModel<number>;
}

interface Props {
  entityTypeId: number;
  form: SendInternalChatAutomationModalContentForm;
}

const SendInternalChatAutomationModalContent = observer((props: Props) => {
  const { entityTypeId, form } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.send_internal_chat_automation_modal',
  });

  return (
    <>
      <AutomationFormItem text={t('sender')} hint={t('responsible_user_hint')}>
        <MyUsersSelect
          withinPortal
          variant="outlined"
          model={form.userId}
          users={userStore.activeUsers}
          emptyUserOptionTitle={t('current_responsible_user')}
        />
      </AutomationFormItem>

      <AutomationFormItem text={t('recipients')}>
        <UsersMultiselect
          variant="outlined"
          model={form.sendTo}
          users={userStore.activeUsers}
          emptyUserOptionTitle={t('current_responsible_user')}
          placeholder={t('placeholders.recipients')}
        />
      </AutomationFormItem>

      <AutomationFormItem text={t('message')}>
        <MyTextArea
          minRows={3}
          maxRows={32}
          variant="outlined"
          model={form.message}
          placeholder={t('placeholders.message')}
        />

        <TemplateList entityTypeId={entityTypeId} />
      </AutomationFormItem>
    </>
  );
});

export { SendInternalChatAutomationModalContent };

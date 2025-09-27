import { userStore } from '@/app';
import type { SelectModel } from '@/shared';
import { MyUsersSelect } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { AutomationFormItem } from '../components';

export interface ChangeResponsibleAutomationModalContentForm {
  responsibleUserId: SelectModel;
}

interface Props {
  form: ChangeResponsibleAutomationModalContentForm;
}

const ChangeResponsibleAutomationModalContent = observer((props: Props) => {
  const { form } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.change_responsible_automation_modal',
  });

  return (
    <AutomationFormItem gap="16px" text={t('responsible_user')}>
      <MyUsersSelect
        withinPortal
        variant="outlined"
        users={userStore.activeUsers}
        model={form.responsibleUserId}
        placeholder={t('placeholders.select_responsible_user')}
      />
    </AutomationFormItem>
  );
});

ChangeResponsibleAutomationModalContent.displayName = 'ChangeResponsibleAutomationModalContent';
export { ChangeResponsibleAutomationModalContent };

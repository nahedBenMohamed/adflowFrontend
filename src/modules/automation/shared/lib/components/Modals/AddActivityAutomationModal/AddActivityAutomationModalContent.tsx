import { userStore } from '@/app';
import { activityTypeStore } from '@/modules/tasks';
import type { Option } from '@/shared';
import {
  MySelect,
  MyUsersSelect,
  type InputModel,
  type NumberModel,
  type SelectModel,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { AutomationEntityTypeDeadline } from '../../../models';
import {
  AutomationFormItem,
  DeferStartSelect,
  DescriptionBlock,
  DueDateSelect,
  WrapperWithLeftOffset,
} from '../components';

export interface AddActivityAutomationModalContentForm {
  text: InputModel;
  deferStart: NumberModel;
  activityTypeId: SelectModel;
  responsibleUserId: SelectModel;
  deadline: AutomationEntityTypeDeadline;
}

interface Props {
  form: AddActivityAutomationModalContentForm;
}

const AddActivityAutomationModalContent = observer((props: Props) => {
  const { form } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.add_activity_automation_modal',
  });

  const changeDeadline = useCallback(
    (deadline: AutomationEntityTypeDeadline) => (form.deadline = deadline),
    [form]
  );

  const activityTypeOptions = useMemo<Option<number>[]>(
    () =>
      activityTypeStore.activeActivityTypes.map<Option<number>>(a => ({
        label: a.name,
        value: a.id,
      })),
    []
  );

  return (
    <AutomationFormItem text={t('create_activity')}>
      <WrapperWithLeftOffset>
        <AutomationFormItem text={t('defer_start')}>
          <DeferStartSelect model={form.deferStart} />
        </AutomationFormItem>

        <AutomationFormItem text={t('due_date')}>
          <DueDateSelect deadline={form.deadline} onChange={changeDeadline} />
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

        <AutomationFormItem text={t('activity_type')}>
          <MySelect
            withinPortal
            variant="outlined"
            model={form.activityTypeId}
            options={activityTypeOptions}
            placeholder={t('placeholders.select_activity_type')}
          />
        </AutomationFormItem>

        <AutomationFormItem text={t('description')}>
          <DescriptionBlock model={form.text} />
        </AutomationFormItem>
      </WrapperWithLeftOffset>
    </AutomationFormItem>
  );
});

AddActivityAutomationModalContent.displayName = 'AddActivityAutomationModalContent';
export { AddActivityAutomationModalContent };

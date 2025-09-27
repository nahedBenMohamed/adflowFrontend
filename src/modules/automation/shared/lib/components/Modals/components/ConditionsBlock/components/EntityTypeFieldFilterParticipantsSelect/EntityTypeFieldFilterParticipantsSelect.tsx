import { userStore } from '@/app';
import { UsersMultiselect, type SelectFilterFormData } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { AutomationFormItem } from '../../../AutomationFormItem/AutomationFormItem';

interface Props {
  formData: SelectFilterFormData;
}

const EntityTypeFieldFilterParticipantsSelect = observer((props: Props) => {
  const { formData } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.common.conditions_block',
  });

  return (
    <AutomationFormItem text={t('condition')}>
      <UsersMultiselect
        withinPortal
        variant="outlined"
        model={formData.optionIds}
        users={userStore.activeUsers}
        placeholder={t('placeholders.selected_participants')}
      />
    </AutomationFormItem>
  );
});

EntityTypeFieldFilterParticipantsSelect.displayName = 'EntityTypeFieldFilterParticipantsSelect';
export { EntityTypeFieldFilterParticipantsSelect };

import { userStore } from '@/app';
import { MySelect, SelectModel, type Option } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { ResponsibleUser, ResponsibleUserType } from '../../../../models';

interface Props {
  responsibleUser: ResponsibleUser;
  onChange: (responsibleUser: ResponsibleUser) => void;
}

const CURRENT_VALUE = 0;

const AutomationUserSelect = observer((props: Props) => {
  const { responsibleUser, onChange } = props;

  const { t } = useTranslation('module.automation', {
    keyPrefix: 'automation.modals.add_task_automation_modal',
  });

  const selectedValue =
    responsibleUser.type === ResponsibleUserType.CURRENT ? CURRENT_VALUE : responsibleUser.id;

  const model = SelectModel.create(selectedValue);

  const userOptions = userStore.activeUsers.map<Option<number>>(u => ({
    label: u.fullName,
    value: u.id,
  }));

  userOptions.unshift({ label: t('current_responsible_user'), value: CURRENT_VALUE });

  const handleChange = () => {
    const type =
      model.value === CURRENT_VALUE ? ResponsibleUserType.CURRENT : ResponsibleUserType.CUSTOM;

    const id = model.value === CURRENT_VALUE ? null : model.value;

    onChange(new ResponsibleUser({ type, id }));
  };

  return (
    <MySelect
      withinPortal
      model={model}
      variant="outlined"
      options={userOptions}
      placeholder={t('placeholders.select_user')}
      handleChange={handleChange}
    />
  );
});

AutomationUserSelect.displayName = 'AutomationUserSelect';
export { AutomationUserSelect };

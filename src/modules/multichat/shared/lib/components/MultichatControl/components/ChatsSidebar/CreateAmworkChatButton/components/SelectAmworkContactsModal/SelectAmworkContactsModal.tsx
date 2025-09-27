import { userStore } from '@/app';
import { DialogModalSecondary, UserList, type MultiselectModel, type Option } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

interface Props {
  participantsIds: MultiselectModel<number>;
  opened: boolean;
  loading: boolean;
  hide: () => void;
  onApprove: () => void;
}

const SelectAmworkContactsModal = observer((props: Props) => {
  const { participantsIds, opened, loading, hide, onApprove } = props;

  const { t } = useTranslation('module.multichat', {
    keyPrefix: 'multichat.components.multichat_control.ui.create_amwork_chat_button.modals',
  });

  const handleSelect = (option: Option<number>) => {
    if (participantsIds.values.includes(option.value)) {
      participantsIds.values = participantsIds.values.filter(v => v !== option.value);
    } else {
      participantsIds.values = [...participantsIds.values, option.value];
    }
  };

  const handleGroupSelect = (options: Option<number>[]) => {
    const addedValues = options
      .filter(o => !participantsIds.values.includes(o.value))
      .map(o => o.value);

    if (addedValues.length) {
      participantsIds.setValue([...participantsIds.values, ...addedValues]);
    } else {
      participantsIds.setValue(
        participantsIds.values.filter(v => !options.some(o => o.value === v))
      );
    }
  };

  return (
    <DialogModalSecondary
      maxWidth="384px"
      maxHeight="456px"
      loading={loading}
      isOpened={opened}
      approveTitle={t('continue')}
      Header={t('select_contact_title')}
      approveDisabled={!participantsIds.values.length || loading}
      onClose={hide}
      onApprove={onApprove}
    >
      <UserList
        maxHeight="100%"
        multiselectProps={{
          selectedUserIds: participantsIds.values,
          onSelect: handleSelect,
          onGroupSelect: handleGroupSelect,
        }}
        users={userStore.activeUsersWithoutCurrent}
      />
    </DialogModalSecondary>
  );
});

SelectAmworkContactsModal.displayName = 'SelectAmworkContactsModal';
export { SelectAmworkContactsModal };

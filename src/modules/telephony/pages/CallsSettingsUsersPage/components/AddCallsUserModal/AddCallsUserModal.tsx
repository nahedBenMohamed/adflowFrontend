import { userStore } from '@/app';
import { DialogModalSecondary, MultiselectModel, UserList, type Option } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateVoximplantUserDto, useCreateVoximplantUser } from '../../../../api';
import type { VoximplantUser } from '../../../../shared';

interface Props {
  opened: boolean;
  createdUsers: VoximplantUser[];
  hide: () => void;
}

const AddCallsUserModal = observer((props: Props) => {
  const { opened, createdUsers, hide } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_users_page',
  });

  const { mutateAsync: createUser, isPending } = useCreateVoximplantUser();

  const usersModel = useLocalObservable(() => MultiselectModel.create<number>([]));

  const handleSelect = (option: Option<number>) => {
    if (usersModel.values.includes(option.value)) {
      usersModel.values = usersModel.values.filter(v => v !== option.value);
    } else {
      usersModel.values = [...usersModel.values, option.value];
    }
  };

  const users = userStore.activeUsers.filter(user => !createdUsers.find(u => u.userId === user.id));

  const handleCreateUser = async (): Promise<void> => {
    await Promise.all(
      usersModel.values.map(userId =>
        createUser({ userId, dto: new CreateVoximplantUserDto(true) })
      )
    );

    hide();
  };

  const handleGroupSelect = useCallback(
    (options: Option<number>[]) => {
      const addedValues = options
        .filter(o => !usersModel.values.includes(o.value))
        .map(o => o.value);

      if (addedValues.length) {
        usersModel.setValue([...usersModel.values, ...addedValues]);
      } else {
        usersModel.setValue(usersModel.values.filter(v => !options.some(o => o.value === v)));
      }
    },
    [usersModel]
  );

  return (
    <DialogModalSecondary
      maxWidth="384px"
      maxHeight="456px"
      isOpened={opened}
      loading={isPending}
      Header={t('add_user')}
      approveTitle={t('create')}
      approveDisabled={isPending}
      onClose={hide}
      onApprove={handleCreateUser}
    >
      <UserList
        users={users}
        maxHeight="100%"
        multiselectProps={{
          selectedUserIds: usersModel.values,
          onSelect: handleSelect,
          onGroupSelect: handleGroupSelect,
        }}
      />
    </DialogModalSecondary>
  );
});

AddCallsUserModal.displayName = 'AddCallsUserModal';
export { AddCallsUserModal };

import { userStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  BooleanModel,
  MySwitchWithModel,
  PrimaryButton,
  UserView,
  debounce,
  type User,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  UpdateVoximplantUserDto,
  useDeleteVoximplantUser,
  usePatchVoximplantUser,
} from '../../../../api';
import type { VoximplantUser } from '../../../../shared';
import { voximplantConnectorStore } from '../../../../store';
import { RemoveCallsUserWarningModal } from '../RemoveCallsUserWarningModal/RemoveCallsUserWarningModal';
import { UserSIPSettingsModal } from './components';

const Root = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: 14px;
  line-height: 20px;

  padding: 8px 16px;
  border-radius: var(--border-radius-element);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;
`;

const Delimiter = styled.hr`
  height: 20px;

  border-left: 1px solid var(--graphite-graphite-80);
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ControlsButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
`;

interface Props {
  user: VoximplantUser;
}

const TelephonyUserItem = observer((props: Props) => {
  const {
    user: { userId, isActive },
  } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_users_page',
  });

  const { mutateAsync: removeUser, isPending: isRemoving } = useDeleteVoximplantUser(userId);
  const { mutateAsync: updateUser } = usePatchVoximplantUser(userId);

  const [removeWarningOpened, removeWarningControls] = useDisclosure(false);
  const [
    userSIPSettingsModalOpened,
    { open: showUserSIPSettingsModalOpened, close: hideUserSIPSettingsModalOpened },
  ] = useDisclosure(false);

  const activeModel = useLocalObservable(() => BooleanModel.create(isActive));

  const systemUser = useMemo<User>(() => userStore.getById(userId), [userId]);

  const handleDeleteUser = useCallback(async (): Promise<void> => {
    await removeUser();

    removeWarningControls.close();
  }, [removeWarningControls, removeUser]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleUpdateUser = useCallback(
    debounce(async (active: boolean): Promise<void> => {
      const dto = new UpdateVoximplantUserDto(active);

      await updateUser(dto);

      const currentUser = authStore.user;

      if (currentUser && currentUser.id === userId) voximplantConnectorStore.loadData();
    }, 1000),
    [userId, updateUser]
  );

  return (
    <Root>
      <UserView user={systemUser} />

      <Controls>
        <MySwitchWithModel model={activeModel} label={t('active')} onChange={handleUpdateUser} />

        <ControlsButtonsWrapper>
          <Delimiter />

          <PrimaryButton variant="empty" onClick={showUserSIPSettingsModalOpened}>
            {t('open_sip_settings')}
          </PrimaryButton>

          <PrimaryButton
            variant="empty-danger"
            disabled={isRemoving}
            onClick={removeWarningControls.open}
          >
            {t('remove_user')}
          </PrimaryButton>
        </ControlsButtonsWrapper>
      </Controls>

      {removeWarningOpened && (
        <RemoveCallsUserWarningModal
          removing={isRemoving}
          opened={removeWarningOpened}
          userName={systemUser.fullName}
          onApprove={handleDeleteUser}
          hide={removeWarningControls.close}
        />
      )}

      {userSIPSettingsModalOpened && (
        <UserSIPSettingsModal
          userId={userId}
          userName={systemUser.fullName}
          opened={userSIPSettingsModalOpened}
          onClose={hideUserSIPSettingsModalOpened}
        />
      )}
    </Root>
  );
});

TelephonyUserItem.displayName = 'TelephonyUserItem';
export { TelephonyUserItem };

import { routes, subscriptionStore, userStore } from '@/app';
import { RequestSetupFormButton } from '@/modules/settings';
import { AddUserToPlanModal, CreateButton, SelectModel, TotalTag, type Nullable } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { departmentsSettingsStore } from '../../../store';
import { SettingsPageTemplate } from '../../../templates';
import { DepartmentBlock, RemoveUserModal, UserList, UsersPageSkeleton } from './components';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 0 0 12px;
`;

const UsersSettingsPage = observer(() => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.users_settings_page',
  });

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, []);

  const navigate = useNavigate();

  const { departments } = departmentsSettingsStore;
  const users = userStore.activeUsers;

  const subscription = subscriptionStore.subscription;
  const userLimit = subscription?.userLimit;

  const [loading, setLoading] = useState(false);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [userIdForDelete, setUserIdForDelete] = useState<Nullable<number>>(null);
  const [isUserLimitModalOpened, { close: hideUserLimitModal, open: showUserLimitModal }] =
    useDisclosure(false);

  const newResponsibleUserId = useLocalObservable(() => SelectModel.create());

  const onDelete = (userId: number) => {
    setUserIdForDelete(userId);

    setIsModalOpened(true);
  };

  const onClose = () => {
    setIsModalOpened(false);

    newResponsibleUserId.value = null;
  };

  const onApproveDeleteUser = async () => {
    setLoading(true);

    if (newResponsibleUserId.value && userIdForDelete)
      await userStore.delete({ userId: userIdForDelete, newUserId: newResponsibleUserId.value });

    setLoading(false);
    setIsModalOpened(false);
  };

  const onAddUser = () => {
    if (userLimit && users.length < userLimit) {
      navigate(routes.settingsUsersAdd());
    } else {
      showUserLimitModal();
    }
  };

  const usersWithoutDepartment = users.filter(u => !u.departmentId);

  return (
    <>
      <SettingsPageTemplate
        pageTitleKey="settings.user_list"
        Controls={
          <>
            <TotalTag total={users.length} />

            <CreateButton tooltip={t('create_button_tooltip')} onClick={onAddUser} />

            <RequestSetupFormButton titleKey="request_setup" />
          </>
        }
      >
        <Root>
          {usersWithoutDepartment.length > 0 && (
            <UserList users={usersWithoutDepartment} onDelete={onDelete} />
          )}

          {userStore.isLoaded && departmentsSettingsStore.isLoaded ? (
            departments.map(d => (
              <DepartmentBlock key={d.id} department={d} users={users} onDeleteUser={onDelete} />
            ))
          ) : (
            <UsersPageSkeleton />
          )}
        </Root>
      </SettingsPageTemplate>

      {isModalOpened && (
        <RemoveUserModal
          loading={loading}
          isOpened={isModalOpened}
          selectedUserId={newResponsibleUserId}
          users={users.filter(u => u.id !== userIdForDelete)}
          onClose={onClose}
          onApprove={onApproveDeleteUser}
        />
      )}

      {isUserLimitModalOpened && (
        <AddUserToPlanModal isOpened={isUserLimitModalOpened} onClose={hideUserLimitModal} />
      )}
    </>
  );
});

UsersSettingsPage.displayName = 'UsersSettingsPage';
export { UsersSettingsPage };

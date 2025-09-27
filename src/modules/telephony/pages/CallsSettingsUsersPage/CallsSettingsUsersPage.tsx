import { appStore, userStore } from '@/app';
import {
  departmentsSettingsStore,
  RequestSetupFormButton,
  SettingsPageTemplate,
} from '@/modules/settings';
import { DefaultLoader, EmptyTableBlock } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGetVoximplantUsers } from '../../api';
import {
  AddCallsUserModal,
  CallsSettingsUsersPageTitle,
  TelephonyDepartmentBlock,
  TelephonyUsersList,
} from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding-bottom: 16px;
`;

const LoaderWrapper = styled.div`
  margin-top: 240px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CallsSettingsUsersPage = observer(() => {
  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_users_page',
  });

  const { data: voximplantUsers, isLoading } = useGetVoximplantUsers();

  const { departments } = departmentsSettingsStore;

  const [addUserModalOpened, addUserModalControls] = useDisclosure(false);

  if (!appStore.isLoaded || isLoading)
    return (
      <SettingsPageTemplate>
        <Root>
          <CallsSettingsUsersPageTitle openAddUserModal={addUserModalControls.open} />

          <LoaderWrapper>
            <DefaultLoader />
          </LoaderWrapper>
        </Root>
      </SettingsPageTemplate>
    );

  const usersWithoutDepartment = voximplantUsers
    ? voximplantUsers.filter(u => !userStore.getById(u.userId).departmentId)
    : [];

  return (
    <SettingsPageTemplate
      Controls={<RequestSetupFormButton titleKey="request_telephony" />}
      pageTitleKey="settings.calls.users"
    >
      <Root>
        <CallsSettingsUsersPageTitle openAddUserModal={addUserModalControls.open} />

        {voximplantUsers && voximplantUsers.length > 0 ? (
          <List>
            {usersWithoutDepartment.length > 0 && (
              <TelephonyUsersList users={usersWithoutDepartment} />
            )}

            {voximplantUsers &&
              departments.map(d => (
                <TelephonyDepartmentBlock key={d.id} department={d} users={voximplantUsers} />
              ))}
          </List>
        ) : (
          <EmptyTableBlock $height="400px">{t('empty')}</EmptyTableBlock>
        )}
      </Root>

      {addUserModalOpened && voximplantUsers && (
        <AddCallsUserModal
          createdUsers={voximplantUsers}
          opened={addUserModalOpened}
          hide={addUserModalControls.close}
        />
      )}
    </SettingsPageTemplate>
  );
});

CallsSettingsUsersPage.displayName = 'CallsSettingsUsersPage';
export { CallsSettingsUsersPage };

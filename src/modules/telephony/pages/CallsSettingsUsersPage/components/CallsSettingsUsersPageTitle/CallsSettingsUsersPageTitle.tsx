import { SettingsPageTitle } from '@/modules/settings';
import { PlusPrimaryIcon, PrimaryButton } from '@/shared';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
`;

interface Props {
  openAddUserModal: () => void;
}

const CallsSettingsUsersPageTitle = memo((props: Props) => {
  const { openAddUserModal } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_users_page',
  });

  return (
    <Root>
      <SettingsPageTitle>{t('users')}</SettingsPageTitle>

      <PrimaryButton iconProps={{ Icon: <PlusPrimaryIcon /> }} onClick={openAddUserModal}>
        {t('add_user')}
      </PrimaryButton>
    </Root>
  );
});

CallsSettingsUsersPageTitle.displayName = 'CallsSettingsUsersPageTitle';
export { CallsSettingsUsersPageTitle };

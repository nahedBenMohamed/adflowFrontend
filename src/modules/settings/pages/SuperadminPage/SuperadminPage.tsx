import { useGetSubscriptionForAccount } from '@/app';
import { Account, SettingsPageTitle } from '@/modules/settings';
import { envUtil, Nullable, PrimaryButton } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import styled from 'styled-components';
import { SettingsPageTemplate } from '../../templates';
import { AccountBlock, AccountSearchBox, SubscriptionEditModal } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const AccountsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SuperadminPage = () => {
  const [account, setAccount] = useState<Nullable<Account>>(null);

  const { data: subscription } = useGetSubscriptionForAccount(account?.id);

  const [
    isSubscriptionModalOpened,
    { open: openSubscriptionModal, close: closeSubscriptionModal },
  ] = useDisclosure(false);

  return (
    <SettingsPageTemplate pageTitleKey="settings.superadmin">
      <Root>
        <SettingsPageTitle>{`Администрирование аккаунтов ${envUtil.appName}`}</SettingsPageTitle>

        <AccountsWrapper>
          <AccountSearchBox onSelect={setAccount} />

          <AccountBlock account={account} subscription={subscription} />

          {account && subscription && (
            <PrimaryButton onClick={openSubscriptionModal}>
              {'Изменить настройки подписки'}
            </PrimaryButton>
          )}

          {account && subscription && isSubscriptionModalOpened && (
            <SubscriptionEditModal
              isOpened={isSubscriptionModalOpened}
              subscription={subscription}
              account={account}
              onClose={closeSubscriptionModal}
            />
          )}
        </AccountsWrapper>
      </Root>
    </SettingsPageTemplate>
  );
};

export { SuperadminPage };

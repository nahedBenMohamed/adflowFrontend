import { PlusIconButton } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { IntegrationSettingsAccount } from '../../../../shared';
import { IntegrationAccountItem } from '../IntegrationAccountItem/IntegrationAccountItem';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  accounts: IntegrationSettingsAccount[];
  openAddAccountModal: () => void;
}

const IntegrationAccountsList = (props: Props) => {
  const { accounts, openAddAccountModal } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.common.modals.integration_accounts_list',
  });

  return (
    <Root>
      {accounts.map(a => (
        <IntegrationAccountItem key={a.id} account={a} />
      ))}

      <PlusIconButton text={t('add_account')} onClick={openAddAccountModal} />
    </Root>
  );
};

export { IntegrationAccountsList };

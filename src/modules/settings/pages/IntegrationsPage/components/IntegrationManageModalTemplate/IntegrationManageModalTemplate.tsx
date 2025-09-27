import { useTranslation } from 'react-i18next';
import type { IntegrationSettingsAccount } from '../../../../shared';
import { IntegrationAccountsList } from '../IntegrationAccountsList/IntegrationAccountsList';
import {
  IntegrationInfoModalTemplate,
  type IntegrationInfoModalTemplateProps,
} from '../IntegrationInfoModalTemplate/IntegrationInfoModalTemplate';
import { IntegrationInfoTitle } from '../IntegrationInfoTitle/IntegrationInfoTitle';

type OmittedIntegrationInfoModalTemplateProps = Omit<
  IntegrationInfoModalTemplateProps,
  'children' | 'approveTitle'
>;

interface Props extends OmittedIntegrationInfoModalTemplateProps {
  accounts: IntegrationSettingsAccount[];
  openAddAccountModal: () => void;
}

const IntegrationManageModalTemplate = (props: Props) => {
  const { accounts, openAddAccountModal, ...rest } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page',
  });

  return (
    <IntegrationInfoModalTemplate approveTitle={t('save')} {...rest}>
      <IntegrationInfoTitle>{t('manage_connected_accounts')}</IntegrationInfoTitle>

      <IntegrationAccountsList accounts={accounts} openAddAccountModal={openAddAccountModal} />
    </IntegrationInfoModalTemplate>
  );
};

export { IntegrationManageModalTemplate };

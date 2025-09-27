import { type Nullable, useQueryParamModalControl } from '@/shared';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SALESFORCE_FIRST_INFO_MODAL_QUERY_PARAM,
  SalesforceLogo,
  type SalesforceSettings,
} from '../../../../../../shared';
import { salesforceProviderSettingsStore } from '../../../../../../store';
import { IntegrationItem } from '../../../IntegrationItem/IntegrationItem';
import { SalesforceModal } from '../modals/SalesforceModal/SalesforceModal';

const SalesforceItem = () => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.salesforce.salesforce_item',
  });

  const [settings, setSettings] = useState<Nullable<SalesforceSettings>>(null);

  const loadSettings = useCallback(async (): Promise<void> => {
    const settings = await salesforceProviderSettingsStore.loadData();

    setSettings(settings[0] ?? null);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const connected = settings?.isConnected ?? false;

  const modalControl = useQueryParamModalControl(SALESFORCE_FIRST_INFO_MODAL_QUERY_PARAM);

  const connect = async ({
    domain,
    key,
    secret,
  }: {
    domain: string;
    key: string;
    secret: string;
  }): Promise<void> => {
    modalControl.close();

    const url = await salesforceProviderSettingsStore.createAndConnect({ domain, key, secret });

    window.location.href = url;
  };

  const disconnect = async (): Promise<void> => {
    modalControl.close();

    if (settings) {
      await salesforceProviderSettingsStore.disconnectAndDelete(settings.id);

      await loadSettings();
    }
  };

  return (
    <>
      <IntegrationItem
        Icon={<SalesforceLogo />}
        description={t('description')}
        onInstall={modalControl.open}
      />

      {modalControl.opened && (
        <SalesforceModal
          connected={connected}
          opened={modalControl.opened}
          connect={connect}
          onClose={modalControl.close}
          disconnect={disconnect}
        />
      )}
    </>
  );
};

export { SalesforceItem };

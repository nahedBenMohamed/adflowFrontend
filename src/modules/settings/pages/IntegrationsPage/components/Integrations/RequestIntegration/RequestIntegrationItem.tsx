import { BigPlusIcon, useModalControl } from '@/shared';
import { useTranslation } from 'react-i18next';
import { RequestSetupFormModal } from '../../../../../shared';
import { IntegrationItem } from '../../IntegrationItem/IntegrationItem';

const RequestIntegrationItem = () => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.request_integration',
  });

  const modalControl = useModalControl(false);

  return (
    <>
      <IntegrationItem
        iconSize="70%"
        highlightedButton
        Icon={<BigPlusIcon />}
        description={t('description')}
        installTitle={t('request')}
        onInstall={modalControl.open}
      />

      {modalControl.opened && (
        <RequestSetupFormModal
          isOpened={modalControl.opened}
          titleKey="request_integration"
          onClose={modalControl.close}
        />
      )}
    </>
  );
};

export { RequestIntegrationItem };

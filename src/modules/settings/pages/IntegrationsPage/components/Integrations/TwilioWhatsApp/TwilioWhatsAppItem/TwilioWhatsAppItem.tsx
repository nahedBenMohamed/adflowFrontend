import { envUtil, useModalControl, useQueryParamModalControl } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TWILIO_FIRST_INFO_MODAL_QUERY_PARAM, WhatsAppIcon } from '../../../../../../shared';
import { twilioWhatsAppProviderSettingsStore } from '../../../../../../store';
import { IntegrationItem } from '../../../IntegrationItem/IntegrationItem';
import { TwilioWhatsAppModalsQueue } from '../modals/TwilioWhatsAppModalsQueue/TwilioWhatsAppModalsQueue';

const TwilioWhatsAppItem = observer(() => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.whatsapp.whatsapp_item',
  });

  const { providersSettings, loadData } = twilioWhatsAppProviderSettingsStore;

  const firstModalControl = useQueryParamModalControl(TWILIO_FIRST_INFO_MODAL_QUERY_PARAM);
  const manageModalControl = useModalControl(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const count = providersSettings.length;

  return (
    <>
      <IntegrationItem
        count={count}
        Icon={<WhatsAppIcon />}
        description={t('title', { company: envUtil.appName })}
        onInstall={firstModalControl.open}
        onManage={count ? manageModalControl.open : undefined}
      />

      <TwilioWhatsAppModalsQueue
        firstModalControl={firstModalControl}
        manageModalControl={manageModalControl}
      />
    </>
  );
});

TwilioWhatsAppItem.displayName = 'TwilioWhatsAppItem';
export { TwilioWhatsAppItem };

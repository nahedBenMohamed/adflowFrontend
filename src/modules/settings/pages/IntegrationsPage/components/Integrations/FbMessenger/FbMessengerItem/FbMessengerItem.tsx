import { useModalControl, useQueryParamModalControl } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FB_FIRST_INFO_MODAL_QUERY_PARAM, FbMessengerIcon } from '../../../../../../shared';
import { fbMessengerProviderSettingsStore } from '../../../../../../store';
import { IntegrationItem } from '../../../IntegrationItem/IntegrationItem';
import { FbMessengerModalsQueue } from '../modals/FbMessengerModalsQueue/FbMessengerModalsQueue';

const FbMessengerItem = observer(() => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.fb_messenger.fb_messenger_item',
  });

  const firstModalControl = useQueryParamModalControl(FB_FIRST_INFO_MODAL_QUERY_PARAM);
  const manageModalControl = useModalControl(false);

  const { providersSettings, loadData } = fbMessengerProviderSettingsStore;

  useEffect(() => {
    loadData();
  }, [loadData]);

  const count = providersSettings.length;

  return (
    <>
      <IntegrationItem
        count={count}
        Icon={<FbMessengerIcon />}
        description={t('title')}
        onInstall={firstModalControl.open}
        onManage={count ? manageModalControl.open : undefined}
      />

      <FbMessengerModalsQueue
        firstModalControl={firstModalControl}
        manageModalControl={manageModalControl}
      />
    </>
  );
});

FbMessengerItem.displayName = 'FbMessengerItem';
export { FbMessengerItem };

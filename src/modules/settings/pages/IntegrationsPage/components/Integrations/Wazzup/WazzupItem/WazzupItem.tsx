import { useModalControl, useQueryParamModalControl } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { WAZZUP_FIRST_INFO_MODAL_QUERY_PARAM, WazzupIcon } from '../../../../../../shared';
import { wazzupProviderSettingsStore } from '../../../../../../store';
import { IntegrationItem } from '../../../IntegrationItem/IntegrationItem';
import { WazzupModalsQueue } from '../modals/WazzupModalsQueue/WazzupModalsQueue';

const WazzupItem = observer(() => {
  const { providersSettings, loadData } = wazzupProviderSettingsStore;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.wazzup.wazzup_item',
  });

  const firstInfoModalControl = useQueryParamModalControl(WAZZUP_FIRST_INFO_MODAL_QUERY_PARAM);

  const manageModalControl = useModalControl(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const count = providersSettings.length;

  return (
    <>
      <IntegrationItem
        count={count}
        Icon={<WazzupIcon />}
        description={t('title')}
        onInstall={firstInfoModalControl.open}
        onManage={count ? manageModalControl.open : undefined}
      />

      <WazzupModalsQueue
        firstInfoModalOpened={firstInfoModalControl.opened}
        manageModalControl={manageModalControl}
        handleCloseFirstInfoModal={firstInfoModalControl.close}
      />
    </>
  );
});

WazzupItem.displayName = 'WazzupItem';
export { WazzupItem };

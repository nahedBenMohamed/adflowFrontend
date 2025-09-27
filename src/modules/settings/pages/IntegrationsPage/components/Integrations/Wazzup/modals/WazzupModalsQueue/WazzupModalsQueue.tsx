import type { WazzupProvider } from '@/modules/multichat';
import { useModalControl, type ModalControl, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  GOOGLE_CALENDAR_CONNECT_MODAL_QUERY_PARAM,
  WAZZUP_STATE_PARAM_KEY,
} from '../../../../../../../shared';
import { wazzupProviderSettingsStore } from '../../../../../../../store';
import { WazzupConnectModal } from '../WazzupConnectModal/WazzupConnectModal';
import { WazzupFirstInfoModal } from '../WazzupFirstInfoModal/WazzupFirstInfoModal';
import { WazzupManageModal } from '../WazzupManageModal/WazzupManageModal';

interface Props {
  firstInfoModalOpened: boolean;
  manageModalControl: ModalControl;
  handleCloseFirstInfoModal: () => void;
}

const WazzupModalsQueue = observer((props: Props) => {
  const { firstInfoModalOpened, manageModalControl, handleCloseFirstInfoModal } = props;

  const [searchParams] = useSearchParams();

  const wazzupStateParam = searchParams.get(WAZZUP_STATE_PARAM_KEY);
  // TODO: Fix Wazzup connect logic, make with redirect like Google Calendar or so...
  const isGoogleCalendarOpened =
    searchParams.get(GOOGLE_CALENDAR_CONNECT_MODAL_QUERY_PARAM) === 'true';

  const { areProvidersSettingsLoaded, providersSettings } = wazzupProviderSettingsStore;

  // For now "state" param also exists when we're connecting to Google Calendar
  // TODO: Fix Wazzup connect logic, make with redirect like Google Calendar or so...
  const connectModalControl = useModalControl(Boolean(wazzupStateParam && !isGoogleCalendarOpened));

  const [currentProviderSettings, setCurrentProviderSettings] =
    useState<Nullable<WazzupProvider>>(null);

  const handleOpenConnectModal = () => {
    handleCloseFirstInfoModal();

    connectModalControl.open();
  };

  const handleOpenEditModal = (providerSettings: Nullable<WazzupProvider>) => {
    setCurrentProviderSettings(providerSettings);

    connectModalControl.open();
  };

  const handleClearCurrentProviderSettings = () => {
    setCurrentProviderSettings(null);
  };

  return (
    <>
      {firstInfoModalOpened && (
        <WazzupFirstInfoModal
          firstInfoModalOpened={firstInfoModalOpened}
          onApprove={handleOpenConnectModal}
          handleCloseFirstInfoModal={handleCloseFirstInfoModal}
        />
      )}

      {connectModalControl.opened && (
        <WazzupConnectModal
          control={connectModalControl}
          wazzupStateParam={wazzupStateParam}
          manageModalControl={manageModalControl}
          currentProviderSettings={currentProviderSettings}
          clearCurrentProviderSettings={handleClearCurrentProviderSettings}
        />
      )}

      {areProvidersSettingsLoaded && manageModalControl.opened && (
        <WazzupManageModal
          control={manageModalControl}
          providersSettings={providersSettings}
          openEditModal={handleOpenEditModal}
        />
      )}
    </>
  );
});

WazzupModalsQueue.displayName = 'WazzupModalsQueue';
export { WazzupModalsQueue };

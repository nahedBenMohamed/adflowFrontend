import type { TwilioProviderSettings } from '@/modules/multichat';
import { useModalControl, type ModalControl, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { twilioWhatsAppProviderSettingsStore } from '../../../../../../../store';
import { TwilioWhatsAppConnectModal } from '../TwilioWhatsAppConnectModal/TwilioWhatsAppConnectModal';
import { TwilioWhatsAppFirstInfoModal } from '../TwilioWhatsAppFirstInfoModal/TwilioWhatsAppFirstInfoModal';
import { TwilioWhatsAppManageModal } from '../TwilioWhatsAppManageModal/TwilioWhatsAppManageModal';
import { TwilioWhatsAppSecondInfoModal } from '../TwilioWhatsAppSecondInfoModal/TwilioWhatsAppSecondInfoModal';
import { TwilioWhatsAppThirdInfoModal } from '../TwilioWhatsAppThirdInfoModal/TwilioWhatsAppThirdInfoModal';

interface Props {
  firstModalControl: ModalControl;
  manageModalControl: ModalControl;
}

const TwilioWhatsAppModalsQueue = observer((props: Props) => {
  const { firstModalControl, manageModalControl } = props;

  const { areProvidersSettingsLoaded, providersSettings } = twilioWhatsAppProviderSettingsStore;

  const [currentProviderSettings, setCurrentProviderSettings] =
    useState<Nullable<TwilioProviderSettings>>(null);

  const secondModalControl = useModalControl(false);
  const thirdModalControl = useModalControl(false);
  const connectModalControl = useModalControl(false);

  const handleOpenSecondModal = () => {
    secondModalControl.open();
    firstModalControl.close();
  };

  const handleBackSecondModal = () => {
    secondModalControl.close();
    firstModalControl.open();
  };

  const handleOpenThirdModal = () => {
    secondModalControl.close();
    thirdModalControl.open();
  };

  const handleBackThirdModal = () => {
    thirdModalControl.close();
    secondModalControl.open();
  };

  const handleOpenConnectModal = () => {
    thirdModalControl.close();
    connectModalControl.open();
  };

  const handleOpenEditModal = (providerSettings: Nullable<TwilioProviderSettings>) => {
    setCurrentProviderSettings(providerSettings);

    connectModalControl.open();
  };

  const handleClearCurrentProviderSettings = () => {
    setCurrentProviderSettings(null);
  };

  return (
    <>
      {firstModalControl.opened && (
        <TwilioWhatsAppFirstInfoModal
          control={firstModalControl}
          onApprove={handleOpenSecondModal}
        />
      )}

      {secondModalControl.opened && (
        <TwilioWhatsAppSecondInfoModal
          control={secondModalControl}
          onApprove={handleOpenThirdModal}
          onCancel={handleBackSecondModal}
        />
      )}

      {thirdModalControl.opened && (
        <TwilioWhatsAppThirdInfoModal
          control={thirdModalControl}
          onApprove={handleOpenConnectModal}
          onCancel={handleBackThirdModal}
        />
      )}

      {connectModalControl.opened && (
        <TwilioWhatsAppConnectModal
          control={connectModalControl}
          manageModalControl={manageModalControl}
          currentProviderSettings={currentProviderSettings}
          clearCurrentProviderSettings={handleClearCurrentProviderSettings}
        />
      )}

      {areProvidersSettingsLoaded && manageModalControl.opened && (
        <TwilioWhatsAppManageModal
          control={manageModalControl}
          providersSettings={providersSettings}
          openEditModal={handleOpenEditModal}
        />
      )}
    </>
  );
});

TwilioWhatsAppModalsQueue.displayName = 'TwilioWhatsAppModalsQueue';
export { TwilioWhatsAppModalsQueue };

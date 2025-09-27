import { appStore } from '@/app';
import type { MessengerProviderSettings, MessengerProviderSettingsDto } from '@/modules/multichat';
import { useModalControl, type ModalControl, type Nullable } from '@/shared';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fbMessengerProviderSettingsStore } from '../../../../../../../store';
import { FbMessengerConnectModal } from '../FbMessengerConnectModal/FbMessengerConnectModal';
import { FbMessengerFirstInfoModal } from '../FbMessengerFirstInfoModal/FbMessengerFirstInfoModal';
import { FbMessengerManageModal } from '../FbMessengerManageModal/FbMessengerManageModal';

interface Props {
  firstModalControl: ModalControl;
  manageModalControl: ModalControl;
}

const PROVIDER_QUERY_KEY = 'providerId';

const FbMessengerModalsQueue = observer((props: Props) => {
  const { firstModalControl, manageModalControl } = props;

  const connectModalControl = useModalControl(false);
  const { open: showFinishModal } = connectModalControl;

  const { areProvidersSettingsLoaded, providersSettings, loadProviderSettingsById } =
    fbMessengerProviderSettingsStore;

  const [currentProviderSettings, setCurrentProviderSettings] =
    useState<Nullable<MessengerProviderSettingsDto>>(null);

  const [searchParams] = useSearchParams();

  const providerIdFromParams = Number(searchParams.get(PROVIDER_QUERY_KEY));

  useEffect(() => {
    const loadProvider = async (): Promise<void> => {
      if (providerIdFromParams) {
        const providerSettings = await loadProviderSettingsById(providerIdFromParams);

        setCurrentProviderSettings(providerSettings);
        showFinishModal();
      }
    };

    when(
      () => appStore.isLoaded,
      () => loadProvider()
    );
  }, [providerIdFromParams, showFinishModal, loadProviderSettingsById]);

  const handleOpenEditModal = (providerSettings: Nullable<MessengerProviderSettings>) => {
    if (!providerSettings) {
      firstModalControl.open();

      return;
    }

    setCurrentProviderSettings(providerSettings);
    connectModalControl.open();
  };

  const handleClearCurrentProviderSettings = () => {
    setCurrentProviderSettings(null);
  };

  return (
    <>
      {firstModalControl.opened && <FbMessengerFirstInfoModal control={firstModalControl} />}

      {connectModalControl.opened && currentProviderSettings && (
        <FbMessengerConnectModal
          control={connectModalControl}
          manageModalControl={manageModalControl}
          providerIdFromParams={providerIdFromParams}
          currentProviderSettings={currentProviderSettings}
          clearCurrentProviderSettings={handleClearCurrentProviderSettings}
        />
      )}

      {manageModalControl.opened && areProvidersSettingsLoaded && (
        <FbMessengerManageModal
          control={manageModalControl}
          providersSettings={providersSettings}
          openEditModal={handleOpenEditModal}
        />
      )}
    </>
  );
});

FbMessengerModalsQueue.displayName = 'FbMessengerModalsQueue';
export { FbMessengerModalsQueue };

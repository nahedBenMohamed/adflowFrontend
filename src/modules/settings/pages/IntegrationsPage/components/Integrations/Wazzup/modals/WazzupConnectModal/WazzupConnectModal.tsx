import { userStore } from '@/app';
import {
  invalidateChatProvidersInCache,
  useGetChatProviders,
  type WazzupProvider,
} from '@/modules/multichat';
import {
  MyInput,
  MySelect,
  UsersMultiselect,
  debounce,
  useModalControl,
  type ModalControl,
  type Nullable,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { WAZZUP_STATE_PARAM_KEY } from '../../../../../../../shared';
import { WazzupConnectModalStore } from '../../../../../../../store';
import { AccountActivityFormGroup } from '../../../../AccountActivityFormGroup/AccountActivityFormGroup';
import { AccountAvailableFormGroup } from '../../../../AccountAvailableFormGroup/AccountAvailableFormGroup';
import { ChangesNotSavedWarningModal } from '../../../../ChangesNotSavedWarningModal/ChangesNotSavedWarningModal';
import { EntitySettingsFormGroup } from '../../../../EntitySettingsFormGroup/EntitySettingsFormGroup';
import { IntegrationForm } from '../../../../IntegrationForm/IntegrationForm';
import { IntegrationFormGroup } from '../../../../IntegrationFormGroup/IntegrationFormGroup';
import { IntegrationInfoText } from '../../../../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../../../../IntegrationInfoTitle/IntegrationInfoTitle';
import { MessagesPerDaySelect } from '../../../../MessagesPerDaySelect/MessagesPerDaySelect';
import { WazzupModalTemplate } from '../WazzupModalTemplate/WazzupModalTemplate';

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  control: ModalControl;
  wazzupStateParam: Nullable<string>;
  manageModalControl: ModalControl;
  currentProviderSettings: Nullable<WazzupProvider>;
  clearCurrentProviderSettings: () => void;
}

const WazzupConnectModal = observer((props: Props) => {
  const {
    control,
    wazzupStateParam,
    manageModalControl,
    currentProviderSettings,
    clearCurrentProviderSettings,
  } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.wazzup.wazzup_connect_modal',
  });

  const [, setSearchParams] = useSearchParams();

  // so we can invalidate providers cache on save, in case they were not fetched later
  useGetChatProviders();

  const wazzupConnectModalStore = useMemo(
    () => new WazzupConnectModalStore({ wazzupStateParam, currentProviderSettings }),
    [wazzupStateParam, currentProviderSettings]
  );

  const warningModalControl = useModalControl(false);

  const {
    title,
    active,
    apiKey,
    messagePerDay,
    isApiKeyLoading,
    accessibleUserIds,
    supervisorUserIds,
    responsibleUserIds,
    currentWazzupChannelId,
    areWazzupChannelsLoading,
    isCreatingWazzupProvider,
    isUpdatingWazzupProvider,
    activeWazzupChannelsOptions,
    validateForm,
    isJsonStateChanged,
    entitySettingsStore,
    handleSelectWazzupChannel,
    loadWazzupChannelsByApiKey,
    updateWazzupProviderSettings,
    createWazzupProviderSettings,
  } = wazzupConnectModalStore;

  const stateChanged = isJsonStateChanged();

  const clearWazzupStateParam = useCallback(() => {
    if (wazzupStateParam)
      setSearchParams(prev => {
        prev.delete(WAZZUP_STATE_PARAM_KEY);

        return prev;
      });
  }, [wazzupStateParam, setSearchParams]);

  const handleClose = () => {
    control.close();

    if (currentProviderSettings) clearCurrentProviderSettings();

    clearWazzupStateParam();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebouncedChangeApiKey = useCallback(debounce(loadWazzupChannelsByApiKey, 500), []);

  const handleSaveProviderSettings = async (): Promise<void> => {
    if (!validateForm() || areWazzupChannelsLoading) return;

    if (currentProviderSettings) {
      await updateWazzupProviderSettings();
    } else {
      await createWazzupProviderSettings();
    }

    clearWazzupStateParam();

    handleClose();
    manageModalControl.open();

    invalidateChatProvidersInCache();
  };

  const handleCheckClose = () => {
    if (stateChanged) {
      warningModalControl.open();

      return;
    }

    clearWazzupStateParam();
    handleClose();
  };

  return (
    <WazzupModalTemplate
      opened={control.opened}
      approveDisabled={!stateChanged}
      loading={isCreatingWazzupProvider || isUpdatingWazzupProvider}
      approveTitle={currentProviderSettings ? t('update') : t('save')}
      hide={handleCheckClose}
      onApprove={handleSaveProviderSettings}
    >
      <TitleWrapper>
        <IntegrationInfoTitle>{t('title')}</IntegrationInfoTitle>
        <IntegrationInfoText>{t('subtitle')}</IntegrationInfoText>
      </TitleWrapper>

      <IntegrationForm>
        {/* We do not allow to edit the API key or the channel once provider is created */}
        {!currentProviderSettings && (
          <>
            <IntegrationFormGroup label={t('api_key')}>
              <MyInput
                model={apiKey}
                variant="outlined"
                loading={isApiKeyLoading}
                placeholder={t('placeholders.api_key')}
                handleChange={handleDebouncedChangeApiKey}
              />
            </IntegrationFormGroup>

            <IntegrationFormGroup label={t('channel')}>
              <MySelect
                model={currentWazzupChannelId}
                options={activeWazzupChannelsOptions}
                placeholder={t('placeholders.channel')}
                variant="outlined-without-active-shadow"
                optionsLoading={areWazzupChannelsLoading}
                handleChange={handleSelectWazzupChannel}
              />
            </IntegrationFormGroup>
          </>
        )}

        <IntegrationFormGroup label={t('name')}>
          <MyInput variant="outlined" placeholder={t('placeholders.name')} model={title} />
        </IntegrationFormGroup>

        <IntegrationFormGroup label={t('responsible_users')}>
          <UsersMultiselect
            withinPortal
            model={responsibleUserIds}
            users={userStore.activeUsers}
            variant="outlined-without-active-shadow"
            placeholder={t('placeholders.select_users')}
          />
        </IntegrationFormGroup>

        <IntegrationFormGroup label={t('supervisors')} hint={t('supervisors_hint')}>
          <UsersMultiselect
            withinPortal
            model={supervisorUserIds}
            users={userStore.activeUsers}
            variant="outlined-without-active-shadow"
            placeholder={t('placeholders.select_users')}
          />
        </IntegrationFormGroup>

        <MessagesPerDaySelect model={messagePerDay} />

        <AccountAvailableFormGroup accessibleUsersIds={accessibleUserIds} />

        <AccountActivityFormGroup active={active} />

        <EntitySettingsFormGroup entitySettingsStore={entitySettingsStore} />
      </IntegrationForm>

      {warningModalControl.opened && (
        <ChangesNotSavedWarningModal
          opened={warningModalControl.opened}
          onApprove={handleClose}
          hide={warningModalControl.close}
        />
      )}
    </WazzupModalTemplate>
  );
});

WazzupConnectModal.displayName = 'WazzupConnectModal';
export { WazzupConnectModal };

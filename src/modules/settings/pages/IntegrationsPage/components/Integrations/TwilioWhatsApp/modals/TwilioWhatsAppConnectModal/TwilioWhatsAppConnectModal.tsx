import { userStore } from '@/app';
import {
  invalidateChatProvidersInCache,
  useGetChatProviders,
  type TwilioProviderSettings,
} from '@/modules/multichat';
import { EntitySettingsFormGroup } from '@/modules/settings/pages/IntegrationsPage/components/EntitySettingsFormGroup/EntitySettingsFormGroup';
import {
  MyInput,
  UsersMultiselect,
  useModalControl,
  type ModalControl,
  type Nullable,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  TwilioWhatsAppConnectModalStore,
  twilioWhatsAppProviderSettingsStore,
} from '../../../../../../../store';
import { AccountActivityFormGroup } from '../../../../AccountActivityFormGroup/AccountActivityFormGroup';
import { AccountAvailableFormGroup } from '../../../../AccountAvailableFormGroup/AccountAvailableFormGroup';
import { ChangesNotSavedWarningModal } from '../../../../ChangesNotSavedWarningModal/ChangesNotSavedWarningModal';
import { IntegrationForm } from '../../../../IntegrationForm/IntegrationForm';
import { IntegrationFormGroup } from '../../../../IntegrationFormGroup/IntegrationFormGroup';
import { IntegrationInfoLink } from '../../../../IntegrationInfoLink/IntegrationInfoLink';
import { IntegrationInfoText } from '../../../../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../../../../IntegrationInfoTitle/IntegrationInfoTitle';
import { MessagesPerDaySelect } from '../../../../MessagesPerDaySelect/MessagesPerDaySelect';
import { TwilioWhatsAppModalTemplate } from '../TwilioWhatsAppModalTemplate/TwilioWhatsAppModalTemplate';

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  control: ModalControl;
  manageModalControl: ModalControl;
  currentProviderSettings: Nullable<TwilioProviderSettings>;
  clearCurrentProviderSettings: () => void;
}

const TwilioWhatsAppConnectModal = observer((props: Props) => {
  const { control, manageModalControl, currentProviderSettings, clearCurrentProviderSettings } =
    props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.whatsapp.whatsapp_connect_modal',
  });

  // so we can invalidate providers cache on save, in case they were not fetched later
  useGetChatProviders();

  const {
    isProviderSettingsAdding,
    isProviderSettingsUpdating,
    updateProviderSettings,
    addProviderSettings,
  } = twilioWhatsAppProviderSettingsStore;

  const twilioWhatsAppConnectModalStore = useMemo(
    () => new TwilioWhatsAppConnectModalStore(currentProviderSettings),
    [currentProviderSettings]
  );

  const {
    title,
    active,
    authToken,
    updateDto,
    createDto,
    accountSid,
    phoneNumber,
    messagePerDay,
    supervisorUserIds,
    accessibleUserIds,
    responsibleUserIds,
    entitySettingsStore,
    validateForm,
    isJsonStateChanged,
  } = twilioWhatsAppConnectModalStore;

  const stateChanged = isJsonStateChanged();

  const warningModalControl = useModalControl(false);

  const handleClose = () => {
    control.close();

    if (currentProviderSettings) clearCurrentProviderSettings();
  };

  const handleCheckClose = () => {
    if (stateChanged) {
      warningModalControl.open();

      return;
    }

    handleClose();
  };

  const handleSaveProvider = async (): Promise<void> => {
    if (!validateForm()) return;

    if (currentProviderSettings) {
      await updateProviderSettings({ id: currentProviderSettings.id, dto: updateDto });

      handleClose();
      manageModalControl.open();

      return;
    }

    authToken.required();

    if (!authToken.validate()) return;

    await addProviderSettings(createDto);

    handleClose();
    manageModalControl.open();

    invalidateChatProvidersInCache();
  };

  return (
    <TwilioWhatsAppModalTemplate
      opened={control.opened}
      approveDisabled={!stateChanged}
      loading={isProviderSettingsAdding || isProviderSettingsUpdating}
      approveTitle={currentProviderSettings ? t('update') : t('save')}
      hide={handleCheckClose}
      onApprove={handleSaveProvider}
    >
      <TitleWrapper>
        <IntegrationInfoTitle>{t('title')}</IntegrationInfoTitle>
        <IntegrationInfoText>{t('subtitle')}</IntegrationInfoText>
      </TitleWrapper>

      <IntegrationForm>
        <IntegrationFormGroup label={t('name')}>
          <MyInput variant="outlined" placeholder={t('placeholders.name')} model={title} />
        </IntegrationFormGroup>

        <IntegrationFormGroup label={t('sid')}>
          <MyInput variant="outlined" placeholder={t('placeholders.code')} model={accountSid} />
        </IntegrationFormGroup>

        <IntegrationFormGroup label={t('auth_token')}>
          <MyInput variant="outlined" placeholder={t('placeholders.token')} model={authToken} />
        </IntegrationFormGroup>

        <IntegrationFormGroup label={t('phone')}>
          <MyInput variant="outlined" placeholder={t('placeholders.number')} model={phoneNumber} />
        </IntegrationFormGroup>

        <MessagesPerDaySelect model={messagePerDay} />

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

        <AccountAvailableFormGroup accessibleUsersIds={accessibleUserIds} />

        <AccountActivityFormGroup active={active} />

        <EntitySettingsFormGroup entitySettingsStore={entitySettingsStore} />
      </IntegrationForm>

      <IntegrationInfoLink to="https://www.twilio.com/whatsapp" label={t('learn_more')} />

      {warningModalControl.opened && (
        <ChangesNotSavedWarningModal
          opened={warningModalControl.opened}
          onApprove={handleClose}
          hide={warningModalControl.close}
        />
      )}
    </TwilioWhatsAppModalTemplate>
  );
});

TwilioWhatsAppConnectModal.displayName = 'TwilioWhatsAppConnectModal';
export { TwilioWhatsAppConnectModal };

import { userStore } from '@/app';
import {
  invalidateChatProvidersInCache,
  useGetChatProviders,
  type MessengerProviderSettings,
} from '@/modules/multichat';
import { EntitySettingsFormGroup } from '@/modules/settings/pages/IntegrationsPage/components/EntitySettingsFormGroup/EntitySettingsFormGroup';
import {
  MyInput,
  UrlUtil,
  UsersMultiselect,
  envUtil,
  useModalControl,
  type ModalControl,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  FbMessengerConnectModalStore,
  fbMessengerProviderSettingsStore,
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
import { FbMessengerModalTemplate } from '../FbMessengerModalTemplate/FbMessengerModalTemplate';

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

interface Props {
  control: ModalControl;
  providerIdFromParams: number;
  manageModalControl: ModalControl;
  currentProviderSettings: MessengerProviderSettings;
  clearCurrentProviderSettings: () => void;
}

const FbMessengerConnectModal = observer((props: Props) => {
  const {
    control,
    manageModalControl,
    providerIdFromParams,
    currentProviderSettings,
    clearCurrentProviderSettings,
  } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.fb_messenger.fb_messenger_finish_modal',
  });

  useGetChatProviders();

  const { isProviderSettingsUpdating, updateProviderSettings } = fbMessengerProviderSettingsStore;

  const fbMessengerFinishModalStore = useMemo(
    () => new FbMessengerConnectModalStore(currentProviderSettings),
    [currentProviderSettings]
  );

  const {
    title,
    active,
    messagePerDay,
    accessibleUserIds,
    supervisorUserIds,
    responsibleUserIds,
    isJsonStateChanged,
    entitySettingsStore,
    validateForm,
  } = fbMessengerFinishModalStore;

  const warningModalControl = useModalControl(false);

  const stateChanged = isJsonStateChanged();

  const handleClose = () => {
    UrlUtil.clearURLQueryParams();

    if (currentProviderSettings) clearCurrentProviderSettings();

    control.close();
  };

  const handleCheckClose = () => {
    if (stateChanged || providerIdFromParams) {
      warningModalControl.open();

      return;
    }

    handleClose();
  };

  const handleApprove = async (): Promise<void> => {
    if (!validateForm()) return;

    const dto = fbMessengerFinishModalStore.updateDto;

    await updateProviderSettings({ id: currentProviderSettings.id, dto });

    handleClose();
    manageModalControl.open();

    invalidateChatProvidersInCache();
  };

  return (
    <FbMessengerModalTemplate
      opened={control.opened}
      approveTitle={t('save')}
      loading={isProviderSettingsUpdating}
      approveDisabled={isProviderSettingsUpdating}
      hide={handleCheckClose}
      onApprove={handleApprove}
    >
      <TitleWrapper>
        <IntegrationInfoTitle>{t('title', { company: envUtil.appName })}</IntegrationInfoTitle>
        <IntegrationInfoText $gray>{t('subtitle')}</IntegrationInfoText>
      </TitleWrapper>

      <IntegrationForm>
        <IntegrationFormGroup label={t('name')}>
          <MyInput variant="outlined" model={title} placeholder={t('placeholders.name')} />
        </IntegrationFormGroup>

        <IntegrationFormGroup label={t('responsible_users')}>
          <UsersMultiselect
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

      <IntegrationInfoLink
        target="_blank"
        label={t('learn_more')}
        to="https://www.facebook.com/help/405094243235242"
      />

      {warningModalControl.opened && (
        <ChangesNotSavedWarningModal
          opened={warningModalControl.opened}
          onApprove={handleClose}
          hide={warningModalControl.close}
        />
      )}
    </FbMessengerModalTemplate>
  );
});

FbMessengerConnectModal.displayName = 'FbMessengerConnectModal';
export { FbMessengerConnectModal };

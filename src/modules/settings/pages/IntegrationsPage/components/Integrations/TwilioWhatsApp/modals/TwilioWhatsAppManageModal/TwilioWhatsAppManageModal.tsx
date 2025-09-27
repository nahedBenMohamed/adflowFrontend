import { invalidateChatProvidersInCache, type TwilioProviderSettings } from '@/modules/multichat';
import type { ModalControl, Nullable } from '@/shared';
import { useTranslation } from 'react-i18next';
import { WhatsAppSmallIcon, type IntegrationSettingsAccount } from '../../../../../../../shared';
import { twilioWhatsAppProviderSettingsStore } from '../../../../../../../store';
import { IntegrationManageModalTemplate } from '../../../../IntegrationManageModalTemplate/IntegrationManageModalTemplate';

interface Props {
  control: ModalControl;
  providersSettings: TwilioProviderSettings[];
  openEditModal: (providerSettings: Nullable<TwilioProviderSettings>) => void;
}

const TwilioWhatsAppManageModal = (props: Props) => {
  const { control, providersSettings, openEditModal } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.whatsapp.whatsapp_manage_modal',
  });

  const { loadProviderSettingsById, deleteProviderSettings } = twilioWhatsAppProviderSettingsStore;

  const handleEdit = async (id: number): Promise<void> => {
    const providerSettings = await loadProviderSettingsById(id);

    openEditModal(providerSettings);
  };

  const accounts = providersSettings.map<IntegrationSettingsAccount>(ps => ({
    id: ps.id,
    title: ps.title,
    status: ps.status,
    phone: ps.phoneNumber,
    onEdit: () => handleEdit(ps.id),
    onDelete: () => deleteProviderSettings(ps.id),
  }));

  const handleOpenAddAccountModal = () => {
    openEditModal(null);
  };

  const handleCloseModal = () => {
    control.close();

    invalidateChatProvidersInCache();
  };

  return (
    <IntegrationManageModalTemplate
      accounts={accounts}
      headerTitle={t('title')}
      isOpened={control.opened}
      Icon={<WhatsAppSmallIcon />}
      onClose={handleCloseModal}
      openAddAccountModal={handleOpenAddAccountModal}
    />
  );
};

export { TwilioWhatsAppManageModal };
